"""SITAS embedded LSB mark v0 — reference encoder/decoder (DEMO). Spec: docs/lsb-watermark-v0.md

    python scripts/sitas_lsb_v0.py embed in.png out.png --device SB-DEMO-0001 --key key.pem
    python scripts/sitas_lsb_v0.py verify marked.png
"""
from __future__ import annotations
import argparse, base64, hashlib, json, struct, sys
from pathlib import Path
import numpy as np
from PIL import Image
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature, encode_dss_signature

MAGIC, VERSION, BLOCK, COPIES = b"SITAS", 0, 32, 3


def cleared_rgb(rgb: np.ndarray) -> np.ndarray:
    return (rgb & 0xFE).astype(np.uint8)


def content_hash(rgb: np.ndarray) -> str:
    return hashlib.sha256(cleared_rgb(rgb).tobytes()).hexdigest()


def block_hashes(rgb: np.ndarray) -> bytes:
    c = cleared_rgb(rgb)
    h, w, _ = c.shape
    out = bytearray()
    for by in range(0, h, BLOCK):
        for bx in range(0, w, BLOCK):
            out += hashlib.sha256(np.ascontiguousarray(c[by:by + BLOCK, bx:bx + BLOCK]).tobytes()).digest()[:4]
    return bytes(out)


def copy_offsets(n_bits: int) -> list[int]:
    return [(k * n_bits // COPIES) // 8 * 8 for k in range(COPIES)]


def build_frame(body: bytes, sig_raw: bytes) -> bytes:
    return MAGIC + bytes([VERSION]) + struct.pack(">I", len(body)) + body + \
        hashlib.sha256(body).digest()[:4] + bytes([len(sig_raw)]) + sig_raw


def embed(src: Path, dst: Path, key: ec.EllipticCurvePrivateKey, device_id: str, signer: str, captured_at: str):
    im = Image.open(src)
    mode = "RGBA" if im.mode in ("RGBA", "LA") else "RGB"
    arr = np.array(im.convert(mode))
    rgb = arr[..., :3]
    h, w, _ = rgb.shape
    pub = key.public_key().public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
    body = json.dumps({
        "spec": "SITAS-LSB-0", "width": w, "height": h, "block": BLOCK,
        "contentHash": content_hash(rgb), "blocks": base64.b64encode(block_hashes(rgb)).decode(),
        "deviceId": device_id, "signer": signer, "capturedAt": captured_at,
        "publicKey": base64.b64encode(pub).decode(),
    }, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    r, s = decode_dss_signature(key.sign(body, ec.ECDSA(hashes.SHA256())))
    frame = build_frame(body, r.to_bytes(32, "big") + s.to_bytes(32, "big"))
    bits = np.unpackbits(np.frombuffer(frame, np.uint8))
    flat = rgb.reshape(-1).copy()
    n = flat.size
    if len(bits) > n // COPIES:
        raise SystemExit("image too small for payload")
    for off in copy_offsets(n):
        flat[off:off + len(bits)] = (flat[off:off + len(bits)] & 0xFE) | bits
    arr[..., :3] = flat.reshape(rgb.shape)
    Image.fromarray(arr, mode).save(dst, "PNG")
    return json.loads(body)


def extract(path: Path) -> dict:
    arr = np.array(Image.open(path).convert("RGB"))
    flat = arr.reshape(-1)
    lsb = flat & 1
    for off in copy_offsets(flat.size):
        def rd(byte_off: int, n: int) -> bytes:
            s = off + byte_off * 8
            return np.packbits(lsb[s:s + n * 8]).tobytes()
        if rd(0, 6) != MAGIC + bytes([VERSION]):
            continue
        blen = struct.unpack(">I", rd(6, 4))[0]
        if blen > 4_000_000:
            continue
        body = rd(10, blen)
        if rd(10 + blen, 4) != hashlib.sha256(body).digest()[:4]:
            continue
        slen = rd(14 + blen, 1)[0]
        sig = rd(15 + blen, slen)
        meta = json.loads(body)
        pk = serialization.load_der_public_key(base64.b64decode(meta["publicKey"]))
        try:
            pk.verify(encode_dss_signature(int.from_bytes(sig[:32], "big"), int.from_bytes(sig[32:], "big")),
                      body, ec.ECDSA(hashes.SHA256()))
            sig_ok = True
        except Exception:
            sig_ok = False
        ref = base64.b64decode(meta["blocks"])
        now = block_hashes(arr)
        bad = [i for i in range(len(ref) // 4) if ref[i * 4:i * 4 + 4] != now[i * 4:i * 4 + 4]]
        return {"found": True, "signature_valid": sig_ok,
                "content_match": content_hash(arr) == meta["contentHash"], "bad_blocks": bad, "meta": meta}
    return {"found": False}


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    e = sub.add_parser("embed"); e.add_argument("src"); e.add_argument("dst")
    e.add_argument("--key", required=True); e.add_argument("--device", default="SB-DEMO-0001")
    e.add_argument("--signer", default="SITAS BASIC · Device SB-DEMO-0001 (demo key)")
    e.add_argument("--captured", default="2026-10-12T08:41:27Z")
    v = sub.add_parser("verify"); v.add_argument("path")
    a = ap.parse_args()
    if a.cmd == "embed":
        kp = Path(a.key)
        if kp.exists():
            key = serialization.load_pem_private_key(kp.read_bytes(), None)
        else:
            key = ec.generate_private_key(ec.SECP256R1())
            kp.write_bytes(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8,
                                             serialization.NoEncryption()))
        embed(Path(a.src), Path(a.dst), key, a.device, a.signer, a.captured)
        print("embedded →", a.dst)
    else:
        r = extract(Path(a.path))
        r.pop("meta", None) if r.get("found") else None
        print(json.dumps(r)); sys.exit(0 if r.get("found") else 1)
