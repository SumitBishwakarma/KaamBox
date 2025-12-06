import { useState, useMemo } from 'react';
import { RefreshCw, Copy, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SVGBlob = () => {
    const [complexity, setComplexity] = useState(6);
    const [size, setSize] = useState(300);
    const [fillColor, setFillColor] = useState('#3b82f6');
    const [seed, setSeed] = useState(Math.random());
    const { toast } = useToast();

    const generateBlob = useMemo(() => {
        const points = [];
        const angleStep = (Math.PI * 2) / complexity;
        const radius = size / 2 - 10;
        const centerX = size / 2;
        const centerY = size / 2;

        // Use seed for reproducible randomness
        const seededRandom = (i) => {
            const x = Math.sin(seed * 10000 + i * 1000) * 10000;
            return x - Math.floor(x);
        };

        for (let i = 0; i < complexity; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const randomRadius = radius * (0.7 + seededRandom(i) * 0.3);
            points.push({
                x: centerX + Math.cos(angle) * randomRadius,
                y: centerY + Math.sin(angle) * randomRadius
            });
        }

        // Create smooth bezier path
        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length; i++) {
            const p0 = points[i];
            const p1 = points[(i + 1) % points.length];
            const p2 = points[(i + 2) % points.length];

            const cp1x = p0.x + (p1.x - points[(i - 1 + points.length) % points.length].x) * 0.25;
            const cp1y = p0.y + (p1.y - points[(i - 1 + points.length) % points.length].y) * 0.25;
            const cp2x = p1.x - (p2.x - p0.x) * 0.25;
            const cp2y = p1.y - (p2.y - p0.y) * 0.25;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }

        path += ' Z';
        return path;
    }, [complexity, size, seed]);

    const svgCode = `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <path d="${generateBlob}" fill="${fillColor}"/>
</svg>`;

    const regenerate = () => {
        setSeed(Math.random());
    };

    const copySVG = () => {
        navigator.clipboard.writeText(svgCode);
        toast.success('SVG code copied to clipboard');
    };

    const downloadSVG = () => {
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `blob-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('SVG downloaded');
    };

    const presets = [
        { name: 'Blue', color: '#3b82f6' },
        { name: 'Purple', color: '#8b5cf6' },
        { name: 'Green', color: '#10b981' },
        { name: 'Orange', color: '#f59e0b' },
        { name: 'Pink', color: '#ec4899' },
        { name: 'Red', color: '#ef4444' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-center p-8 bg-[var(--bg-tertiary)] rounded-xl">
                <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, maxWidth: '100%' }}>
                    <path d={generateBlob} fill={fillColor} />
                </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Complexity: {complexity}
                    </label>
                    <input
                        type="range"
                        min="3"
                        max="12"
                        value={complexity}
                        onChange={(e) => setComplexity(parseInt(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Size: {size}px
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="500"
                        step="50"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Color
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                            type="text"
                            value={fillColor}
                            onChange={(e) => setFillColor(e.target.value)}
                            className="input-field flex-1 font-mono"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Color Presets
                </label>
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => setFillColor(preset.color)}
                            className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-white transition-colors"
                            style={{ backgroundColor: preset.color }}
                            title={preset.name}
                        />
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={regenerate} className="btn-primary">
                    <RefreshCw size={18} />
                    Regenerate
                </button>
                <button onClick={copySVG} className="btn-secondary">
                    <Copy size={18} />
                    Copy SVG
                </button>
                <button onClick={downloadSVG} className="btn-secondary">
                    <Download size={18} />
                    Download
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    SVG Code
                </label>
                <textarea
                    value={svgCode}
                    readOnly
                    className="textarea-field !min-h-[100px] font-mono text-sm"
                />
            </div>
        </div>
    );
};

export default SVGBlob;
