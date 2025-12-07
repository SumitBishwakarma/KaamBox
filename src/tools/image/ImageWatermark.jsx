import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Upload, Download, Trash2, Type } from 'lucide-react';

const ImageWatermark = () => {
    const [image, setImage] = useState(null);
    const [watermarkText, setWatermarkText] = useState('© Your Name');
    const [position, setPosition] = useState('bottom-right');
    const [opacity, setOpacity] = useState(50);
    const [fontSize, setFontSize] = useState(24);
    const [textColor, setTextColor] = useState('#ffffff');
    const canvasRef = useRef(null);

    const positions = [
        { id: 'top-left', name: 'Top Left' },
        { id: 'top-right', name: 'Top Right' },
        { id: 'center', name: 'Center' },
        { id: 'bottom-left', name: 'Bottom Left' },
        { id: 'bottom-right', name: 'Bottom Right' }
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const getPosition = (imgWidth, imgHeight, textWidth, textHeight) => {
        const padding = 20;
        switch (position) {
            case 'top-left':
                return { x: padding, y: padding + textHeight };
            case 'top-right':
                return { x: imgWidth - textWidth - padding, y: padding + textHeight };
            case 'center':
                return { x: (imgWidth - textWidth) / 2, y: imgHeight / 2 };
            case 'bottom-left':
                return { x: padding, y: imgHeight - padding };
            case 'bottom-right':
            default:
                return { x: imgWidth - textWidth - padding, y: imgHeight - padding };
        }
    };

    const applyWatermark = () => {
        if (!image || !canvasRef.current) return null;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image
                ctx.drawImage(img, 0, 0);

                // Set watermark style
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillStyle = textColor;
                ctx.globalAlpha = opacity / 100;

                // Measure text
                const textMetrics = ctx.measureText(watermarkText);
                const textWidth = textMetrics.width;
                const textHeight = fontSize;

                // Get position
                const pos = getPosition(img.width, img.height, textWidth, textHeight);

                // Add shadow for visibility
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Draw watermark
                ctx.fillText(watermarkText, pos.x, pos.y);

                resolve(canvas.toDataURL('image/png'));
            };
            img.src = image;
        });
    };

    const downloadImage = async () => {
        const dataUrl = await applyWatermark();
        if (dataUrl) {
            const link = document.createElement('a');
            link.download = 'watermarked_image.png';
            link.href = dataUrl;
            link.click();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Image Watermark</h2>
                <p className="text-[var(--text-muted)] text-sm">Add text watermark to images</p>
            </div>

            <div className="space-y-4">
                {!image ? (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[var(--bg-tertiary)] rounded-xl cursor-pointer hover:border-[var(--accent-primary)] transition-colors">
                        <Upload className="w-12 h-12 mb-3 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">Click or drag to upload image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                ) : (
                    <>
                        <div className="relative">
                            <canvas ref={canvasRef} className="hidden" />
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full max-h-64 object-contain rounded-xl bg-[var(--bg-tertiary)]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setImage(null)}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>

                            {/* Watermark Preview Overlay */}
                            <div
                                className="absolute inset-0 flex pointer-events-none"
                                style={{
                                    alignItems: position.includes('top') ? 'flex-start' : position === 'center' ? 'center' : 'flex-end',
                                    justifyContent: position.includes('left') ? 'flex-start' : position.includes('right') ? 'flex-end' : 'center',
                                    padding: '20px'
                                }}
                            >
                                <span
                                    style={{
                                        color: textColor,
                                        opacity: opacity / 100,
                                        fontSize: `${fontSize}px`,
                                        fontWeight: 'bold',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {watermarkText}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Watermark Text</label>
                            <input
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                placeholder="© Your Name"
                                className="input w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Position</label>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {positions.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPosition(p.id)}
                                        className={`py-2 rounded-lg text-xs transition-colors ${position === p.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Opacity: {opacity}%</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={opacity}
                                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
                                <input
                                    type="range"
                                    min="12"
                                    max="72"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Text Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    className="w-12 h-10 rounded-lg cursor-pointer"
                                />
                                <div className="flex gap-2">
                                    {['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff'].map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setTextColor(c)}
                                            className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-white"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={downloadImage}
                            className="btn-primary w-full"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Watermarked Image
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageWatermark;
