import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StyleOptions, WatermarkOptions, ImageTransform } from '../types';
import { Download, Share2, Move, ZoomIn, ZoomOut } from 'lucide-react';

interface ImagePreviewProps {
  quote: string;
  generatedImage: string | null;
  uploadedImage: File | null;
  styleOptions: StyleOptions;
  watermarkOptions: WatermarkOptions;
  isLoading: boolean;
  imageTransform: ImageTransform;
  onTransformChange: (transform: Partial<ImageTransform>) => void;
  visualTheme: string;
  aspectRatio: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

// Polyfill for canvas roundRect
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(
    x: number,
    y: number,
    w: number,
    h: number,
    radii: number | DOMPointInit | (number | DOMPointInit)[]
  ) {
    const getRadii = (r: typeof radii) => {
      const num = (val: number | DOMPointInit) => typeof val === 'number' ? val : (val.x || 0);
      if (typeof r === 'number') return [r, r, r, r];
      if (Array.isArray(r)) {
        if (r.length === 1) return [num(r[0]), num(r[0]), num(r[0]), num(r[0])];
        if (r.length === 2) return [num(r[0]), num(r[1]), num(r[0]), num(r[1])];
        if (r.length === 3) return [num(r[0]), num(r[1]), num(r[2]), num(r[1])];
        return [num(r[0]), num(r[1]), num(r[2]), num(r[3])];
      }
      return [0,0,0,0];
    }
    const [tl, tr, br, bl] = getRadii(radii);
    this.beginPath();
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.quadraticCurveTo(x + w, y, x + w, y + tr);
    this.lineTo(x + w, y + h - br);
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    this.lineTo(x + bl, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - bl);
    this.lineTo(x, y + tl);
    this.quadraticCurveTo(x, y, x + tl, y);
    this.closePath();
  }
}

