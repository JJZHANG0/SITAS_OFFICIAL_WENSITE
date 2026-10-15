// Generates sample attested certificate + tampered report from the LSB samples (Node, same code as browser).
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { PNG } from 'pngjs'
import { decodeLsb } from '../src/lib/lsbWatermark.ts'
import { buildCertificatePdf } from '../src/lib/certificate.ts'
const root = new URL('../public/', import.meta.url).pathname
const fonts = {
  serifRegular: readFileSync(`${root}fonts/EBGaramond-Regular.ttf`).toString('base64'),
  serifSemiBold: readFileSync(`${root}fonts/EBGaramond-SemiBold.ttf`).toString('base64'),
}
const out = process.argv[2] || '/workspace'
for (const [file, name, variant] of [
  ['sitas-lsb-sample.png', 'sitas-cert-attested', 'certificate'],
  ['sitas-lsb-sample-tampered.png', 'sitas-report-tampered', 'report'],
] as const) {
  const buf = readFileSync(`${root}samples/${file}`)
  const png = PNG.sync.read(buf)
  const r = await decodeLsb({ width: png.width, height: png.height, data: png.data })
  if (!r.found) throw new Error('no mark in ' + file)
  const verdict = r.signatureValid && r.contentMatch ? 'attested' : 'tampered'
  const doc = buildCertificatePdf(
    {
      fileName: file,
      sha256: createHash('sha256').update(buf).digest('hex'),
      width: png.width,
      height: png.height,
      manifestId: `Embedded · copy ${r.copyIndex + 1}/3`,
      signer: r.meta.signer ?? r.meta.deviceId ?? null,
      capturedAt: r.meta.capturedAt?.replace('T', ' ').replace('Z', ' UTC') ?? null,
      verifiedAt: new Date(),
      variant,
      verdict,
      method: 'lsb',
      signatureNote: r.signatureValid ? 'Valid (ECDSA P-256 over embedded payload; key self-asserted, demo)' : 'INVALID',
      grid: r.grid,
      badBlocks: r.badBlocks,
    },
    fonts,
  )
  writeFileSync(`${out}/${name}.pdf`, Buffer.from(doc.output('arraybuffer')))
  console.log(name, verdict, r.badBlocks.length)
}
