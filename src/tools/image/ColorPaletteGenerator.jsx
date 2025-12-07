import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, Shuffle } from 'lucide-react';

const ColorPaletteGenerator = () => {
    const [baseColor, setBaseColor] = useState('#3b82f6');
    const [paletteType, setPaletteType] = useState('complementary');
    const [copied, setCopied] = useState(null);

    const paletteTypes = [
        { id: 'complementary', name: 'Complementary' },
        { id: 'triadic', name: 'Triadic' },
        { id: 'analogous', name: 'Analogous' },
        { id: 'split', name: 'Split Complementary' },
        { id: 'monochromatic', name: 'Monochromatic' },
        { id: 'tetradic', name: 'Tetradic' }
    ];

    const hexToHSL = (hex) => {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const hslToHex = (h, s, l) => {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    const generatePalette = () => {
        const hsl = hexToHSL(baseColor);
        const colors = [];

        switch (paletteType) {
            case 'complementary':
                colors.push(baseColor);
                colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                colors.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100)));
                colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(hsl.l - 20, 0)));
                colors.push(hslToHex(hsl.h, Math.max(hsl.s - 30, 0), hsl.l));
                break;
            case 'triadic':
                colors.push(baseColor);
                colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
                colors.push(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
                colors.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 100)));
                colors.push(hslToHex((hsl.h + 120) % 360, hsl.s, Math.max(hsl.l - 15, 0)));
                break;
            case 'analogous':
                colors.push(hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
                colors.push(hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l));
                colors.push(baseColor);
                colors.push(hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l));
                colors.push(hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
                break;
            case 'split':
                colors.push(baseColor);
                colors.push(hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l));
                colors.push(hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l));
                colors.push(hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100)));
                colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(hsl.l - 20, 0)));
                break;
            case 'monochromatic':
                colors.push(hslToHex(hsl.h, hsl.s, 10));
                colors.push(hslToHex(hsl.h, hsl.s, 30));
                colors.push(baseColor);
                colors.push(hslToHex(hsl.h, hsl.s, 70));
                colors.push(hslToHex(hsl.h, hsl.s, 90));
                break;
            case 'tetradic':
                colors.push(baseColor);
                colors.push(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
                colors.push(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                colors.push(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
                colors.push(hslToHex(hsl.h, Math.max(hsl.s - 30, 0), hsl.l));
                break;
        }

        return colors;
    };

    const palette = generatePalette();

    const copyColor = (color, index) => {
        navigator.clipboard.writeText(color);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    const randomColor = () => {
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setBaseColor(randomHex);
    };

    const exportPalette = () => {
        const css = palette.map((c, i) => `--color-${i + 1}: ${c};`).join('\n');
        navigator.clipboard.writeText(`:root {\n${css}\n}`);
        alert('CSS variables copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Color Palette Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate harmonious color palettes</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Base Color</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="w-16 h-10 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="input flex-1 font-mono"
                            />
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={randomColor}
                        className="mt-6 p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <Shuffle className="w-5 h-5" />
                    </motion.button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Palette Type</label>
                    <div className="flex flex-wrap gap-2">
                        {paletteTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setPaletteType(type.id)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${paletteType === type.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {type.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                    {palette.map((color, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyColor(color, i)}
                            className="aspect-square rounded-xl flex items-end justify-center pb-2 relative overflow-hidden"
                            style={{ backgroundColor: color }}
                        >
                            {copied === i && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                                >
                                    <Check className="w-6 h-6 text-white" />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-5 gap-2">
                    {palette.map((color, i) => (
                        <p key={i} className="text-xs text-center font-mono text-[var(--text-muted)]">
                            {color}
                        </p>
                    ))}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportPalette}
                    className="btn-primary w-full"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSS Variables
                </motion.button>
            </div>
        </div>
    );
};

export default ColorPaletteGenerator;
