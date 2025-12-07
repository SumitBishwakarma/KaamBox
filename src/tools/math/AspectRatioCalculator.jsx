import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, RotateCw, Copy, Check } from 'lucide-react';

const AspectRatioCalculator = () => {
    const [width, setWidth] = useState('1920');
    const [height, setHeight] = useState('1080');
    const [newWidth, setNewWidth] = useState('');
    const [newHeight, setNewHeight] = useState('');
    const [lockRatio, setLockRatio] = useState(true);
    const [copied, setCopied] = useState(false);

    const gcd = (a, b) => {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    };

    const calculateRatio = () => {
        const w = parseInt(width) || 0;
        const h = parseInt(height) || 0;
        if (w === 0 || h === 0) return '—';

        const divisor = gcd(w, h);
        return `${w / divisor}:${h / divisor}`;
    };

    const decimalRatio = () => {
        const w = parseInt(width) || 0;
        const h = parseInt(height) || 0;
        if (w === 0 || h === 0) return '—';
        return (w / h).toFixed(4);
    };

    const calculateNewDimension = (dimension, value) => {
        const w = parseInt(width) || 0;
        const h = parseInt(height) || 0;
        if (w === 0 || h === 0) return '';

        const newValue = parseInt(value) || 0;
        if (newValue === 0) return '';

        if (dimension === 'width') {
            setNewWidth(value);
            if (lockRatio) {
                setNewHeight(Math.round((newValue * h) / w).toString());
            }
        } else {
            setNewHeight(value);
            if (lockRatio) {
                setNewWidth(Math.round((newValue * w) / h).toString());
            }
        }
    };

    const swapDimensions = () => {
        const temp = width;
        setWidth(height);
        setHeight(temp);
    };

    const commonPresets = [
        { name: '4K UHD', width: 3840, height: 2160 },
        { name: 'Full HD', width: 1920, height: 1080 },
        { name: 'HD', width: 1280, height: 720 },
        { name: 'Square', width: 1080, height: 1080 },
        { name: 'Instagram Story', width: 1080, height: 1920 },
        { name: 'Twitter Header', width: 1500, height: 500 },
        { name: 'Facebook Cover', width: 820, height: 312 },
        { name: 'YouTube Thumbnail', width: 1280, height: 720 }
    ];

    const copyRatio = () => {
        navigator.clipboard.writeText(`${width}×${height} (${calculateRatio()})`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Aspect Ratio Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate and scale aspect ratios</p>
            </div>

            <div className="space-y-4">
                {/* Original Dimensions */}
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl text-center">
                    <p className="text-sm text-[var(--text-muted)] mb-3">Aspect Ratio</p>
                    <p className="text-4xl font-bold mb-1">{calculateRatio()}</p>
                    <p className="text-sm text-[var(--text-muted)]">{decimalRatio()} (decimal)</p>
                </div>

                {/* Input Fields */}
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Width</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            placeholder="Width"
                            className="input w-full text-center text-xl"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={swapDimensions}
                        className="mt-6 p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <RotateCw className="w-5 h-5" />
                    </motion.button>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Height</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Height"
                            className="input w-full text-center text-xl"
                        />
                    </div>
                </div>

                {/* Presets */}
                <div>
                    <label className="block text-sm font-medium mb-2">Common Sizes</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {commonPresets.map(p => (
                            <button
                                key={p.name}
                                onClick={() => { setWidth(p.width.toString()); setHeight(p.height.toString()); }}
                                className="p-2 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <p className="font-medium">{p.name}</p>
                                <p className="text-[var(--text-muted)]">{p.width}×{p.height}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scale Calculator */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">Scale to New Size</p>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={lockRatio}
                                onChange={(e) => setLockRatio(e.target.checked)}
                                className="rounded"
                            />
                            Lock Ratio
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">New Width</label>
                            <input
                                type="number"
                                value={newWidth}
                                onChange={(e) => calculateNewDimension('width', e.target.value)}
                                placeholder="Enter width"
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">New Height</label>
                            <input
                                type="number"
                                value={newHeight}
                                onChange={(e) => calculateNewDimension('height', e.target.value)}
                                placeholder="Enter height"
                                className="input w-full"
                            />
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyRatio}
                    className="btn-primary w-full"
                >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Dimensions'}
                </motion.button>
            </div>
        </div>
    );
};

export default AspectRatioCalculator;
