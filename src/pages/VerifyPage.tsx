import { useCallback, useEffect, useState, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'
import { runVerification, type VerifyOutcome } from '../lib/verifyImage'

const SAMPLE_IMG = '/samples/sitas-sample-micrograph.png'
const SAMPLE_MANIFEST = '/samples/sitas-sample-micrograph.sitas.json'

function fmtSize(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(2)} MB` : `${(n / 1024).toFixed(1)} KB`
}

async function toBase64(url: string) {
  const buf = await (await fetch(url)).arrayBuffer()
  let bin = ''
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin)
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 15h6M9 18h4" />
    </svg>
  )
}

function DropCard({
  id, label, title, hint, accept, icon, dropLabel, sub, file, thumb, onFile, onClear, clearLabel, replaceLabel,
}: {
  id: string
  label: string
  title: string
  hint: string
  accept: string
  icon: React.ReactNode
  dropLabel: string
  sub: string
  file: { name: string; size: number } | null
  thumb?: string | null
  onFile: (f: File) => void
  onClear: () => void
  clearLabel: string
  replaceLabel: string
}) {
  const [drag, setDrag] = useState(false)
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }
  return (
    <div className={`vcard${file ? ' has-file' : ''}`}>
      <div className="vcard__head">
        <span className="vcard__label">{label}</span>
      </div>
      <h3 className="vcard__title">{title}</h3>
      <p className="vcard__hint">{hint}</p>
      <input
        id={id}
        className="vcard__input"
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
      {file ? (
        <div className="vcard__file">
          {thumb ? <img className="vcard__thumb" src={thumb} alt="" /> : <span className="vcard__fileicon">{icon}</span>}
          <span className="vcard__meta">
            <span className="vcard__name">{file.name}</span>
            <span className="vcard__size">{fmtSize(file.size)}</span>
          </span>
          <span className="vcard__fileactions">
            <label htmlFor={id} className="vcard__link">{replaceLabel}</label>
            <button type="button" className="vcard__link" onClick={onClear}>{clearLabel}</button>
          </span>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`vcard__drop${drag ? ' is-drag' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <span className="vcard__icon">{icon}</span>
          <span className="vcard__droplabel">{dropLabel}</span>
          <span className="vcard__sub">{sub}</span>
        </label>
      )}
    </div>
  )
}

