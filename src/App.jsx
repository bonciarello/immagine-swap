import { useState, useCallback, useRef } from 'react';
import { useImageConverter } from './hooks/useImageConverter';
import { SUPPORTED_FORMATS, formatFileSize } from './utils/converter';
import './App.css';

/* ── Inline SVG icons (Lucide-style, consistent 1.5px stroke) ── */

const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17,8 12,3 7,8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconChevronDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14,2 14,8 20,8" />
  </svg>
);

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export default function App() {
  const {
    file,
    outputFormat,
    previewUrl,
    convertedBlob,
    imageInfo,
    isConverting,
    error,
    loadFile,
    changeFormat,
    download,
    reset,
  } = useImageConverter();

  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!file) setDragOver(true);
  }, [file]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const droppedFiles = e.dataTransfer?.files;
      if (droppedFiles && droppedFiles.length > 0) {
        const f = droppedFiles[0];
        if (f.type.startsWith('image/') || /\.(png|jpg|jpeg|webp|bmp|gif|svg|tiff?|avif)$/i.test(f.name)) {
          loadFile(f);
        } else {
          // error will be set by loadFile validation
          loadFile(f);
        }
      }
    },
    [loadFile]
  );

  const handleFileChange = useCallback(
    (e) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        loadFile(selectedFile);
      }
      // Reset input value so the same file can be re-selected
      e.target.value = '';
    },
    [loadFile]
  );

  const handleFormatChange = useCallback(
    (e) => {
      changeFormat(e.target.value);
    },
    [changeFormat]
  );

  const hasFile = !!file;
  const dropzoneClass = [
    'dropzone',
    dragOver && !hasFile ? 'drag-over' : '',
    hasFile ? 'has-file' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="app">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Convertitore Immagini Online',
            url: 'https://github.com/bonciarello/convertitore-di-file-immagine-tra-formati-con-anteprima-live/',
            description:
              'Converti immagini tra i formati PNG, JPG, WEBP, BMP e GIF direttamente nel browser con anteprima live e download istantaneo.',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
            browserRequirements: 'Requires JavaScript and HTML5 Canvas',
          }),
        }}
      />

      <header className="app-header" role="banner">
        <div className="app-brand">
          <div className="app-logo" aria-hidden="true">
            <IconGrid />
          </div>
          <span className="app-title">PixelShift</span>
        </div>
        <span className="app-badge">Online &amp; Gratuito</span>
      </header>

      <main className="app-main" role="main">
        <section className="hero">
          <h1>Converti le tue immagini all'istante</h1>
          <p>
            Carica un'immagine, scegli il formato di output e guarda l'anteprima
            aggiornarsi in tempo reale. Tutto avviene nel tuo browser — nessun file
            viene mai inviato a un server.
          </p>
        </section>

        {/* Drop Zone */}
        <div
          className={dropzoneClass}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !hasFile && inputRef.current?.click()}
          role="button"
          tabIndex={hasFile ? -1 : 0}
          aria-label={
            hasFile
              ? 'Immagine caricata. Trascina un nuovo file per sostituirla.'
              : 'Carica un\'immagine — clicca o trascina qui il file'
          }
          onKeyDown={(e) => {
            if (!hasFile && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/bmp,image/gif,image/svg+xml,image/tiff,image/avif"
            onChange={handleFileChange}
            className="dropzone-input"
            id="file-upload"
            aria-hidden="true"
          />

          {!hasFile ? (
            <div className="dropzone-content">
              <div className="dropzone-icon" aria-hidden="true">
                <IconUpload />
              </div>
              <p className="dropzone-label">
                Trascina qui la tua immagine
              </p>
              <p className="dropzone-hint">
                oppure clicca per sfogliare i file
              </p>
              <div className="dropzone-formats" aria-label="Formati supportati">
                {['PNG', 'JPEG', 'WebP', 'BMP', 'GIF', 'SVG', 'TIFF', 'AVIF'].map(
                  (fmt) => (
                    <span key={fmt} className="dropzone-format-tag">
                      {fmt}
                    </span>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="file-info-bar">
              <IconFile />
              <span className="file-info-item">
                <strong>{file.name}</strong>
              </span>
              <span className="file-info-mono">{formatFileSize(file.size)}</span>
              {imageInfo && (
                <span className="file-info-mono">
                  {imageInfo.width}×{imageInfo.height}
                </span>
              )}
              <button
                type="button"
                className="file-info-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
                aria-label="Rimuovi immagine e ricomincia"
              >
                <IconX />
                Rimuovi
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="error-alert" role="alert">
            <IconAlertTriangle />
            <span>{error}</span>
          </div>
        )}

        {/* Controls */}
        {hasFile && (
          <div className="controls-row">
            <div className="format-select-group">
              <label htmlFor="output-format" className="format-select-label">
                Converti in
              </label>
              <div className="format-select-wrapper">
                <select
                  id="output-format"
                  className="format-select"
                  value={outputFormat}
                  onChange={handleFormatChange}
                  disabled={isConverting}
                >
                  {SUPPORTED_FORMATS.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </option>
                  ))}
                </select>
                <span className="format-select-arrow" aria-hidden="true">
                  <IconChevronDown />
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-download"
              onClick={download}
              disabled={!convertedBlob || isConverting}
              aria-label={`Scarica l'immagine convertita in formato ${outputFormat.toUpperCase()}`}
            >
              <IconDownload />
              Scarica {outputFormat.toUpperCase()}
            </button>
          </div>
        )}

        {/* Preview — Signature Lightbox */}
        <section className="preview-section" aria-label="Anteprima dell'immagine convertita">
          <h2 className="preview-label">
            <span
              className="preview-label-dot"
              aria-hidden="true"
              style={{
                background: isConverting
                  ? 'var(--color-text-tertiary)'
                  : hasFile
                  ? 'var(--color-accent)'
                  : 'var(--color-border)',
              }}
            />
            {hasFile
              ? `Anteprima ${outputFormat.toUpperCase()}`
              : 'Nessuna anteprima disponibile'}
          </h2>

          <div className="lightbox">
            {isConverting && (
              <div className="lightbox-converting" aria-live="polite" aria-label="Conversione in corso">
                <div className="spinner" />
              </div>
            )}

            {previewUrl ? (
              <div className="lightbox-inner">
                <img
                  src={previewUrl}
                  alt={
                    imageInfo
                      ? `Anteprima convertita in ${outputFormat.toUpperCase()} — ${imageInfo.width}×${imageInfo.height} pixel`
                      : `Anteprima dell'immagine convertita`
                  }
                  className="lightbox-image"
                  width={imageInfo?.width}
                  height={imageInfo?.height}
                />
              </div>
            ) : (
              <div className="lightbox-placeholder">
                <IconImage />
                <p>
                  Carica un'immagine per vedere l'anteprima in tempo reale del
                  formato convertito
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer" role="contentinfo">
        <p>
          La conversione avviene interamente nel browser tramite Canvas API.
          Nessun file viene caricato su server esterni.
        </p>
      </footer>
    </div>
  );
}
