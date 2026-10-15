/**
 * SITAS Certificate of Image Integrity — client-side vector PDF (jsPDF).
 * Environment-agnostic: caller passes font bytes as base64 (browser: fetch /fonts/*.ttf).
 */
import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

export type CertificateData = {
  fileName: string
  sha256: string
  width?: number | null
  height?: number | null
  manifestId?: string | null
  signer?: string | null
  capturedAt?: string | null
  verifiedAt: Date
  /** certificate (attested, red seal) or report (any verdict, grey stamp) */
  variant?: 'certificate' | 'report'
  verdict?: 'attested' | 'tampered' | 'not-attested'
  method?: 'lsb' | 'manifest' | 'none'
  signatureNote?: string | null
  grid?: [number, number] | null
  badBlocks?: number[] | null
}

export type CertFonts = { serifRegular: string; serifSemiBold: string }

const INK: [number, number, number] = [22, 22, 22]
const MUTED: [number, number, number] = [110, 110, 110]
const RED: [number, number, number] = [178, 34, 34]
const VERIFY_URL = 'http://sitas.tech/verify'

export function certificateNumber(sha256: string, d: Date, report = false) {
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, '')
  return `SITAS-${report ? 'R-' : ''}${ymd}-${sha256.slice(0, 8).toUpperCase()}`
}

const METHOD_TEXT = {
  lsb: 'Embedded LSB mark (SITAS-LSB-0, demo spec) · SHA-256 of LSB-cleared RGB · 32×32 block hashes · ECDSA P-256 verified (self-asserted key)',
  manifest: 'SHA-256 content hash · detached manifest · ECDSA P-256 (verified in Companion App)',
  none: 'SHA-256 content hash · embedded LSB mark search · no detached manifest supplied',
}

const VERDICT_TEXT = {
  attested: 'ATTESTED — integrity confirmed',
  tampered: 'TAMPERED — content differs from the attested state',
  'not-attested': 'NOT ATTESTED — no SITAS mark or manifest found',
}

const REPORT_STATEMENT = {
  attested:
    'This report records that the digital image identified below was examined and that its content matches the SITAS attestation recorded at capture.',
  tampered:
    'This report records that the digital image identified below carries SITAS attestation data, but its pixel content no longer matches the attested state. The regions that differ are listed below.',
  'not-attested':
    'This report records that the digital image identified below was examined and that no SITAS attestation (embedded mark or detached manifest) could be found. This does not imply the image is forged — only that its origin cannot be confirmed by SITAS.',
}

