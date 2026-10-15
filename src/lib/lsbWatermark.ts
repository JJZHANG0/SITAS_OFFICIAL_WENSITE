/**
 * SITAS embedded LSB mark v0 — decoder (DEMO / spec preview). See docs/lsb-watermark-v0.md.
 * Works on any RGBA raster ({width,height,data}); uses WebCrypto (browser + Node 20).
 */
export type Raster = { width: number; height: number; data: Uint8ClampedArray | Uint8Array }

export type LsbMeta = {
  spec: string
  width: number
  height: number
  block: number
  contentHash: string
  blocks: string
  deviceId?: string
  signer?: string
  capturedAt?: string
  publicKey: string
}

export type LsbResult =
  | { found: false }
  | {
      found: true
      meta: LsbMeta
      copyIndex: number
      signatureValid: boolean
      contentHash: string
      contentMatch: boolean
      grid: [number, number]
      badBlocks: number[]
    }

const MAGIC = [0x53, 0x49, 0x54, 0x41, 0x53] // "SITAS"
const COPIES = 3

const subtle = () => (globalThis.crypto as Crypto).subtle

async function sha256(bytes: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await subtle().digest('SHA-256', bytes as BufferSource))
}
const hex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
const b64d = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

/** Cleared RGB stream (R&0xFE,G&0xFE,B&0xFE) row-major, alpha dropped. */
function clearedRgb(r: Raster): Uint8Array {
  const n = r.width * r.height
  const out = new Uint8Array(n * 3)
  for (let i = 0, j = 0; i < n; i++, j += 3) {
    out[j] = r.data[i * 4] & 0xfe
    out[j + 1] = r.data[i * 4 + 1] & 0xfe
    out[j + 2] = r.data[i * 4 + 2] & 0xfe
  }
  return out
}

async function blockHashes(c: Uint8Array, w: number, h: number, B: number): Promise<Uint8Array[]> {
  const out: Promise<Uint8Array>[] = []
  for (let by = 0; by < h; by += B) {
    for (let bx = 0; bx < w; bx += B) {
      const bw = Math.min(B, w - bx)
      const bh = Math.min(B, h - by)
      const buf = new Uint8Array(bw * bh * 3)
      for (let y = 0; y < bh; y++) buf.set(c.subarray(((by + y) * w + bx) * 3, ((by + y) * w + bx + bw) * 3), y * bw * 3)
      out.push(sha256(buf).then((d) => d.subarray(0, 4)))
    }
  }
  return Promise.all(out)
}

function readFrame(r: Raster, bitOffset: number) {
  const nBits = r.width * r.height * 3
  const bit = (k: number) => {
    const idx = bitOffset + k
    if (idx >= nBits) return 0
    const p = Math.floor(idx / 3)
    return r.data[p * 4 + (idx % 3)] & 1
  }
  const bytes = (byteOff: number, n: number) => {
    const out = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      let v = 0
      for (let b = 0; b < 8; b++) v = (v << 1) | bit((byteOff + i) * 8 + b)
      out[i] = v
    }
    return out
  }
  const head = bytes(0, 10)
  for (let i = 0; i < 5; i++) if (head[i] !== MAGIC[i]) return null
  if (head[5] !== 0) return null
  const len = ((head[6] << 24) | (head[7] << 16) | (head[8] << 8) | head[9]) >>> 0
  if (len <= 0 || len > 4_000_000 || (10 + len + 5) * 8 > nBits / COPIES + 64) return null
  const body = bytes(10, len)
  const check = bytes(10 + len, 4)
  const sigLen = bytes(14 + len, 1)[0]
  const sig = bytes(15 + len, sigLen)
  return { body, check, sig }
}

async function verifySig(spkiB64: string, body: Uint8Array, sigRaw: Uint8Array) {
  try {
    const key = await subtle().importKey('spki', b64d(spkiB64) as BufferSource, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify'])
    return await subtle().verify({ name: 'ECDSA', hash: 'SHA-256' }, key, sigRaw as BufferSource, body as BufferSource)
  } catch {
    return false
  }
}

export async function decodeLsb(r: Raster): Promise<LsbResult> {
  const nBits = r.width * r.height * 3
  for (let k = 0; k < COPIES; k++) {
    const off = Math.floor((k * nBits) / COPIES / 8) * 8
    const f = readFrame(r, off)
    if (!f) continue
    const d = await sha256(f.body)
    if (d[0] !== f.check[0] || d[1] !== f.check[1] || d[2] !== f.check[2] || d[3] !== f.check[3]) continue
    let meta: LsbMeta
    try {
      meta = JSON.parse(new TextDecoder().decode(f.body))
    } catch {
      continue
    }
    if (meta.spec !== 'SITAS-LSB-0') continue
    const signatureValid = await verifySig(meta.publicKey, f.body, f.sig)
    const c = clearedRgb(r)
    const contentHash = hex(await sha256(c))
    const B = meta.block || 32
    const grid: [number, number] = [Math.ceil(r.height / B), Math.ceil(r.width / B)]
    const ref = b64d(meta.blocks)
    const now = await blockHashes(c, r.width, r.height, B)
    const badBlocks: number[] = []
    const sizeOk = meta.width === r.width && meta.height === r.height
    now.forEach((h, i) => {
      if (!sizeOk || h[0] !== ref[i * 4] || h[1] !== ref[i * 4 + 1] || h[2] !== ref[i * 4 + 2] || h[3] !== ref[i * 4 + 3]) badBlocks.push(i)
    })
    return {
      found: true,
      meta,
      copyIndex: k,
      signatureValid,
      contentHash,
      contentMatch: sizeOk && contentHash === meta.contentHash,
      grid,
      badBlocks: sizeOk ? badBlocks : [],
    }
  }
  return { found: false }
}

/** Browser: decode a File to RGBA without colour management. Returns null if not decodable. */
export async function fileToRaster(file: File): Promise<Raster | null> {
  try {
    const bmp = await createImageBitmap(file, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })
    const c = document.createElement('canvas')
    c.width = bmp.width
    c.height = bmp.height
    const ctx = c.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null
    ctx.drawImage(bmp, 0, 0)
    const id = ctx.getImageData(0, 0, bmp.width, bmp.height)
    return { width: id.width, height: id.height, data: id.data }
  } catch {
    return null
  }
}

/** Lossy formats cannot carry an LSB mark. */
export function isLossy(file: File) {
  return /jpe?g$/i.test(file.name) || file.type === 'image/jpeg' || file.type === 'image/heic'
}
