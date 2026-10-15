import { useCallback, useMemo, useState, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { PageCta } from '../components/PageCta'
import { useSite } from '../context/SiteContext'
import {
  buildCertificateHtml,
  runVerification,
  type VerifyOutcome,
} from '../lib/verifyImage'

function DropZone({
  accept,
  label,
  sub,
  onFile,
  dragLabel,
}: {
  accept: string
  label: string
  sub: string
  onFile: (file: File) => void
  dragLabel?: string
}) {
  const [drag, setDrag] = useState(false)

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }

  return (
    <label
      className={`verify-drop${drag ? ' is-drag' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
          e.target.value = ''
        }}
      />
      <span className="verify-drop__label">{drag && dragLabel ? dragLabel : label}</span>
      <span className="verify-drop__sub">{sub}</span>
    </label>
  )
}

export function VerifyPage() {
  const { t } = useSite()
  const [image, setImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [manifestName, setManifestName] = useState<string | null>(null)
  const [manifestText, setManifestText] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [outcome, setOutcome] = useState<VerifyOutcome | null>(null)

  const setImageFile = useCallback((file: File) => {
    setImage(file)
    setOutcome(null)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      if (file.type.startsWith('image/')) return URL.createObjectURL(file)
      return null
    })
  }, [])

  const setManifestFile = useCallback(async (file: File) => {
    const text = await file.text()
    setManifestName(file.name)
    setManifestText(text)
    setOutcome(null)
  }, [])

  const clearImage = () => {
    setImage(null)
    setOutcome(null)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  const clearManifest = () => {
    setManifestName(null)
    setManifestText(null)
    setOutcome(null)
  }

  const onRun = async () => {
    if (!image) {
      setOutcome({ kind: 'need-image' })
      return
    }
    setBusy(true)
    try {
      const result = await runVerification(image, manifestText)
      setOutcome(result)
    } finally {
      setBusy(false)
    }
  }

  const statusLabel = useMemo(() => {
    if (!outcome || outcome.kind === 'need-image') return null
    if (outcome.kind === 'attested') return t.verifyStatusAttested
    if (outcome.kind === 'mismatch') return t.verifyStatusMismatch
    return t.verifyStatusNotAttested
  }, [outcome, t])

  const downloadCert = () => {
    if (!outcome || outcome.kind === 'need-image') return
    const rows: [string, string][] = [
      [t.verifyFileLabel, `${outcome.fileName} · ${outcome.fileSize} B`],
      [t.verifyHashLabel, outcome.imageHash],
      [t.verifyAlgoLabel, 'SHA-256'],
    ]
    if (outcome.kind === 'attested' || outcome.kind === 'mismatch') {
      if (outcome.manifest.contentHash) {
        rows.push([t.verifyManifestHashLabel, outcome.manifest.contentHash])
      }
      if (outcome.manifest.signer) rows.push([t.verifySignerLabel, outcome.manifest.signer])
      if (outcome.manifest.timestamp) rows.push([t.verifyTimeLabel, outcome.manifest.timestamp])
      if (outcome.manifest.algorithm) {
        rows[2] = [t.verifyAlgoLabel, outcome.manifest.algorithm]
      }
    }
    rows.push([t.verifyStatusDemo, t.verifyDemoNote])

    const html = buildCertificateHtml({
      title: t.verifyCertTitle,
      status: statusLabel ?? t.verifyStatusDemo,
      rows,
      note: t.verifyDemoNote,
      footer: t.verifyCertFooter,
      generatedAt: new Date().toISOString(),
    })
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sitas-verify-${outcome.imageHash.slice(0, 12)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

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

      <div className="verify-layout">
        <Reveal className="verify-panel" delay={40}>
          <h3>{t.verifyImageTitle}</h3>
          <p className="verify-panel__hint">{t.verifyImageHint}</p>
          <DropZone
            accept="image/*,.tif,.tiff"
            label={t.verifyImageDrop}
            sub={t.verifyImageSub}
            onFile={setImageFile}
          />
          {image ? (
            <div className="verify-file-chip">
              <span>
                {image.name} · {(image.size / 1024).toFixed(1)} KB
              </span>
              <button type="button" onClick={clearImage}>
                {t.verifyClear}
              </button>
            </div>
          ) : null}
          {previewUrl ? (
            <div className="verify-preview">
              <img src={previewUrl} alt="" />
            </div>
          ) : null}
        </Reveal>

        <Reveal className="verify-panel" delay={80}>
          <h3>{t.verifyManifestTitle}</h3>
          <p className="verify-panel__hint">{t.verifyManifestHint}</p>
          <DropZone
            accept=".json,.sitas,application/json,text/plain"
            label={t.verifyManifestDrop}
            sub={t.verifyManifestSub}
            onFile={(f) => void setManifestFile(f)}
          />
          {manifestName ? (
            <div className="verify-file-chip">
              <span>{manifestName}</span>
              <button type="button" onClick={clearManifest}>
                {t.verifyClear}
              </button>
            </div>
          ) : null}
          <div className="verify-actions">
            <button
              type="button"
              className="cta-btn cta-btn--primary"
              onClick={() => void onRun()}
              disabled={busy}
            >
              {busy ? t.verifyRunning : t.verifyRun}
            </button>
          </div>
        </Reveal>
      </div>

      {outcome && outcome.kind !== 'need-image' ? (
        <Reveal className="verify-result" delay={40}>
          <div
            className={`verify-badge${
              outcome.kind === 'attested'
                ? ' verify-badge--ok'
                : outcome.kind === 'mismatch'
                  ? ' verify-badge--no'
                  : ' verify-badge--no'
            }`}
          >
            {statusLabel}
          </div>
          <div className="verify-badge verify-badge--demo">{t.verifyStatusDemo}</div>

          <p className="verify-msg">
            {outcome.kind === 'attested'
              ? t.verifyMsgAttested
              : outcome.kind === 'mismatch'
                ? t.verifyMsgMismatch
                : t.verifyMsgNotAttested}
          </p>

          <dl className="verify-summary">
            <dt>{t.verifyFileLabel}</dt>
            <dd>
              {outcome.fileName} · {outcome.fileSize} B
            </dd>
            <dt>{t.verifyHashLabel}</dt>
            <dd>{outcome.imageHash}</dd>
            {(outcome.kind === 'attested' || outcome.kind === 'mismatch') &&
            outcome.manifest.contentHash ? (
              <>
                <dt>{t.verifyManifestHashLabel}</dt>
                <dd>{outcome.manifest.contentHash}</dd>
              </>
            ) : null}
            {(outcome.kind === 'attested' || outcome.kind === 'mismatch') &&
            outcome.manifest.signer ? (
              <>
                <dt>{t.verifySignerLabel}</dt>
                <dd>{outcome.manifest.signer}</dd>
              </>
            ) : null}
            {(outcome.kind === 'attested' || outcome.kind === 'mismatch') &&
            outcome.manifest.timestamp ? (
              <>
                <dt>{t.verifyTimeLabel}</dt>
                <dd>{outcome.manifest.timestamp}</dd>
              </>
            ) : null}
            <dt>{t.verifyAlgoLabel}</dt>
            <dd>
              {(outcome.kind === 'attested' || outcome.kind === 'mismatch') &&
              outcome.manifest.algorithm
                ? outcome.manifest.algorithm
                : 'SHA-256'}
            </dd>
          </dl>

          <div className="verify-actions">
            <button type="button" className="cta-btn cta-btn--primary" onClick={downloadCert}>
              {t.verifyDownloadCert}
            </button>
            {outcome.kind === 'not-attested' ? (
              <Link className="cta-btn cta-btn--ghost" to="/introduce">
                {t.verifyCtaLearn}
              </Link>
            ) : (
              <Link className="cta-btn cta-btn--ghost" to="/product">
                {t.ctaSeeProduct}
              </Link>
            )}
          </div>
          <p className="verify-note">{t.verifyDemoNote}</p>
        </Reveal>
      ) : null}

      {outcome?.kind === 'need-image' ? (
        <p className="verify-msg" style={{ marginTop: 28, position: 'relative', zIndex: 2 }}>
          {t.verifyNeedImage}
        </p>
      ) : null}

      <Reveal className="page-cta-wrap" delay={80}>
        <PageCta
          secondary={{ to: '/introduce', label: t.ctaSeeIntroduce }}
          tertiary={{ to: '/partnership', label: t.ctaSeePartner }}
        />
      </Reveal>

    </section>
  )
}
