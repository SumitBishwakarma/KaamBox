import { useState } from 'react';
import { Lock, Unlock, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AspectRatio = () => {
    const [width, setWidth] = useState(1920);
    const [height, setHeight] = useState(1080);
    const [newWidth, setNewWidth] = useState('');
    const [newHeight, setNewHeight] = useState('');
    const [locked, setLocked] = useState(true);
    const { toast } = useToast();

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

    const calculateRatio = () => {
        const divisor = gcd(width, height);
        return {
            w: width / divisor,
            h: height / divisor,
            decimal: (width / height).toFixed(4)
        };
    };

    const ratio = calculateRatio();

    const handleNewWidthChange = (value) => {
        setNewWidth(value);
        if (locked && value) {
            const calculatedHeight = Math.round((parseInt(value) * height) / width);
            setNewHeight(calculatedHeight.toString());
        }
    };

    const handleNewHeightChange = (value) => {
        setNewHeight(value);
        if (locked && value) {
            const calculatedWidth = Math.round((parseInt(value) * width) / height);
            setNewWidth(calculatedWidth.toString());
        }
    };

    const swapDimensions = () => {
        setWidth(height);
        setHeight(width);
    };

    const commonRatios = [
        { name: '16:9 (HD)', w: 1920, h: 1080 },
        { name: '4:3 (Standard)', w: 1024, h: 768 },
        { name: '21:9 (Ultrawide)', w: 2560, h: 1080 },
        { name: '1:1 (Square)', w: 1000, h: 1000 },
        { name: '3:2 (Photo)', w: 1500, h: 1000 },
        { name: '9:16 (Mobile)', w: 1080, h: 1920 },
        { name: '4:5 (Instagram)', w: 1080, h: 1350 },
        { name: '2:3 (Portrait)', w: 1000, h: 1500 }
    ];

    const applyPreset = (preset) => {
        setWidth(preset.w);
        setHeight(preset.h);
        setNewWidth('');
        setNewHeight('');
        toast.success(`Applied ${preset.name}`);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Original Width
                    </label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                        className="input-field"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Original Height
                    </label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                        className="input-field"
                        min="1"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <button onClick={swapDimensions} className="btn-secondary">
                    <RefreshCw size={18} />
                    Swap W ↔ H
                </button>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl text-center">
                <p className="text-sm text-[var(--text-muted)] mb-2">Aspect Ratio</p>
                <p className="text-4xl font-bold mb-2">{ratio.w}:{ratio.h}</p>
                <p className="text-sm text-[var(--text-muted)]">
                    Decimal: {ratio.decimal}
                </p>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Resize Calculator</h4>
                    <button
                        onClick={() => setLocked(!locked)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${locked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                    >
                        {locked ? <Lock size={16} /> : <Unlock size={16} />}
                        {locked ? 'Locked' : 'Unlocked'}
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-[var(--text-muted)] mb-1">New Width</label>
                        <input
                            type="number"
                            value={newWidth}
                            onChange={(e) => handleNewWidthChange(e.target.value)}
                            placeholder="Enter width"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--text-muted)] mb-1">New Height</label>
                        <input
                            type="number"
                            value={newHeight}
                            onChange={(e) => handleNewHeightChange(e.target.value)}
                            placeholder="Enter height"
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    Common Aspect Ratios
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {commonRatios.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => applyPreset(preset)}
                            className="p-3 bg-[var(--bg-tertiary)] hover:bg-blue-500/20 rounded-lg text-left transition-colors"
                        >
                            <p className="font-medium text-sm">{preset.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{preset.w}×{preset.h}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-3">Visual Preview</h4>
                <div className="flex justify-center">
                    <div
                        className="border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center"
                        style={{
                            width: Math.min(200, 200 * (ratio.w / Math.max(ratio.w, ratio.h))),
                            height: Math.min(200, 200 * (ratio.h / Math.max(ratio.w, ratio.h)))
                        }}
                    >
                        <span className="text-sm font-mono">{ratio.w}:{ratio.h}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AspectRatio;
