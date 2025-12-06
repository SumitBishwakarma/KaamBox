import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const QRGenerator = () => {
    const [text, setText] = useState('https://kaambox.com');
    const [size, setSize] = useState(256);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorLevel, setErrorLevel] = useState('M');
    const qrRef = useRef(null);
    const { toast } = useToast();

    const downloadQR = (format) => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        if (format === 'svg') {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.svg';
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            img.onload = () => {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = 'qrcode.png';
                a.click();
                URL.revokeObjectURL(url);
            };
            img.src = url;
        }

        toast.success(`QR Code downloaded as ${format.toUpperCase()}`);
    };

    const copyToClipboard = async () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = async () => {
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]);
                    toast.success('QR Code copied to clipboard');
                } catch (e) {
                    toast.error('Failed to copy - try downloading instead');
                }
            });
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    const presets = [
        { label: 'Classic', fg: '#000000', bg: '#ffffff' },
        { label: 'Inverted', fg: '#ffffff', bg: '#000000' },
        { label: 'Blue', fg: '#3b82f6', bg: '#eff6ff' },
        { label: 'Green', fg: '#22c55e', bg: '#f0fdf4' },
        { label: 'Purple', fg: '#8b5cf6', bg: '#faf5ff' },
        { label: 'Dark', fg: '#e2e8f0', bg: '#1e293b' },
    ];

    return (
        <div className="space-y-6">
            {/* Input */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Text or URL
                </label>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text or URL..."
                    className="input-field"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings */}
                <div className="space-y-4">
                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Size: {size}px
                        </label>
                        <input
                            type="range"
                            min="128"
                            max="512"
                            step="32"
                            value={size}
                            onChange={(e) => setSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>

                    {/* Error Correction */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Error Correction Level
                        </label>
                        <div className="flex gap-2">
                            {['L', 'M', 'Q', 'H'].map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setErrorLevel(level)}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${errorLevel === level
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    {level} ({level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Foreground
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="w-12 h-10 rounded-lg cursor-pointer border-none"
                                />
                                <input
                                    type="text"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className="input-field flex-1 font-mono uppercase"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Background
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-12 h-10 rounded-lg cursor-pointer border-none"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="input-field flex-1 font-mono uppercase"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Color Presets */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Color Presets
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        setFgColor(preset.fg);
                                        setBgColor(preset.bg);
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm"
                                >
                                    <div
                                        className="w-4 h-4 rounded border border-[var(--border-color)]"
                                        style={{ background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)` }}
                                    />
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* QR Code Preview */}
                <div className="flex flex-col items-center">
                    <div
                        ref={qrRef}
                        className="p-6 rounded-2xl shadow-lg"
                        style={{ backgroundColor: bgColor }}
                    >
                        {text ? (
                            <QRCodeSVG
                                value={text}
                                size={size}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                level={errorLevel}
                            />
                        ) : (
                            <div
                                className="flex items-center justify-center text-[var(--text-muted)]"
                                style={{ width: size, height: size }}
                            >
                                Enter text to generate QR code
                            </div>
                        )}
                    </div>

                    {/* Download Buttons */}
                    {text && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            <button onClick={() => downloadQR('png')} className="btn-primary">
                                <Download size={18} />
                                Download PNG
                            </button>
                            <button onClick={() => downloadQR('svg')} className="btn-secondary">
                                <Download size={18} />
                                Download SVG
                            </button>
                            <button onClick={copyToClipboard} className="btn-secondary">
                                <Copy size={18} />
                                Copy
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-400">
                    <strong>Tip:</strong> Higher error correction levels make the QR code more resistant to damage but may reduce capacity for long texts.
                </p>
            </div>
        </div>
    );
};

export default QRGenerator;
