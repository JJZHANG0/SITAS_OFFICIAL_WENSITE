/** Client-side SITAS verification helpers (browser preview). */

export type ParsedManifest = {
  raw: Record<string, unknown>
  manifestId: string | null
  contentHash: string | null
  signer: string | null
  timestamp: string | null
  algorithm: string | null
  signaturePresent: boolean
  tsaPresent: boolean
}

export type VerifyOutcome =
  | { kind: 'need-image' }
  | {
      kind: 'not-attested'
      fileName: string
      fileSize: number
      imageHash: string
    }
  | {
      kind: 'mismatch'
      fileName: string
      fileSize: number
      imageHash: string
      manifest: ParsedManifest
    }
  | {
      kind: 'attested'
      fileName: string
      fileSize: number
      imageHash: string
      manifest: ParsedManifest
    }

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
  return null
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const nested = v as Record<string, unknown>
      // e.g. hash: { sha256: "..." }
      for (const nk of ['sha256', 'SHA-256', 'value', 'hex', 'digest']) {
        const nv = nested[nk]
        if (typeof nv === 'string' && nv.trim()) return nv.trim()
      }
    }
  }
  return null
}

/** Normalize hex hash for comparison (lowercase, no 0x/whitespace). */
export function normalizeHash(h: string): string {
  return h.replace(/^0x/i, '').replace(/\s+/g, '').toLowerCase()
}

export async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function parseManifestJson(text: string): ParsedManifest | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return null
  }
  const root = asRecord(parsed)
  if (!root) return null

  // Allow { manifest: { ... } } wrappers
  const body = asRecord(root.manifest) ?? asRecord(root.attestation) ?? root

  const contentHash = pickString(body, [
    'contentHash',
    'content_hash',
    'sha256',
    'SHA-256',
    'hash',
    'imageHash',
    'image_hash',
    'digest',
  ])

  const signer = pickString(body, [
    'signer',
    'signerId',
    'signer_id',
    'deviceId',
    'device_id',
    'labId',
    'lab_id',
    'issuer',
    'subject',
  ])

  const timestamp = pickString(body, [
    'timestamp',
    'time',
    'capturedAt',
    'captured_at',
    'signedAt',
    'signed_at',
    'tsaTime',
    'tsa_time',
    'rfc3161Time',
  ])

  const algorithm =
    pickString(body, ['algorithm', 'hashAlg', 'hash_alg', 'digestAlgorithm']) ??
    (contentHash ? 'SHA-256' : null)

  const signaturePresent = Boolean(
    pickString(body, ['signature', 'sig', 'ecdsa', 'ecdsaSignature']) ||
      body.signature ||
      body.ecdsa,
  )

  const tsaPresent = Boolean(
    pickString(body, ['tsa', 'tsaToken', 'rfc3161', 'trustedTimestamp']) ||
      body.tsa ||
      body.rfc3161,
  )

  const manifestId = pickString(body, ['manifestId', 'manifest_id', 'id', 'uuid'])
  return {
    raw: body,
    manifestId,
    contentHash,
    signer,
    timestamp,
    algorithm,
    signaturePresent,
    tsaPresent,
  }
}

export async function runVerification(
  imageFile: File | null,
  manifestText: string | null,
): Promise<VerifyOutcome> {
  if (!imageFile) return { kind: 'need-image' }

  const buf = await imageFile.arrayBuffer()
  const imageHash = await sha256Hex(buf)

  if (!manifestText || !manifestText.trim()) {
    return {
      kind: 'not-attested',
      fileName: imageFile.name,
      fileSize: imageFile.size,
      imageHash,
    }
  }

  const manifest = parseManifestJson(manifestText)
  if (!manifest || !manifest.contentHash) {
    return {
      kind: 'not-attested',
      fileName: imageFile.name,
      fileSize: imageFile.size,
      imageHash,
    }
  }

  const match = normalizeHash(manifest.contentHash) === normalizeHash(imageHash)
  if (!match) {
    return {
      kind: 'mismatch',
      fileName: imageFile.name,
      fileSize: imageFile.size,
      imageHash,
      manifest,
    }
  }

  return {
    kind: 'attested',
    fileName: imageFile.name,
    fileSize: imageFile.size,
    imageHash,
    manifest,
  }
}

export function buildCertificateHtml(opts: {
  title: string
  status: string
  rows: [string, string][]
  note: string
  footer: string
  generatedAt: string
}): string {
  const rowsHtml = opts.rows
    .map(
      ([k, v]) =>
        `<tr><th>${escapeHtml(k)}</th><td><code>${escapeHtml(v)}</code></td></tr>`,
    )
    .join('')
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(opts.title)}</title>
<style>
  body{font-family:ui-sans-serif,system-ui,sans-serif;max-width:720px;margin:48px auto;padding:0 24px;color:#111;background:#fff}
  h1{font-weight:500;letter-spacing:-0.03em;font-size:28px;margin:0 0 8px}
  .status{display:inline-block;border:1px solid #111;padding:8px 12px;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;margin:16px 0 28px}
  table{width:100%;border-collapse:collapse}
  th,td{text-align:left;vertical-align:top;padding:12px 0;border-bottom:1px solid #ddd;font-size:13px}
  th{width:34%;color:#666;font-family:ui-monospace,monospace;font-weight:400;font-size:10px;letter-spacing:0.12em;text-transform:uppercase}
  code{font-family:ui-monospace,monospace;font-size:12px;word-break:break-all}
  .note{color:#666;font-size:12px;line-height:1.6;margin-top:28px}
  footer{margin-top:40px;font-size:10px;color:#888;letter-spacing:0.08em;text-transform:uppercase}
  @media print{body{margin:24px}}
</style>
</head>
<body>
  <h1>${escapeHtml(opts.title)}</h1>
  <div class="status">${escapeHtml(opts.status)}</div>
  <table>${rowsHtml}</table>
  <p class="note">${escapeHtml(opts.note)}</p>
  <footer>${escapeHtml(opts.footer)} · ${escapeHtml(opts.generatedAt)}</footer>
</body>
</html>`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
