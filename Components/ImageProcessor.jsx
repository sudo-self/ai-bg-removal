'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';

export default function ImageProcessor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [previewBg, setPreviewBg] = useState('transparent');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const previewCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const updatePreview = useCallback(() => {
    if (!processedImage || !containerRef.current || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let width = containerRef.current.clientWidth - 40 || 500;
      let height = width / aspectRatio;

      if (height > 500) {
        height = 500;
        width = height * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background options
      if (previewBg === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (previewBg === 'black') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (previewBg === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (previewBg === 'transparent') {
        const size = 20;
        ctx.fillStyle = '#e5e7eb';
        for (let y = 0; y < canvas.height; y += size * 2) {
          for (let x = 0; x < canvas.width; x += size * 2) {
            ctx.fillRect(x, y, size, size);
            ctx.fillRect(x + size, y + size, size, size);
          }
        }
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = processedImage;
  }, [processedImage, previewBg]);

  useEffect(() => {
    updatePreview();
    const handleResize = () => updatePreview();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePreview]);

  useEffect(() => {
    return () => {
      if (processedImage) URL.revokeObjectURL(processedImage);
    };
  }, [processedImage]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessedImage(null);
    setError(null);

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large (max 5MB)');
      return;
    }

    try {
      if (
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        file.name.toLowerCase().endsWith('.heic') ||
        file.name.toLowerCase().endsWith('.heif')
      ) {
        setIsConverting(true);
        const heic2any = (await import('heic2any')).default;
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8,
        });

        const reader = new FileReader();
        reader.onload = (event) => {
          setOriginalImage(event.target.result);
          setIsConverting(false);
        };
        reader.readAsDataURL(convertedBlob);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => setOriginalImage(event.target.result);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Error processing uploaded image:', err);
      setError('Unsupported image format. Please use JPG, PNG, WEBP, or HEIC.');
      setIsConverting(false);
    }
  };

  const processImage = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(originalImage);
      const blob = await response.blob();

      const resultBlob = await removeBackground(blob);
      const url = URL.createObjectURL(resultBlob);
      setProcessedImage(url);
    } catch (err) {
      console.error('Error removing background:', err);
      setError('Failed to remove background. Please try another image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large (max 5mb)');
      return;
    }

    try {
      if (file.type.startsWith('image/')) {
        if (
          file.type === 'image/heic' ||
          file.type === 'image/heif' ||
          file.name.toLowerCase().endsWith('.heic') ||
          file.name.toLowerCase().endsWith('.heif')
        ) {
          setIsConverting(true);
          const heic2any = (await import('heic2any')).default;
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8,
          });

          const reader = new FileReader();
          reader.onload = (event) => {
            setOriginalImage(event.target.result);
            setIsConverting(false);
          };
          reader.readAsDataURL(convertedBlob);
        } else {
          const reader = new FileReader();
          reader.onload = (event) => setOriginalImage(event.target.result);
          reader.readAsDataURL(file);
        }
      }
    } catch (err) {
      console.error('Error processing dropped image:', err);
      setError('Unsupported image format. Please use JPG, PNG, WEBP, or HEIC.');
      setIsConverting(false);
    }
  };

  const resetAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    setPreviewBg('transparent');
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (previewBg === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (previewBg === 'black') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (previewBg === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (previewBg === 'transparent') {
        const size = 20;
        ctx.fillStyle = '#e5e7eb';
        for (let y = 0; y < canvas.height; y += size * 2) {
          for (let x = 0; x < canvas.width; x += size * 2) {
            ctx.fillRect(x, y, size, size);
            ctx.fillRect(x + size, y + size, size, size);
          }
        }
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'removed-bg.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = processedImage;
  };

  return (
    <section
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative p-8 max-w-3xl w-full mx-auto flex flex-col items-center justify-center rounded-2xl transition-colors duration-300
        ${
          isDragging
            ? 'bg-blue-50 dark:bg-blue-900/30'
            : 'bg-white dark:bg-gray-900'
        }`}
      aria-label="Image upload and processing area"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        hidden
        aria-hidden="true"
      />

      {!originalImage && !isLoading && !isConverting && (
        <div className="flex flex-col items-center select-none">
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="cursor-pointer p-6 rounded-full bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
            aria-label="Select image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-indigo-600 dark:text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </button>
          <p className="mt-6 text-gray-600 dark:text-gray-400 text-base max-w-xs text-center">
            click to upload or drag & drop an image<br /> (max 5MB)
          </p>
        </div>
      )}

      {(isLoading || isConverting) && (
        <div className="flex flex-col items-center select-none">
          <svg
            className="animate-spin -ml-1 mr-3 h-14 w-14 text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading spinner"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-semibold text-lg">
            {isConverting ? 'Converting HEIC image...' : 'Removing background...'}
          </p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mt-8 max-w-sm text-center font-semibold shadow-md select-text"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {originalImage && !processedImage && !isLoading && !isConverting && (
        <>
          <div className="max-w-full max-h-[520px] mb-8 rounded-xl overflow-hidden">
            <img
              src={originalImage}
              alt="Original upload preview"
              className="object-contain max-w-full max-h-[520px]"
              loading="lazy"
              draggable={false}
            />
          </div>

          <div className="flex gap-6">
            <button
              onClick={processImage}
              className="px-10 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 shadow-lg transition-all"
            >
              Remove BG
            </button>
            <button
              onClick={resetAll}
              className="px-10 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 shadow-lg transition-all"
            >
              Reset
            </button>
          </div>
        </>
      )}

      {processedImage && (
        <>
          <div
            className="relative max-w-full mb-6 rounded-2xl shadow-lg overflow-hidden"
            aria-label="Processed image preview"
          >
            <canvas
              ref={previewCanvasRef}
              aria-hidden="true"
              className="rounded-2xl w-full max-h-[520px] bg-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
            {['transparent', 'white', 'black', 'gradient'].map((bg) => (
              <button
                key={bg}
                type="button"
                aria-label={`Set preview background to ${bg}`}
                onClick={() => setPreviewBg(bg)}
                className={`w-12 h-12 rounded-lg border-2 ${
                  previewBg === bg
                    ? 'border-indigo-500 ring-2 ring-blue-400'
                    : 'border-indigo-400 dark:border-gray-600'
                } transition-all focus:outline-none`}
                style={
                  bg === 'gradient'
                    ? {
                        background:
                          'linear-gradient(45deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                      }
                    : {
                        backgroundColor:
                          bg === 'transparent'
                            ? 'transparent'
                            : bg === 'white'
                            ? '#ffffff'
                            : bg === 'black'
                            ? '#000000'
                            : 'transparent',
                      }
                }
              />
            ))}
          </div>

          <div className="flex gap-6">
            <button
              onClick={downloadImage}
              className="px-10 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-lg transition-all"
            >
              Download
            </button>
            <button
              onClick={resetAll}
              className="px-10 py-3 rounded-xl bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-400 shadow-lg transition-all"
            >
              Reset
            </button>
          </div>
        </>
      )}
    </section>
  );
}