export function buildCertificatePdf(data: CertificateData, fonts: CertFonts): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  doc.addFileToVFS('EBG-R.ttf', fonts.serifRegular)
  doc.addFont('EBG-R.ttf', 'EBG', 'normal')
  doc.addFileToVFS('EBG-SB.ttf', fonts.serifSemiBold)
  doc.addFont('EBG-SB.ttf', 'EBG', 'bold')

  const W = 210
  const H = 297
  const cx = W / 2
  const report = data.variant === 'report'
  const verdict = data.verdict ?? 'attested'
  const method = data.method ?? 'manifest'
  const certNo = certificateNumber(data.sha256, data.verifiedAt, report)

  doc.setProperties({
    title: `SITAS Certificate of Image Integrity ${certNo}`,
    subject: 'Scientific Image Attestation',
    author: 'SITAS / Verisci',
    creator: 'sitas.tech',
  })

  // ---- background guilloche ----
  guilloche(doc, cx, 150, 62)
  // fine horizontal line pattern
  doc.setDrawColor(242, 242, 242)
  doc.setLineWidth(0.1)
  for (let y = 22; y < H - 22; y += 2.2) doc.line(20, y, W - 20, y)

  // ---- double border frame ----
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.8)
  doc.rect(10, 10, W - 20, H - 20)
  doc.setLineWidth(0.2)
  doc.rect(13, 13, W - 26, H - 26)
  // corner ornaments
  for (const [x, y] of [[13, 13], [W - 13, 13], [13, H - 13], [W - 13, H - 13]] as const) {
    doc.setFillColor(...INK)
    diamond(doc, x, y, 1.6)
  }

  // ---- logo mark ----
  logoMark(doc, cx, 33, 11)

  doc.setTextColor(...INK)
  doc.setFont('EBG', 'normal')
  doc.setFontSize(9)
  doc.setCharSpace(1.6)
  doc.text('S I T A S', cx, 51, { align: 'center' })
  doc.setCharSpace(0)

  doc.setFont('EBG', 'bold')
  doc.setFontSize(21)
  doc.setCharSpace(0.4)
  doc.text(report ? 'IMAGE VERIFICATION REPORT' : 'CERTIFICATE OF IMAGE INTEGRITY', cx, 66, { align: 'center' })
  doc.setCharSpace(0)

  doc.setFont('EBG', 'normal')
  doc.setFontSize(11.5)
  doc.setTextColor(...MUTED)
  doc.text('Scientific Image Attestation  ·  Issued by SITAS / Verisci', cx, 74, { align: 'center' })

  rule(doc, cx, 81, 60)

  // ---- statement ----
  doc.setTextColor(...INK)
  doc.setFontSize(12)
  const statement = report
    ? REPORT_STATEMENT[verdict]
    : method === 'lsb'
      ? 'This is to certify that the digital image identified below was presented for verification, that it carries a validly signed SITAS embedded mark, and that its pixel content (excluding the mark bits) matches the hash recorded in that mark at capture.'
      : 'This is to certify that the digital image identified below was presented for verification and that its SHA-256 content hash matches the value recorded in the accompanying detached SITAS manifest. To the extent of this check, the file is bit-for-bit identical to the image as attested at capture.'
  doc.text(doc.splitTextToSize(statement, 150), cx, 91, { align: 'center', lineHeightFactor: 1.4 })

  // ---- details table ----
  const rows: [string, string, boolean?][] = [
    [report ? 'Report No.' : 'Certificate No.', certNo],
    ...(report ? ([['Verdict', VERDICT_TEXT[verdict]]] as [string, string][]) : []),
    ['File name', data.fileName],
    ['SHA-256', data.sha256, true],
    ['Image dimensions', data.width && data.height ? `${data.width} × ${data.height} px` : '—'],
    ['Manifest ID', data.manifestId || '—'],
    ['Signer / device', data.signer || '—'],
    ['Capture time', data.capturedAt || '—'],
    ['Verification time', data.verifiedAt.toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' UTC')],
    ['Method', METHOD_TEXT[method]],
    ...(data.signatureNote ? ([['Signature', data.signatureNote]] as [string, string][]) : []),
  ]
  const tx = 28
  const vx = 74
  const vw = W - 28 - vx
  let y = report ? 116 : 122
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.15)
  doc.line(tx, y - 5, W - 28, y - 5)
  for (const [k, v, mono] of rows) {
    doc.setFont('EBG', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    doc.setCharSpace(0.5)
    doc.text(k.toUpperCase(), tx, y)
    doc.setCharSpace(0)
    doc.setTextColor(...INK)
    let lines: string[]
    if (mono) {
      doc.setFont('courier', 'normal')
      doc.setFontSize(8.6)
      lines = [v.slice(0, 32), v.slice(32)]
    } else {
      doc.setFont('EBG', 'normal')
      doc.setFontSize(11)
      lines = doc.splitTextToSize(v, vw)
    }
    doc.text(lines, vx, y, { lineHeightFactor: 1.35 })
    y += Math.max(1, lines.length) * (mono ? 4.2 : 5) + (report ? 2.8 : 3.6)
    doc.line(tx, y - 5, W - 28, y - 5)
  }

  // ---- lower band: QR · note · optional block map ----
  const qrY = y + 1
  qr(doc, VERIFY_URL, tx, qrY, 22)
  doc.setFont('EBG', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...MUTED)
  doc.text('sitas.tech/verify', tx + 11, qrY + 25.5, { align: 'center' })
  const hasMap = !!(data.grid && data.badBlocks && data.badBlocks.length)
  const noteW = hasMap ? 78 : report ? 122 : 96
  const mapW = 36
  const noteX = hasMap ? tx + 28 + mapW + 6 : tx + 28
  doc.setFontSize(9.2)
  doc.setTextColor(...INK)
  const note = hasMap
    ? `Block map (left): ${data.badBlocks!.length} of ${data.grid![0] * data.grid![1]} blocks (32×32 px) differ from their attested hashes. Filled cells mark the modified regions.`
    : method === 'lsb'
      ? 'Re-verification requires this image in a lossless format with its embedded mark intact. Any change to pixel content breaks the signed content and block hashes.'
      : 'Re-verification requires the original image file and its detached manifest. Any modification to the file — even a single byte — will produce a different SHA-256.'
  doc.text(doc.splitTextToSize(note, noteW), noteX, qrY + 5, { lineHeightFactor: 1.4 })
  if (hasMap) blockMap(doc, data.grid!, data.badBlocks!, tx + 28, qrY, mapW)

  // ---- signature lines ----
  const sy = 252
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.25)
  doc.line(32, sy, 88, sy)
  doc.line(122, sy, 178, sy)
  doc.setFont('EBG', 'normal')
  doc.setFontSize(10)
  doc.text('Authorized Signatory', 60, sy + 5, { align: 'center' })
  doc.text('Integrity Officer', 150, sy + 5, { align: 'center' })
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text('SITAS / Verisci', 60, sy + 9.5, { align: 'center' })
  doc.text('SITAS / Verisci', 150, sy + 9.5, { align: 'center' })

  // ---- seal (overlaps right signature) ----
  if (report) reportStamp(doc, 158, sy - 6, verdict, data.verifiedAt)
  else seal(doc, 158, sy - 6, 17.5, data.verifiedAt)

  // ---- footer disclaimer ----
  doc.setFont('EBG', 'normal')
  doc.setFontSize(7.2)
  doc.setTextColor(...MUTED)
  doc.text(
    doc.splitTextToSize(
      report
        ? 'Disclaimer: This report describes the result of an automated integrity check of the presented file at the stated time. Browser-issued reports are a preview. Embedded-mark verification follows the SITAS-LSB-0 draft specification and its public key is self-asserted until checked against a SITAS device registry. No claim is made about the scientific validity of the image content.'
        : method === 'lsb'
          ? 'Disclaimer: This certificate attests only that the presented file carries a validly signed SITAS-LSB-0 embedded mark matching its pixel content at the stated time. SITAS-LSB-0 is a draft/demo specification; the signing key is self-asserted until checked against a SITAS device registry. No claim is made about the scientific validity of the image content.'
          : 'Disclaimer: This certificate attests only that the presented file matches the content hash in the supplied detached manifest at the stated verification time. Browser-issued certificates are a preview: ECDSA P-256 signature and RFC 3161 timestamp validation are performed in the SITAS Companion App. This document makes no claim about scientific validity of the image content.',
      160,
    ),
    cx,
    266,
    { align: 'center', lineHeightFactor: 1.35 },
  )
  doc.setFontSize(7)
  doc.text(`${certNo}  ·  sitas.tech`, cx, 279.5, { align: 'center' })

  return doc
}

