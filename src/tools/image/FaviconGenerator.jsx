import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Download, Copy, Check, Palette, Square } from 'lucide-react';

const FaviconGenerator = () => {
    const [text, setText] = useState('A');
    const [bgColor, setBgColor] = useState('#3b82f6');
    const [textColor, setTextColor] = useState('#ffffff');
    const [shape, setShape] = useState('rounded');
    const [fontSize, setFontSize] = useState(48);
    const [copied, setCopied] = useState(false);

    const shapes = [
        { id: 'circle', name: 'Circle' },
        { id: 'rounded', name: 'Rounded' },
        { id: 'square', name: 'Square' }
    ];

    const colorPresets = [
        '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444',
        '#f59e0b', '#10b981', '#14b8a6', '#6366f1',
        '#000000', '#1f2937', '#374151', '#6b7280'
    ];

    const generateCanvas = (size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = bgColor;
        if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (shape === 'rounded') {
            const radius = size * 0.15;
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, radius);
            ctx.fill();
        } else {
            ctx.fillRect(0, 0, size, size);
        }

        // Text
        ctx.fillStyle = textColor;
        const adjustedFontSize = (fontSize / 64) * size;
        ctx.font = `bold ${adjustedFontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.substring(0, 2), size / 2, size / 2 + size * 0.05);

        return canvas;
    };

    const downloadFavicon = (size, name) => {
        const canvas = generateCanvas(size);
        const link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const downloadAll = () => {
        downloadFavicon(16, 'favicon-16x16');
        setTimeout(() => downloadFavicon(32, 'favicon-32x32'), 100);
        setTimeout(() => downloadFavicon(180, 'apple-touch-icon'), 200);
        setTimeout(() => downloadFavicon(192, 'android-chrome-192x192'), 300);
        setTimeout(() => downloadFavicon(512, 'android-chrome-512x512'), 400);
    };

    const preview = generateCanvas(128);

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Favicon Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create website favicons from text</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-center">
                    <div
                        className="w-32 h-32 flex items-center justify-center text-4xl font-bold"
                        style={{
                            backgroundColor: bgColor,
                            color: textColor,
                            borderRadius: shape === 'circle' ? '50%' : shape === 'rounded' ? '20%' : '0',
                            fontSize: `${fontSize}px`
                        }}
                    >
                        {text.substring(0, 2)}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Text (1-2 characters)</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={2}
                        className="input w-full text-center text-2xl"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Shape</label>
                    <div className="flex gap-2">
                        {shapes.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setShape(s.id)}
                                className={`flex-1 py-2 rounded-lg transition-colors ${shape === s.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
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
                    <label className="block text-sm font-medium mb-2">Color Presets</label>
                    <div className="flex flex-wrap gap-2">
                        {colorPresets.map(color => (
                            <button
                                key={color}
                                onClick={() => setBgColor(color)}
                                className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-white transition-all"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
                    <input
                        type="range"
                        min="24"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadAll}
                    className="btn-primary w-full"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Download All Sizes
                </motion.button>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { size: 16, name: '16×16' },
                        { size: 32, name: '32×32' },
                        { size: 180, name: 'Apple Touch' },
                        { size: 512, name: '512×512' }
                    ].map(item => (
                        <button
                            key={item.size}
                            onClick={() => downloadFavicon(item.size, `favicon-${item.size}`)}
                            className="p-2 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FaviconGenerator;