const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
    quote, 
    generatedImage,
    uploadedImage,
    styleOptions, 
    watermarkOptions,
    isLoading,
    imageTransform,
    onTransformChange,
    visualTheme,
    aspectRatio
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  
  const stateRef = useRef({ imageTransform });
  useEffect(() => {
    stateRef.current = { imageTransform };
  }, [imageTransform]);
  
  const isDraggingRef = useRef(false);
  const startDragRef = useRef({ x: 0, y: 0 });
  const lastPinchDistRef = useRef(0);

  const [w, h] = (aspectRatio || '1:1').split(':').map(Number);
  const canvasWidth = 1080;
  const canvasHeight = Math.round((canvasWidth * h) / w);


  useEffect(() => {
    if (navigator.share && typeof navigator.canShare === 'function') {
      const dummyFile = new File([''], 'test.png', { type: 'image/png' });
      if (navigator.canShare({ files: [dummyFile] })) {
        setCanShare(true);
      }
    }
  }, []);
  
  useEffect(() => {
    if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
    }

    let source: string | null = null;
    if (generatedImage) {
        source = generatedImage;
    } else if (uploadedImage) {
        const url = URL.createObjectURL(uploadedImage);
        objectUrlRef.current = url;
        source = url;
    }
    
    if (source) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = source;
      img.onload = () => setBgImage(img);
      img.onerror = () => setBgImage(null);
    } else {
      setBgImage(null);
    }

    return () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
    }
  }, [generatedImage, uploadedImage]);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (watermarkOptions.image) {
      objectUrl = URL.createObjectURL(watermarkOptions.image);
      const img = new Image();
      img.onload = () => {
        setWatermarkImage(img);
      };
      img.onerror = () => {
        setWatermarkImage(null);
      };
      img.src = objectUrl;
    } else {
      setWatermarkImage(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [watermarkOptions.image]);


  useEffect(() => {
    const drawCanvas = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            const fontStyle = styleOptions.isItalic ? 'italic' : 'normal';
            const fontWeight = styleOptions.isBold ? 'bold' : styleOptions.fontWeight;
            await document.fonts.load(`${fontStyle} ${fontWeight} ${styleOptions.fontSize}px ${styleOptions.fontFamily}`);
        } catch (err) {
            console.error('Font could not be loaded:', err);
        }

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        if (bgImage) {
            const { x, y, scale } = imageTransform;
            const canvasRatio = width / height;
            const imgRatio = bgImage.width / bgImage.height;

            let baseWidth, baseHeight;
            if (imgRatio > canvasRatio) {
                baseHeight = height;
                baseWidth = baseHeight * imgRatio;
            } else {
                baseWidth = width;
                baseHeight = baseWidth / imgRatio;
            }

            const scaledWidth = baseWidth * scale;
            const scaledHeight = baseHeight * scale;

            const panX = x * scale;
            const panY = y * scale;
            
            const drawX = (width / 2) - (scaledWidth / 2) + panX;
            const drawY = (height / 2) - (scaledHeight / 2) + panY;
            
            ctx.drawImage(bgImage, drawX, drawY, scaledWidth, scaledHeight);
        }

        // --- START OF NEW TEXT RENDERING LOGIC ---

        // Only draw text if there is a quote to display.
        if (quote && quote.trim()) {
            const fontStyle = styleOptions.isItalic ? 'italic' : 'normal';
            const fontWeight = styleOptions.isBold ? 'bold' : styleOptions.fontWeight;

            // 1. Split Quote and Attribution using a robust Regex
            let fullQuoteText = quote.trim();
            let mainQuote = fullQuoteText;
            let attribution = '';
            
            // Regex handles patterns like " - Author", "@username", or "— Author" at the end of the string.
            const attributionRegex = /\s*((--|—|-)\s*([\w\s.’()-]+)|(@[a-zA-Z0-9_]+))$/;
            const match = fullQuoteText.match(attributionRegex);

            // Heuristic: Ensure the match is not the entire string and is reasonably short.
            if (match && match.index > 0 && match[0].length < fullQuoteText.length * 0.7) {
                mainQuote = fullQuoteText.substring(0, match.index).trim();
                
                // match[3] will be the author name, match[4] will be the username
                const authorName = match[3];
                const username = match[4];

                if (authorName) {
                    // Standardize the attribution format for consistent rendering
                    attribution = `- ${authorName.trim()}`;
                } else if (username) {
                    attribution = username.trim();
                }
            }

            // 2. Setup general context
            ctx.textAlign = styleOptions.textAlign;
            ctx.lineJoin = 'round';
            
            const margin = width * 0.08;
            let textBlockX, textBlockWidth;

            if (styleOptions.position.endsWith('Left')) {
                textBlockX = margin;
                textBlockWidth = (width / 2) - margin * 1.5;
            } else if (styleOptions.position.endsWith('Right')) {
                textBlockX = (width / 2) + margin * 0.5;
                textBlockWidth = (width / 2) - margin * 1.5;
            } else { // Center column
                textBlockX = margin;
                textBlockWidth = width - (margin * 2);
            }
            
            // 3. Process and measure main quote lines
            ctx.font = `${fontStyle} ${fontWeight} ${styleOptions.fontSize}px ${styleOptions.fontFamily}`;
            const mainQuoteWords = mainQuote.split(/\s+/);
            let currentLine = '';
            const mainQuoteLines: string[] = [];
            for (let word of mainQuoteWords) {
                const testLine = currentLine + word + ' ';
                if (ctx.measureText(testLine).width > textBlockWidth && currentLine.length > 0) {
                    mainQuoteLines.push(currentLine);
                    currentLine = word + ' ';
                } else {
                    currentLine = testLine;
                }
            }
            mainQuoteLines.push(currentLine);
            
            const maxLineWidth = Math.max(0, ...mainQuoteLines.map(line => ctx.measureText(line).width));

            // 4. Calculate total text block height
            const mainQuoteLineHeight = styleOptions.fontSize * 1.2;
            const mainQuoteHeight = mainQuoteLines.length * mainQuoteLineHeight;
            const attributionFontSize = styleOptions.fontSize * 0.6;
            const attributionLineHeight = attribution ? (attributionFontSize * 1.4) : 0;
            const totalTextHeight = mainQuoteHeight + attributionLineHeight;
            
            // 5. Calculate vertical position for the whole block
            let blockY;
            if (styleOptions.position.startsWith('top')) {
                blockY = margin;
            } else if (styleOptions.position.startsWith('center')) {
                blockY = (height / 2) - (totalTextHeight / 2);
            } else { // 'bottom'
                blockY = height - totalTextHeight - margin;
            }

            // 6. Calculate horizontal position
            let xPos;
            if (styleOptions.textAlign === 'left') {
                xPos = textBlockX;
            } else if (styleOptions.textAlign === 'center') {
                xPos = textBlockX + textBlockWidth / 2;
            } else { // 'right'
                xPos = textBlockX + textBlockWidth;
            }
            
            // 6.5 Render Text Background if enabled
            if (styleOptions.textBackgroundEnabled) {
                const padding = styleOptions.textBackgroundPadding;

                let textBlockLeft;
                if (styleOptions.textAlign === 'left') textBlockLeft = xPos;
                else if (styleOptions.textAlign === 'center') textBlockLeft = xPos - maxLineWidth / 2;
                else textBlockLeft = xPos - maxLineWidth; // right
                
                const bgX = textBlockLeft - padding;
                const bgY = blockY - padding;
                const bgWidth = maxLineWidth + padding * 2;
                const bgHeight = totalTextHeight + padding * 2;

                ctx.fillStyle = hexToRgba(styleOptions.textBackgroundColor, styleOptions.textBackgroundOpacity);
                ctx.beginPath();
                ctx.roundRect(bgX, bgY, bgWidth, bgHeight, styleOptions.textBackgroundBorderRadius);
                ctx.fill();
            }

            // 7. Draw the main quote
            ctx.fillStyle = styleOptions.fontColor;
            ctx.font = `${fontStyle} ${fontWeight} ${styleOptions.fontSize}px ${styleOptions.fontFamily}`;
            const startY = blockY + styleOptions.fontSize; // Baseline of first line
            mainQuoteLines.forEach((line, i) => {
                const currentY = startY + (i * mainQuoteLineHeight);
                if (styleOptions.textOutlineEnabled && styleOptions.textOutlineWidth > 0) {
                    ctx.lineWidth = styleOptions.textOutlineWidth;
                    ctx.strokeStyle = styleOptions.textOutlineColor;
                    ctx.strokeText(line.trim(), xPos, currentY);
                }
                ctx.fillText(line.trim(), xPos, currentY);
            });

            // 8. Draw the attribution
            if (attribution) {
                const attributionY = startY + mainQuoteHeight - (mainQuoteLineHeight - mainQuoteLineHeight/1.2) + attributionLineHeight/1.4;
                ctx.font = `${fontStyle} ${fontWeight} ${attributionFontSize}px ${styleOptions.fontFamily}`;
                if (styleOptions.textOutlineEnabled && styleOptions.textOutlineWidth > 0) {
                    ctx.lineWidth = Math.max(1, styleOptions.textOutlineWidth * 0.6); // Scale outline
                    ctx.strokeStyle = styleOptions.textOutlineColor;
                    ctx.strokeText(attribution, xPos, attributionY);
                }
                ctx.fillText(attribution, xPos, attributionY);
            }
        }
        // --- END OF NEW TEXT RENDERING LOGIC ---
        
        if (watermarkImage && watermarkOptions.enabled) {
            const sizePercent = watermarkOptions.size / 100;
            const watermarkWidth = width * sizePercent;
            const aspectRatio = watermarkImage.width / watermarkImage.height;
            const watermarkHeight = watermarkWidth / aspectRatio;
            const watermarkMargin = width * 0.04;

            let wx = 0, wy = 0;
            if (watermarkOptions.position.startsWith('top')) wy = watermarkMargin;
            if (watermarkOptions.position.startsWith('center')) wy = (height - watermarkHeight) / 2;
            if (watermarkOptions.position.startsWith('bottom')) wy = height - watermarkHeight - watermarkMargin;
            if (watermarkOptions.position.endsWith('Left')) wx = watermarkMargin;
            if (watermarkOptions.position.endsWith('Center')) wx = (width - watermarkWidth) / 2;
            if (watermarkOptions.position.endsWith('Right')) wx = width - watermarkWidth - watermarkMargin;
            if (watermarkOptions.position === 'center') {
                wx = (width - watermarkWidth) / 2;
                wy = (height - watermarkHeight) / 2;
            }

            ctx.save();
            ctx.globalAlpha = watermarkOptions.opacity;
            ctx.drawImage(watermarkImage, wx, wy, watermarkWidth, watermarkHeight);
            ctx.restore();
        }
    };
    
    requestAnimationFrame(drawCanvas);
  }, [quote, bgImage, styleOptions, watermarkOptions, watermarkImage, imageTransform, aspectRatio, canvasHeight]);

  const getClampedTransform = useCallback((newTransform: ImageTransform): ImageTransform => {
      const canvas = canvasRef.current;
      if (!canvas || !bgImage) return newTransform;
      
      const scale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newTransform.scale));
      
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = bgImage.width / bgImage.height;

      let baseWidth, baseHeight;
      if (imgRatio > canvasRatio) {
          baseHeight = canvas.height;
          baseWidth = baseHeight * imgRatio;
      } else {
          baseWidth = canvas.width;
          baseHeight = baseWidth / imgRatio;
      }

      const scaledWidth = baseWidth * scale;
      const scaledHeight = baseHeight * scale;

      const maxX = Math.max(0, (scaledWidth - canvas.width) / 2 / scale);
      const maxY = Math.max(0, (scaledHeight - canvas.height) / 2 / scale);
      
      const x = Math.max(-maxX, Math.min(maxX, newTransform.x));
      const y = Math.max(-maxY, Math.min(maxY, newTransform.y));
      
      return { x, y, scale };
  }, [bgImage]);


  const handleTransform = useCallback((newTransform: Partial<ImageTransform>) => {
      const current = stateRef.current.imageTransform;
      const updated = { ...current, ...newTransform };
      const clamped = getClampedTransform(updated);
      onTransformChange(clamped);
  }, [getClampedTransform, onTransformChange]);

  const handlePan = useCallback((dx: number, dy: number) => {
      const current = stateRef.current.imageTransform;
      handleTransform({
          x: current.x + dx / current.scale,
          y: current.y + dy / current.scale,
      });
  }, [handleTransform]);
  

  const handleZoom = useCallback((zoomFactor: number, clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const { imageTransform: current } = stateRef.current;
      
      const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current.scale * zoomFactor));
      const actualZoomFactor = newScale / current.scale;

      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      const pivotX = canvasX - canvas.width / 2;
      const pivotY = canvasY - canvas.height / 2;
      
      const panInScreen = { x: current.x * current.scale, y: current.y * current.scale };
      
      const newPanInScreen = {
          x: panInScreen.x - pivotX * (actualZoomFactor - 1),
          y: panInScreen.y - pivotY * (actualZoomFactor - 1)
      };

      handleTransform({
          x: newPanInScreen.x / newScale,
          y: newPanInScreen.y / newScale,
          scale: newScale
      });
  }, [handleTransform]);

  const handleZoomButtons = useCallback((direction: 'in' | 'out') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const zoomStep = 1.25;
      const zoomFactor = direction === 'in' ? zoomStep : 1 / zoomStep;
      const { width, height, left, top } = canvas.getBoundingClientRect();
      handleZoom(zoomFactor, left + width / 2, top + height / 2);
  }, [handleZoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) => {
        if (!bgImage) return;
        e.preventDefault();
        canvas.style.cursor = 'grabbing';
        isDraggingRef.current = true;
        startDragRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) {
            if(canvas) canvas.style.cursor = bgImage ? 'grab' : 'default';
            return;
        }
        e.preventDefault();
        const dx = e.clientX - startDragRef.current.x;
        const dy = e.clientY - startDragRef.current.y;
        startDragRef.current = { x: e.clientX, y: e.clientY };
        
        handlePan(dx, dy);
    };

    const stopDragging = () => {
        isDraggingRef.current = false;
        if(canvas) canvas.style.cursor = bgImage ? 'grab' : 'default';
    };

    const onWheel = (e: WheelEvent) => { e.preventDefault(); if (e.ctrlKey || e.metaKey) { const zoomFactor = 1 - e.deltaY * 0.01; handleZoom(zoomFactor, e.clientX, e.clientY); } else { handlePan(-e.deltaX, -e.deltaY); } };
    const onTouchStart = (e: TouchEvent) => { if(e.touches.length > 2) return; e.preventDefault(); if (e.touches.length === 1) { isDraggingRef.current = true; startDragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } else if (e.touches.length === 2) { isDraggingRef.current = false; const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; lastPinchDistRef.current = Math.sqrt(dx * dx + dy * dy); } };
    const onTouchMove = (e: TouchEvent) => { if(e.touches.length > 2) return; e.preventDefault(); if (e.touches.length === 1 && isDraggingRef.current) { const touch = e.touches[0]; const dx = touch.clientX - startDragRef.current.x; const dy = touch.clientY - startDragRef.current.y; startDragRef.current = { x: touch.clientX, y: touch.clientY }; handlePan(dx, dy); } else if (e.touches.length === 2) { const touch1 = e.touches[0]; const touch2 = e.touches[1]; const dx = touch1.clientX - touch2.clientX; const dy = touch1.clientY - touch2.clientY; const pinchDist = Math.sqrt(dx * dx + dy * dy); if (lastPinchDistRef.current > 0) { const zoomFactor = pinchDist / lastPinchDistRef.current; const centerX = (touch1.clientX + touch2.clientX) / 2; const centerY = (touch1.clientY + touch2.clientY) / 2; handleZoom(zoomFactor, centerX, centerY); } lastPinchDistRef.current = pinchDist; } };
    const onTouchEnd = () => { isDraggingRef.current = false; lastPinchDistRef.current = 0; };
    
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchcancel', onTouchEnd);
    
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      canvas.removeEventListener('mouseleave', stopDragging);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [bgImage, handlePan, handleZoom]);
  
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      
      const sanitizeFilename = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s*\(.*\)\s*/g, '') // remove text in parentheses
            .trim()
            .replace(/[^a-z0-9\s-]/g, '') // remove special characters except spaces and hyphens
            .replace(/\s+/g, '_'); // replace spaces with underscores
      };
      
      let filename = 'quotegenx';
      if (visualTheme && visualTheme !== 'None') {
          filename += `_${sanitizeFilename(visualTheme)}`;
      } else {
          filename += '_masterpiece';
      }
      
      filename += `_${aspectRatio.replace(':', 'x')}`;

      link.download = `${filename}.png`;
      link.href = url;
      link.click();
    }
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.share) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'quotegenx-masterpiece.png', { type: 'image/png' });
      try {
        await navigator.share({ files: [file] });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error sharing:', error);
        }
      }
    }, 'image/png');
  };

  return (
    <div className="flex flex-col w-full">
      <div 
        className={`w-full bg-white rounded-lg flex items-center justify-center overflow-hidden relative group shadow-inner`}
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center text-center text-gray-600">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin"></div>
            <p className="mt-4 font-semibold">Generating masterpiece...</p>
            <p className="text-sm text-gray-500">This can take a moment</p>
          </div>
        ) : (
            <>
                <canvas 
                    ref={canvasRef} 
                    width={canvasWidth} 
                    height={canvasHeight} 
                    className={`w-full h-full ${bgImage ? 'cursor-grab' : 'cursor-default'}`}
                    title={bgImage ? 'Click & drag or use two fingers to pan. Pinch or Ctrl+Scroll to zoom.' : ''}
                />
                {bgImage && (
                    <>
                        <div className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Move size={20} />
                        </div>
                        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                            <button
                                onClick={() => handleZoomButtons('in')}
                                disabled={imageTransform.scale >= MAX_ZOOM}
                                className="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                aria-label="Zoom in"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={() => handleZoomButtons('out')}
                                disabled={imageTransform.scale <= MIN_ZOOM}
                                className="w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                aria-label="Zoom out"
                            >
                                <ZoomOut size={20} />
                            </button>
                        </div>
                    </>
                )}
            </>
        )}
      </div>
      <div id="download-share-section" className="mt-4 w-full flex items-center gap-4">
        <button
          onClick={handleDownload}
          disabled={isLoading || (!generatedImage && !uploadedImage)}
          className="flex-1 bg-[linear-gradient(90deg,#8A2BE2,#FF8C00)] hover:brightness-105 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Download className="h-5 w-5" />
          Download Image
        </button>
        
        {canShare && (
          <button
            onClick={handleShare}
            disabled={isLoading || (!generatedImage && !uploadedImage)}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share
          </button>
        )}
      </div>
    </div>
  );
};