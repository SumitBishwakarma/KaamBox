import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Copy, Check, RefreshCw, Download } from 'lucide-react';

const GradientGenerator = () => {
    const [color1, setColor1] = useState('#667eea');
    const [color2, setColor2] = useState('#764ba2');
    const [color3, setColor3] = useState('');
    const [angle, setAngle] = useState(135);
    const [gradientType, setGradientType] = useState('linear');
    const [copied, setCopied] = useState(false);

    const presets = [
        { name: 'Sunset', colors: ['#f093fb', '#f5576c'] },
        { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
        { name: 'Forest', colors: ['#11998e', '#38ef7d'] },
        { name: 'Fire', colors: ['#f12711', '#f5af19'] },
        { name: 'Purple', colors: ['#9d50bb', '#6e48aa'] },
        { name: 'Midnight', colors: ['#232526', '#414345'] },
        { name: 'Aurora', colors: ['#00d2ff', '#3a7bd5'] },
        { name: 'Rose', colors: ['#ff6b6b', '#feca57'] },
        { name: 'Neon', colors: ['#00f260', '#0575e6'] },
        { name: 'Cotton Candy', colors: ['#d299c2', '#fef9d7'] }
    ];

    const generateGradient = () => {
        const colors = [color1, color2, color3].filter(c => c);

        if (gradientType === 'linear') {
            return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
        } else if (gradientType === 'radial') {
            return `radial-gradient(circle, ${colors.join(', ')})`;
        } else {
            return `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
        }
    };

    const gradient = generateGradient();
    const cssCode = `background: ${gradient};`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomGradient = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor1(randomColor());
        setColor2(randomColor());
        setAngle(Math.floor(Math.random() * 360));
    };

    const applyPreset = (preset) => {
        setColor1(preset.colors[0]);
        setColor2(preset.colors[1]);
        if (preset.colors[2]) {
            setColor3(preset.colors[2]);
        } else {
            setColor3('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Gradient Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create beautiful CSS gradients for your projects</p>
            </div>

            <div className="space-y-4">
                {/* Preview */}
                <div
                    className="w-full h-48 rounded-2xl shadow-lg"
                    style={{ background: gradient }}
                />

                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Color 1</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color1}
                                onChange={(e) => setColor1(e.target.value)}
                                className="w-12 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={color1}
                                onChange={(e) => setColor1(e.target.value)}
                                className="input flex-1 font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Color 2</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color2}
                                onChange={(e) => setColor2(e.target.value)}
                                className="w-12 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={color2}
                                onChange={(e) => setColor2(e.target.value)}
                                className="input flex-1 font-mono text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Color 3 (Optional)</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color3 || '#ffffff'}
                                onChange={(e) => setColor3(e.target.value)}
                                className="w-12 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={color3}
                                onChange={(e) => setColor3(e.target.value)}
                                placeholder="Optional"
                                className="input flex-1 font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Gradient Type</label>
                        <div className="flex gap-2">
                            {['linear', 'radial', 'conic'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setGradientType(type)}
                                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${gradientType === type ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Angle: {angle}°</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => setAngle(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Presets */}
                <div>
                    <label className="block text-sm font-medium mb-2">Presets</label>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-1.5 rounded-lg text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                style={{
                                    background: `linear-gradient(to right, ${preset.colors.join(', ')})`
                                }}
                            >
                                <span className="mix-blend-difference text-white">{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={randomGradient}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        className="btn-primary flex-1"
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy CSS'}
                    </motion.button>
                </div>

                {/* CSS Output */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-xs text-[var(--text-muted)] mb-2">CSS Code:</p>
                    <code className="font-mono text-sm text-green-400 break-all">{cssCode}</code>
                </div>
            </div>
        </div>
    );
};

export default GradientGenerator;
