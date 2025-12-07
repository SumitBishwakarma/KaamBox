import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Download, Upload, Trash2, Move } from 'lucide-react';

const ImageResizer = () => {
    const [image, setImage] = useState(null);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    const [newWidth, setNewWidth] = useState(0);
    const [newHeight, setNewHeight] = useState(0);
    const [maintainRatio, setMaintainRatio] = useState(true);
    const [format, setFormat] = useState('png');
    const [quality, setQuality] = useState(92);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setOriginalSize({ width: img.width, height: img.height });
                setNewWidth(img.width);
                setNewHeight(img.height);
            };
            img.src = event.target.result;
            setImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleWidthChange = (value) => {
        const width = parseInt(value) || 0;
        setNewWidth(width);
        if (maintainRatio && width > 0 && originalSize.width > 0) {
            const ratio = originalSize.height / originalSize.width;
            setNewHeight(Math.round(width * ratio));
        }
    };

    const handleHeightChange = (value) => {
        const height = parseInt(value) || 0;
        setNewHeight(height);
        if (maintainRatio && height > 0 && originalSize.height > 0) {
            const ratio = originalSize.width / originalSize.height;
            setNewWidth(Math.round(height * ratio));
        }
    };

    const presetSizes = [
        { name: 'Profile (150x150)', width: 150, height: 150 },
        { name: 'Thumbnail (320x180)', width: 320, height: 180 },
        { name: 'HD (1280x720)', width: 1280, height: 720 },
        { name: 'Full HD (1920x1080)', width: 1920, height: 1080 },
        { name: 'Instagram (1080x1080)', width: 1080, height: 1080 },
        { name: 'Twitter Header (1500x500)', width: 1500, height: 500 }
    ];

    const downloadResizedImage = () => {
        if (!image) return;

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            let mimeType = 'image/png';
            let extension = 'png';

            if (format === 'jpeg' || format === 'jpg') {
                mimeType = 'image/jpeg';
                extension = 'jpg';
            } else if (format === 'webp') {
                mimeType = 'image/webp';
                extension = 'webp';
            }

            const link = document.createElement('a');
            link.download = `resized_${newWidth}x${newHeight}.${extension}`;
            link.href = canvas.toDataURL(mimeType, quality / 100);
            link.click();
        };
        img.src = image;
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Image Resizer</h2>
                <p className="text-[var(--text-muted)] text-sm">Resize images to any dimension</p>
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
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full max-h-64 object-contain rounded-xl bg-[var(--bg-tertiary)]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setImage(null); setOriginalSize({ width: 0, height: 0 }); }}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-sm text-center">
                            Original: {originalSize.width} × {originalSize.height} px
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Width (px)</label>
                                <input
                                    type="number"
                                    value={newWidth}
                                    onChange={(e) => handleWidthChange(e.target.value)}
                                    className="input w-full text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Height (px)</label>
                                <input
                                    type="number"
                                    value={newHeight}
                                    onChange={(e) => handleHeightChange(e.target.value)}
                                    className="input w-full text-center"
                                />
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={maintainRatio}
                                onChange={(e) => setMaintainRatio(e.target.checked)}
                                className="w-5 h-5 rounded"
                            />
                            <span className="text-sm">Maintain aspect ratio</span>
                        </label>

                        <div>
                            <label className="block text-sm font-medium mb-2">Preset Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {presetSizes.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => {
                                            setNewWidth(preset.width);
                                            setNewHeight(preset.height);
                                            setMaintainRatio(false);
                                        }}
                                        className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Format</label>
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="png">PNG</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="webp">WebP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Quality: {quality}%</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={downloadResizedImage}
                            className="btn-primary w-full"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Resized Image ({newWidth}×{newHeight})
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageResizer;
