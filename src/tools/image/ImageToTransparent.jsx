import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Droplets, RotateCcw, Sliders } from 'lucide-react';

const ImageToTransparent = () => {
    const [image, setImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [opacity, setOpacity] = useState(50);
    const [mode, setMode] = useState('uniform'); // uniform, gradient, color
    const [colorToTransparent, setColorToTransparent] = useState('#ffffff');
    const [colorTolerance, setColorTolerance] = useState(30);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setOriginalImage(img);
                    setImage(event.target.result);
                    drawToCanvas(img);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const drawToCanvas = (img) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const maxSize = 500;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
            if (width > height) {
                height = (height / width) * maxSize;
                width = maxSize;
            } else {
                width = (width / height) * maxSize;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    };

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    };

    const applyTransparency = () => {
        if (!canvasRef.current || !originalImage) return;

        setProcessing(true);

        setTimeout(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Redraw original
            drawToCanvas(originalImage);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            if (mode === 'uniform') {
                // Apply uniform transparency to all pixels
                const alpha = Math.round((opacity / 100) * 255);
                for (let i = 0; i < data.length; i += 4) {
                    // Preserve fully transparent pixels
                    if (data[i + 3] > 0) {
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
            } else if (mode === 'gradient') {
                // Apply gradient transparency (top to bottom)
                for (let i = 0; i < data.length; i += 4) {
                    const y = Math.floor((i / 4) / canvas.width);
                    const progress = y / canvas.height;
                    const alpha = Math.round((1 - progress) * 255 * (opacity / 100));
                    if (data[i + 3] > 0) {
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
            } else if (mode === 'color') {
                // Make specific color transparent
                const target = hexToRgb(colorToTransparent);
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    const distance = Math.sqrt(
                        Math.pow(r - target.r, 2) +
                        Math.pow(g - target.g, 2) +
                        Math.pow(b - target.b, 2)
                    );

                    if (distance < colorTolerance) {
                        // Make this color transparent based on opacity
                        const alpha = Math.round(((100 - opacity) / 100) * 255);
                        data[i + 3] = alpha;
                    }
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setImage(canvas.toDataURL('image/png'));
            setProcessing(false);
        }, 100);
    };

    const resetImage = () => {
        if (originalImage) {
            drawToCanvas(originalImage);
            setImage(originalImage.src);
        }
    };

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = 'transparent_image.png';
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    const pickColorFromCanvas = (e) => {
        if (!canvasRef.current || mode !== 'color') return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
        const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
        setColorToTransparent(hex);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Image to Transparent</h2>
                <p className="text-[var(--text-muted)] text-sm">Add transparency to your images</p>
            </div>

            <div className="space-y-4">
                {/* Upload Area */}
                {!image ? (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[var(--border-primary)] rounded-xl p-12 text-center cursor-pointer hover:border-[var(--accent-primary)] transition-colors"
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
                        <p className="text-[var(--text-secondary)]">Click to upload image</p>
                        <p className="text-xs text-[var(--text-muted)] mt-2">PNG, JPG up to 10MB</p>
                    </motion.div>
                ) : (
                    <>
                        {/* Mode Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Transparency Mode</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setMode('uniform')}
                                    className={`p-3 rounded-xl text-center transition-colors ${mode === 'uniform' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    <Droplets className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-xs">Uniform</p>
                                </button>
                                <button
                                    onClick={() => setMode('gradient')}
                                    className={`p-3 rounded-xl text-center transition-colors ${mode === 'gradient' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    <Sliders className="w-5 h-5 mx-auto mb-1" />
                                    <p className="text-xs">Gradient</p>
                                </button>
                                <button
                                    onClick={() => setMode('color')}
                                    className={`p-3 rounded-xl text-center transition-colors ${mode === 'color' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    <div
                                        className="w-5 h-5 mx-auto mb-1 rounded border border-white/30"
                                        style={{ backgroundColor: colorToTransparent }}
                                    />
                                    <p className="text-xs">Color</p>
                                </button>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {mode === 'color' ? 'Transparency Level' : 'Opacity'}: {opacity}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {mode === 'color' && (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Color to Make Transparent</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={colorToTransparent}
                                                    onChange={(e) => setColorToTransparent(e.target.value)}
                                                    className="w-12 h-10 rounded cursor-pointer"
                                                />
                                                <span className="text-sm font-mono">{colorToTransparent}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium mb-2">Tolerance: {colorTolerance}</label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={colorTolerance}
                                                onChange={(e) => setColorTolerance(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        💡 Click on the image to pick a color
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Canvas Preview with checkered background */}
                        <div
                            className="p-4 bg-[var(--bg-tertiary)] rounded-xl flex justify-center"
                            style={{
                                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }}
                        >
                            <canvas
                                ref={canvasRef}
                                onClick={pickColorFromCanvas}
                                className={`max-w-full rounded-lg ${mode === 'color' ? 'cursor-crosshair' : ''}`}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={applyTransparency}
                                disabled={processing}
                                className="btn-primary flex-1"
                            >
                                <Droplets className="w-4 h-4 mr-2" />
                                {processing ? 'Processing...' : 'Apply Transparency'}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={resetImage}
                                className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={downloadImage}
                            className="btn-primary w-full"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download PNG (Transparent)
                        </motion.button>

                        <button
                            onClick={() => {
                                setImage(null);
                                setOriginalImage(null);
                            }}
                            className="w-full py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            Upload Different Image
                        </button>
                    </>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageToTransparent;
