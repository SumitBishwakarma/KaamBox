import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Download, Copy, Check, Palette } from 'lucide-react';

const PlaceholderImage = () => {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [bgColor, setBgColor] = useState('#374151');
    const [textColor, setTextColor] = useState('#9ca3af');
    const [text, setText] = useState('');
    const [format, setFormat] = useState('png');
    const [copied, setCopied] = useState(false);

    const presets = [
        { name: 'Thumbnail', w: 150, h: 150 },
        { name: 'Banner', w: 1200, h: 300 },
        { name: 'Square', w: 400, h: 400 },
        { name: 'HD', w: 1280, h: 720 },
        { name: 'Full HD', w: 1920, h: 1080 },
        { name: 'Instagram Post', w: 1080, h: 1080 },
        { name: 'Facebook Cover', w: 820, h: 312 },
        { name: 'Twitter Header', w: 1500, h: 500 }
    ];

    const generateImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Grid pattern
        ctx.strokeStyle = textColor + '20';
        ctx.lineWidth = 1;
        const gridSize = 20;
        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Text
        ctx.fillStyle = textColor;
        const displayText = text || `${width} × ${height}`;
        const fontSize = Math.min(width, height) * 0.1;
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(displayText, width / 2, height / 2);

        return canvas;
    };

    const downloadImage = () => {
        const canvas = generateImage();
        const link = document.createElement('a');
        link.download = `placeholder_${width}x${height}.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, 0.9);
        link.click();
    };

    const copyDataUrl = async () => {
        const canvas = generateImage();
        const dataUrl = canvas.toDataURL('image/png');
        await navigator.clipboard.writeText(dataUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const previewCanvas = generateImage();
    const previewUrl = previewCanvas.toDataURL('image/png');

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Placeholder Image Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create placeholder images for development</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-center">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-48 rounded-xl border border-[var(--bg-tertiary)]"
                        style={{ objectFit: 'contain' }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Width (px)</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(parseInt(e.target.value) || 100)}
                            min="10"
                            max="4000"
                            className="input w-full text-center"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Height (px)</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                            min="10"
                            max="4000"
                            className="input w-full text-center"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Presets</label>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <button
                                key={p.name}
                                onClick={() => { setWidth(p.w); setHeight(p.h); }}
                                className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Custom Text (optional)</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`${width} × ${height}`}
                        className="input w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Background</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="w-12 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={bgColor}
                                onChange={(e) => setBgColor(e.target.value)}
                                className="input flex-1 font-mono text-sm"
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
                            <input
                                type="text"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="input flex-1 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Format</label>
                    <div className="flex gap-2">
                        {['png', 'jpeg', 'webp'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFormat(f)}
                                className={`flex-1 py-2 rounded-lg uppercase text-sm transition-colors ${format === f ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadImage}
                        className="btn-primary flex-1"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyDataUrl}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderImage;