// ---------- drawing helpers ----------

function rule(doc: jsPDF, cx: number, y: number, w: number) {
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.2)
  doc.line(cx - w / 2, y, cx - 3, y)
  doc.line(cx + 3, y, cx + w / 2, y)
  doc.setFillColor(...INK)
  diamond(doc, cx, y, 1.1)
}

function diamond(doc: jsPDF, x: number, y: number, r: number) {
  doc.triangle(x - r, y, x, y - r, x + r, y, 'F')
  doc.triangle(x - r, y, x, y + r, x + r, y, 'F')
}

function polyline(doc: jsPDF, pts: [number, number][], close = false) {
  for (let i = 0; i < pts.length - 1; i++) doc.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1])
  if (close) doc.line(pts[pts.length - 1][0], pts[pts.length - 1][1], pts[0][0], pts[0][1])
}

function guilloche(doc: jsPDF, cx: number, cy: number, R: number) {
  doc.setLineWidth(0.12)
  doc.setDrawColor(232, 232, 232)
  for (let k = 0; k < 3; k++) {
    const r = 9 + k * 4
    const d = 11 - k * 2
    const n = 64 + k * 8
    const pts: [number, number][] = []
    const ratio = (R - r) / r
    for (let t = 0; t <= Math.PI * 2 * r; t += 0.02) {
      pts.push([
        cx + (R - r) * Math.cos(t) + d * Math.cos(ratio * t),
        cy + (R - r) * Math.sin(t) - d * Math.sin(ratio * t),
      ])
      if (pts.length > 4000) break
    }
    void n
    polyline(doc, pts)
  }
}

