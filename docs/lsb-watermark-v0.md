# SITAS embedded LSB mark — format v0 (DRAFT / DEMO)

> **Status: proposal, not shipped in the SITAS App.**
> The current App (`SITAS-Mac构建包/sitas_core.py`, `SPEC_VERSION = "SITAS-1.0"`) never writes to pixels:
> evidence lives in a detached `.sitas.json` manifest (lines 4–7, `attest()` at L151). This document
> specifies an *optional* embedded mark so that a third party holding only the image can verify it.
> Adopting it is a product/compliance decision: writing LSBs modifies the file, which conflicts with
> the App's ALCOA+ "Original" rule unless the marked file is treated as a derived, labelled copy.

## 1. Carrier
- Lossless RGB(A) raster only (PNG; TIFF if decoded losslessly). JPEG / lossy WebP destroy the mark.
- Bitstream: pixels in row-major order (y, then x); for each pixel the channels **R, G, B** (alpha untouched).
  Carrier bit = `channel & 1`. Total capacity `N = W × H × 3` bits.
- Bytes are packed **MSB-first** (first carrier bit = bit 7 of byte 0).

## 2. Frame
| Field | Size | Value |
|---|---|---|
| magic | 5 B | ASCII `SITAS` |
| version | 1 B | `0x00` |
| bodyLen | 4 B | uint32 big-endian |
| body | bodyLen | UTF-8 JSON (see §4), exact bytes are what is signed |
| check | 4 B | first 4 bytes of `SHA-256(body)` |
| sigLen | 1 B | `64` |
| sig | 64 B | ECDSA P-256 / SHA-256 over `body`, raw `r‖s` (32+32 B, big-endian) |

## 3. Redundancy
The frame is written **3 times**, copy *k* (k = 0,1,2) starting at carrier bit `floor(k·N/3/8)·8`.
Decoders try copies in order and accept the first whose magic, version, length and `check` are valid.
Carrier bits outside the copies keep their original values.

## 4. Body JSON
```json
{
  "spec": "SITAS-LSB-0",
  "width": 1200, "height": 900, "block": 32,
  "contentHash": "<hex SHA-256 of cleared RGB stream>",
  "blocks": "<base64 of 4-byte truncated block hashes, row-major>",
  "deviceId": "SB-DEMO-0001",
  "signer": "SITAS BASIC · Device SB-DEMO-0001",
  "capturedAt": "2026-10-12T08:41:27Z",
  "publicKey": "<base64 SPKI DER of the P-256 public key>"
}
```

### contentHash
SHA-256 over the byte stream `(R & 0xFE, G & 0xFE, B & 0xFE)` for every pixel in row-major order.
Clearing the LSB makes the hash independent of the embedded mark.

### blocks
Grid of `ceil(H/32) × ceil(W/32)` blocks (edge blocks may be smaller). For each block in row-major order,
SHA-256 over the cleared RGB bytes of its pixels (row-major within the block); keep the first 4 bytes.
A mismatching block localises an edit to that 32×32 region.

## 5. Verification
1. Decode losslessly; reject lossy formats as *Unreadable*.
2. Find a valid frame (§3). None → *Not attested* (no SITAS mark).
3. Verify `sig` over `body` with `publicKey`. Recompute `contentHash` and `blocks`.
4. Signature valid and `contentHash` matches → *Attested*. Otherwise → *Tampered* (list mismatching blocks).
5. **Trust:** `publicKey` is self-asserted inside the image. A valid signature proves integrity since signing,
   not identity — the key must additionally be checked against a SITAS device registry (not yet available).

## 6. Reference implementations
- Encoder/decoder (Python, App-ready): `scripts/sitas_lsb_v0.py`
- Browser decoder: `src/lib/lsbWatermark.ts`
