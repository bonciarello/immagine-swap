import { useState, useCallback, useEffect, useRef } from 'react';
import { convertImage, createPreviewUrl, getExtension, SUPPORTED_INPUT_TYPES } from '../utils/converter';

export function useImageConverter() {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [convertedBlob, setConvertedBlob] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setConvertedBlob(null);
    setImageInfo(null);
    setError(null);
    setIsConverting(false);
  }, [previewUrl]);

  const loadFile = useCallback(
    async (newFile) => {
      reset();
      abortRef.current = false;

      // Validate file type
      if (!SUPPORTED_INPUT_TYPES.includes(newFile.type) && newFile.type !== '') {
        // Try to detect from extension
        const ext = newFile.name.split('.').pop()?.toLowerCase();
        const knownExtensions = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'svg', 'tiff', 'tif', 'avif'];
        if (!knownExtensions.includes(ext)) {
          setError(
            `Formato file non supportato. Carica un'immagine nei formati: PNG, JPEG, WebP, BMP, GIF, SVG, TIFF o AVIF.`
          );
          return;
        }
      }

      setFile(newFile);
      setError(null);
      setIsConverting(true);
      const currentAbort = () => abortRef.current;

      try {
        const preview = await createPreviewUrl(newFile);
        if (currentAbort()) return;
        setPreviewUrl(preview);
      } catch (err) {
        if (currentAbort()) return;
        setError(err.message);
        setIsConverting(false);
        return;
      }

      try {
        const result = await convertImage(newFile, outputFormat);
        if (currentAbort()) return;
        setConvertedBlob(result.blob);
        setPreviewUrl(result.dataUrl);
        setImageInfo({
          name: newFile.name,
          size: newFile.size,
          width: result.width,
          height: result.height,
          type: newFile.type,
        });
      } catch (err) {
        if (currentAbort()) return;
        setError(err.message);
      } finally {
        if (!currentAbort()) {
          setIsConverting(false);
        }
      }
    },
    [outputFormat, reset]
  );

  const changeFormat = useCallback(
    async (newFormat) => {
      setOutputFormat(newFormat);
      if (!file) return;

      setError(null);
      setIsConverting(true);
      const currentAbort = () => abortRef.current;

      try {
        const result = await convertImage(file, newFormat);
        if (currentAbort()) return;
        setConvertedBlob(result.blob);
        setPreviewUrl(result.dataUrl);
      } catch (err) {
        if (currentAbort()) return;
        setError(err.message);
      } finally {
        if (!currentAbort()) {
          setIsConverting(false);
        }
      }
    },
    [file]
  );

  const download = useCallback(() => {
    if (!convertedBlob || !file) return;
    const ext = getExtension(outputFormat);
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const newName = `${baseName}-convertito.${ext}`;
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [convertedBlob, file, outputFormat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current = true;
    };
  }, []);

  return {
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
  };
}