function logoMark(doc: jsPDF, cx: number, cy: number, s: number) {
  const k = s / 52
  const P = (x: number, y: number): [number, number] => [cx + (x - 60) * k, cy + (y - 60) * k]
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.45)
  polyline(doc, [P(60, 8), P(104, 34), P(104, 86), P(60, 112), P(16, 86), P(16, 34)], true)
  doc.setLineWidth(0.3)
  polyline(doc, [P(60, 42), P(78, 52), P(78, 68), P(60, 78), P(42, 68), P(42, 52)], true)
  for (const [a, b] of [
    [P(60, 18), P(60, 42)], [P(96, 39), P(78, 52)], [P(96, 81), P(78, 68)],
    [P(60, 102), P(60, 78)], [P(24, 81), P(42, 68)], [P(24, 39), P(42, 52)],
  ]) doc.line(a[0], a[1], b[0], b[1])
}

function qr(doc: jsPDF, text: string, x: number, y: number, size: number) {
  const q = QRCode.create(text, { errorCorrectionLevel: 'M' })
  const n = q.modules.size
  const cell = size / n
  doc.setFillColor(...INK)
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (q.modules.get(r, c)) doc.rect(x + c * cell, y + r * cell, cell + 0.02, cell + 0.02, 'F')
}

function seal(doc: jsPDF, cx: number, cy: number, R: number, date: Date) {
  const rot = -14 // degrees
  const GS = (doc as unknown as { GState: new (o: object) => unknown }).GState
  doc.saveGraphicsState()
  ;(doc as unknown as { setGState: (g: unknown) => void }).setGState(new GS({ opacity: 0.82 }))
  doc.setDrawColor(...RED)
  doc.setTextColor(...RED)
  doc.setFillColor(...RED)

  doc.setLineWidth(1.1)
  doc.circle(cx, cy, R)
  doc.setLineWidth(0.35)
  doc.circle(cx, cy, R - 1.8)
  doc.circle(cx, cy, R - 6.6)

  // circular text along the band
  const text = 'SITAS · SCIENTIFIC IMAGE INTEGRITY · VERIFIED · '
  doc.setFont('EBG', 'bold')
  doc.setFontSize(7)
  const rText = R - 5
  const chars = [...text]
  const step = 360 / chars.length
  chars.forEach((ch, i) => {
    const aDeg = 90 + rot - i * step // start at top, go clockwise
    const a = (aDeg * Math.PI) / 180
    const phi = aDeg - 90
    const w = doc.getTextWidth(ch)
    const pr = (phi * Math.PI) / 180
    const px = cx + rText * Math.cos(a) - (w / 2) * Math.cos(pr)
    const py = cy - rText * Math.sin(a) + (w / 2) * Math.sin(pr)
    doc.text(ch, px, py, { angle: phi })
  })

  // star
  const sr = 4.2
  const pts: [number, number][] = []
  for (let i = 0; i < 10; i++) {
    const a = ((90 + rot + i * 36) * Math.PI) / 180
    const r = i % 2 === 0 ? sr : sr * 0.42
    pts.push([cx + r * Math.cos(a), cy - 3.2 - r * Math.sin(a)])
  }
  const rel = pts.slice(1).map((pt, i) => [pt[0] - pts[i][0], pt[1] - pts[i][1]])
  doc.lines(rel, pts[0][0], pts[0][1], [1, 1], 'F', true)

  // date + label (rotated with seal)
  doc.setFont('EBG', 'bold')
  doc.setFontSize(6.2)
  const ds = date.toISOString().slice(0, 10)
  rotText(doc, ds, cx, cy + 4.4, rot)

  doc.restoreGraphicsState()
}