export function VerifyPage() {
  const { t } = useSite()
  const [image, setImage] = useState<File | null>(null)
  const [thumb, setThumb] = useState<string | null>(null)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [manifest, setManifest] = useState<{ name: string; size: number; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [sampleBusy, setSampleBusy] = useState(false)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [outcome, setOutcome] = useState<VerifyOutcome | null>(null)

  useEffect(() => () => { if (thumb) URL.revokeObjectURL(thumb) }, [thumb])

  const setImageFile = useCallback((file: File) => {
    setImage(file)
    setOutcome(null)
    setDims(null)
    const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    setThumb(url)
    if (url) {
      const im = new Image()
      im.onload = () => setDims({ w: im.naturalWidth, h: im.naturalHeight })
      im.src = url
    }
  }, [])

  const setManifestFile = useCallback(async (file: File) => {
    setManifest({ name: file.name, size: file.size, text: await file.text() })
    setOutcome(null)
  }, [])

  const loadSample = async () => {
    setSampleBusy(true)
    try {
      const [ib, mt] = await Promise.all([
        fetch(SAMPLE_IMG).then((r) => r.blob()),
        fetch(SAMPLE_MANIFEST).then((r) => r.text()),
      ])
      setImageFile(new File([ib], 'sitas-sample-micrograph.png', { type: 'image/png' }))
      setManifest({ name: 'sitas-sample-micrograph.sitas.json', size: mt.length, text: mt })
    } finally {
      setSampleBusy(false)
    }
  }

  const onRun = async () => {
    if (!image) return
    setBusy(true)
    try {
      setOutcome(await runVerification(image, manifest?.text ?? null))
    } finally {
      setBusy(false)
    }
  }

  const downloadPdf = async () => {
    if (!outcome || outcome.kind !== 'attested') return
    setPdfBusy(true)
    try {
      const [{ buildCertificatePdf, certificateNumber }, serifRegular, serifSemiBold] = await Promise.all([
        import('../lib/certificate'),
        toBase64('/fonts/EBGaramond-Regular.ttf'),
        toBase64('/fonts/EBGaramond-SemiBold.ttf'),
      ])
      const m = outcome.manifest
      const raw = m.raw as Record<string, unknown>
      const w = dims?.w ?? (typeof raw.width === 'number' ? raw.width : null)
      const h = dims?.h ?? (typeof raw.height === 'number' ? raw.height : null)
      const now = new Date()
      const doc = buildCertificatePdf(
        {
          fileName: outcome.fileName,
          sha256: outcome.imageHash,
          width: w,
          height: h,
          manifestId: m.manifestId,
          signer: m.signer,
          capturedAt: m.timestamp ? m.timestamp.replace('T', ' ').replace(/Z$/, ' UTC') : null,
          verifiedAt: now,
        },
        { serifRegular, serifSemiBold },
      )
      doc.save(`${certificateNumber(outcome.imageHash, now)}.pdf`)
    } finally {
      setPdfBusy(false)
    }
  }

  const verdict =
    outcome?.kind === 'attested' ? 'ok' : outcome?.kind === 'mismatch' ? 'bad' : outcome?.kind === 'not-attested' ? 'none' : null

  return (
    <section className="slide page-deep verify visible" id="verify">
      <div className="page-no">VERIFY / 查验</div>

      <div className="page-hero-row">
        <Reveal className="page-hero">
          <p className="eyebrow">{t.verifyKicker}</p>
          <h1 className="headline-oneline">{t.verifyTitle}</h1>
          <p className="page-lead">{t.verifyLead}</p>
        </Reveal>
      </div>

      <Reveal className="vflow" delay={40}>
        <div className="vgrid">
          <DropCard
            id="verify-image"
            label={t.verifyCardImage}
            title={t.verifyImageTitle}
            hint={t.verifyImageHint}
            accept="image/*,.tif,.tiff"
            icon={<UploadIcon />}
            dropLabel={t.verifyImageDrop}
            sub={t.verifyImageSub}
            file={image ? { name: image.name, size: image.size } : null}
            thumb={thumb}
            onFile={setImageFile}
            onClear={() => { setImage(null); setThumb(null); setDims(null); setOutcome(null) }}
            clearLabel={t.verifyClear}
            replaceLabel={t.verifyReplace}
          />
          <DropCard
            id="verify-manifest"
            label={t.verifyCardManifest}
            title={t.verifyManifestTitle}
            hint={t.verifyManifestHint}
            accept=".json,.sitas,application/json,text/plain"
            icon={<DocIcon />}
            dropLabel={t.verifyManifestDrop}
            sub={t.verifyManifestSub}
            file={manifest ? { name: manifest.name, size: manifest.size } : null}
            onFile={(f) => void setManifestFile(f)}
            onClear={() => { setManifest(null); setOutcome(null) }}
            clearLabel={t.verifyClear}
            replaceLabel={t.verifyReplace}
          />
        </div>

        <div className="vbar">
          <p className="vbar__explainer">{t.verifyExplainer}</p>
          <div className="vbar__actions">
            <button type="button" className="vbar__sample" onClick={() => void loadSample()} disabled={sampleBusy}>
              {sampleBusy ? t.verifyLoadingSample : t.verifyTrySample}
            </button>
            <button
              type="button"
              className="cta-btn cta-btn--primary cta-btn--wide"
              onClick={() => void onRun()}
              disabled={!image || busy}
            >
              {busy ? t.verifyRunning : t.verifyRun}
            </button>
          </div>
        </div>
      </Reveal>

      {outcome && outcome.kind !== 'need-image' ? (
        <div className={`vresult vresult--${verdict}`} aria-live="polite">
          <div className="vresult__head">
            <span className="vresult__label">{t.verifyResultTitle}</span>
            <span className="vresult__demo">{t.verifyStatusDemo}</span>
          </div>
          <div className="vresult__verdict">
            <span className="vresult__dot" aria-hidden="true" />
            <h2>
              {outcome.kind === 'attested'
                ? t.verifyStatusAttested
                : outcome.kind === 'mismatch'
                  ? t.verifyStatusTampered
                  : t.verifyStatusNotAttested}
            </h2>
          </div>
          <p className="vresult__msg">
            {outcome.kind === 'attested'
              ? t.verifyMsgAttested
              : outcome.kind === 'mismatch'
                ? t.verifyMsgTampered
                : t.verifyMsgNotAttested}
          </p>

          <dl className="vresult__table">
            <div><dt>{t.verifyFileLabel}</dt><dd>{outcome.fileName} · {fmtSize(outcome.fileSize)}</dd></div>
            {dims ? <div><dt>{t.verifyDimensionsLabel}</dt><dd>{dims.w} × {dims.h} px</dd></div> : null}
            <div><dt>{t.verifyHashLabel}</dt><dd className="mono">{outcome.imageHash}</dd></div>
            {outcome.kind === 'not-attested' ? (
              <div><dt>{t.verifyMatchLabel}</dt><dd>{t.verifyNoManifestNote}</dd></div>
            ) : (
              <>
                <div>
                  <dt>{t.verifyMatchLabel}</dt>
                  <dd className={outcome.kind === 'attested' ? 'is-ok' : 'is-bad'}>
                    {outcome.kind === 'attested' ? t.verifyMatchYes : t.verifyMatchNo}
                  </dd>
                </div>
                {outcome.manifest.contentHash ? (
                  <div><dt>{t.verifyManifestHashLabel}</dt><dd className="mono">{outcome.manifest.contentHash}</dd></div>
                ) : null}
                {outcome.manifest.manifestId ? (
                  <div><dt>{t.verifyManifestIdLabel}</dt><dd>{outcome.manifest.manifestId}</dd></div>
                ) : null}
                {outcome.manifest.signer ? (
                  <div><dt>{t.verifySignerLabel}</dt><dd>{outcome.manifest.signer}</dd></div>
                ) : null}
                {outcome.manifest.timestamp ? (
                  <div><dt>{t.verifyTimeLabel}</dt><dd>{outcome.manifest.timestamp}</dd></div>
                ) : null}
              </>
            )}
          </dl>

          <div className="vresult__actions">
            {outcome.kind === 'attested' ? (
              <button type="button" className="cta-btn cta-btn--primary cta-btn--wide" onClick={() => void downloadPdf()} disabled={pdfBusy}>
                {pdfBusy ? t.verifyGeneratingPdf : t.verifyDownloadPdf}
              </button>
            ) : (
              <Link className="cta-btn cta-btn--primary cta-btn--wide" to="/introduce">{t.verifyCtaLearn}</Link>
            )}
          </div>
          <p className="verify-note">{t.verifyDemoNote}</p>
        </div>
      ) : null}

      <Reveal className="page-cta-wrap" delay={40}>
        <PageCta
          secondary={{ to: '/introduce', label: t.ctaSeeIntroduce }}
          tertiary={{ to: '/partnership', label: t.ctaSeePartner }}
        />
      </Reveal>
    </section>
  )
}