function rotText(doc: jsPDF, s: string, cx: number, cy: number, rot: number) {
  const w = doc.getTextWidth(s)
  const r = (rot * Math.PI) / 180
  // rotate offset vector (dx, dy) around (cx, cy-?) — keep simple: center the string on the point
  const dx = cx - cx
  const dy = cy - cy
  void dx
  void dy
  const px = cx - (w / 2) * Math.cos(r)
  const py = cy + (w / 2) * Math.sin(r)
  doc.text(s, px, py, { angle: rot })
}

function blockMap(doc: jsPDF, grid: [number, number], bad: number[], x: number, y: number, w: number) {
  const [gh, gw] = grid
  const cell = w / gw
  const h = cell * gh
  const set = new Set(bad)
  doc.setDrawColor(210, 210, 210)
  doc.setLineWidth(0.05)
  for (let r = 0; r < gh; r++)
    for (let c = 0; c < gw; c++) {
      if (set.has(r * gw + c)) {
        doc.setFillColor(...INK)
        doc.rect(x + c * cell, y + r * cell, cell, cell, 'F')
      } else doc.rect(x + c * cell, y + r * cell, cell, cell, 'S')
    }
  doc.setDrawColor(...INK)
  doc.setLineWidth(0.25)
  doc.rect(x, y, w, h)
  doc.setFont('EBG', 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(...MUTED)
  doc.text(`TAMPER MAP · ${gw}×${gh} blocks`, x, y + h + 3.4)
}

function reportStamp(doc: jsPDF, cx: number, cy: number, verdict: 'attested' | 'tampered' | 'not-attested', date: Date) {
  const GREY: [number, number, number] = [95, 95, 95]
  const rot = -8
  const GS = (doc as unknown as { GState: new (o: object) => unknown }).GState
  doc.saveGraphicsState()
  ;(doc as unknown as { setGState: (g: unknown) => void }).setGState(new GS({ opacity: 0.8 }))
  doc.setDrawColor(...GREY)
  doc.setTextColor(...GREY)
  const w = 46
  const h = 20
  const r = (rot * Math.PI) / 180
  const corner = (dx: number, dy: number): [number, number] => [cx + dx * Math.cos(r) + dy * Math.sin(r), cy - dx * Math.sin(r) + dy * Math.cos(r)]
  const box = (ww: number, hh: number) => {
    const pts = [corner(-ww / 2, -hh / 2), corner(ww / 2, -hh / 2), corner(ww / 2, hh / 2), corner(-ww / 2, hh / 2)]
    polyline(doc, pts, true)
  }
  doc.setLineWidth(0.9)
  box(w, h)
  doc.setLineWidth(0.3)
  box(w - 2.4, h - 2.4)
  doc.setFont('EBG', 'bold')
  doc.setFontSize(10.5)
  rotTextAt(doc, 'VERIFICATION REPORT', cx, cy, 0, -2.6, rot)
  doc.setFontSize(7.4)
  rotTextAt(doc, verdict === 'attested' ? 'ATTESTED' : verdict === 'tampered' ? 'TAMPERED' : 'NOT ATTESTED', cx, cy, 0, 2.2, rot)
  doc.setFont('EBG', 'normal')
  doc.setFontSize(6.2)
  rotTextAt(doc, `SITAS · ${date.toISOString().slice(0, 10)}`, cx, cy, 0, 6, rot)
  doc.restoreGraphicsState()
}

/** Draw centered text at local offset (dx, dy) of a box rotated by rot degrees around (cx, cy). */
function rotTextAt(doc: jsPDF, s: string, cx: number, cy: number, dx: number, dy: number, rot: number) {
  const r = (rot * Math.PI) / 180
  const ox = cx + dx * Math.cos(r) + dy * Math.sin(r)
  const oy = cy - dx * Math.sin(r) + dy * Math.cos(r)
  const w = doc.getTextWidth(s)
  doc.text(s, ox - (w / 2) * Math.cos(r), oy + (w / 2) * Math.sin(r), { angle: rot })
}
