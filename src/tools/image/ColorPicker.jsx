import { useState, useEffect } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ColorPicker = () => {
    const [color, setColor] = useState('#3b82f6');
    const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
    const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
    const { toast } = useToast();

    // Convert HEX to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    // Convert RGB to HEX
    const rgbToHex = (r, g, b) => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    };

    // Convert RGB to HSL
    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
                default: h = 0;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    };

    // Convert HSL to RGB
    const hslToRgb = (h, s, l) => {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    };

    // Update all values when HEX changes
    useEffect(() => {
        const rgbVal = hexToRgb(color);
        setRgb(rgbVal);
        setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }, [color]);

    const handleRgbChange = (key, value) => {
        const newRgb = { ...rgb, [key]: Math.max(0, Math.min(255, parseInt(value) || 0)) };
        setRgb(newRgb);
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    const handleHslChange = (key, value) => {
        const max = key === 'h' ? 360 : 100;
        const newHsl = { ...hsl, [key]: Math.max(0, Math.min(max, parseInt(value) || 0)) };
        setHsl(newHsl);
        const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        setRgb(newRgb);
        setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    const copyValue = (value, label) => {
        navigator.clipboard.writeText(value);
        toast.success(`${label} copied!`);
    };

    const generateRandom = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor(randomColor);
        toast.info('Random color generated!');
    };

    const colorFormats = [
        { label: 'HEX', value: color.toUpperCase() },
        { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
        { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        { label: 'CSS', value: color }
    ];

    return (
        <div className="space-y-6">
            {/* Color Preview & Picker */}
            <div className="flex flex-col sm:flex-row gap-6">
                {/* Large Color Preview */}
                <div
                    className="w-full sm:w-48 h-48 rounded-2xl shadow-lg border border-[var(--border-color)]"
                    style={{ backgroundColor: color }}
                />

                {/* Color Picker & Random */}
                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Pick a Color
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-16 h-12 rounded-lg cursor-pointer border-none"
                            />
                            <input
                                type="text"
                                value={color.toUpperCase()}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                                        setColor(val);
                                    }
                                }}
                                className="input-field flex-1 font-mono uppercase"
                                maxLength={7}
                            />
                            <button onClick={generateRandom} className="btn-secondary">
                                <RefreshCw size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Quick Copy Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {colorFormats.map((format) => (
                            <button
                                key={format.label}
                                onClick={() => copyValue(format.value, format.label)}
                                className="flex items-center justify-between gap-2 p-2 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm"
                            >
                                <span className="font-medium">{format.label}</span>
                                <Copy size={14} className="text-[var(--text-muted)]" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* RGB Sliders */}
            <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">RGB Values</h3>
                <div className="space-y-3">
                    {[
                        { key: 'r', label: 'Red', color: '#ef4444' },
                        { key: 'g', label: 'Green', color: '#22c55e' },
                        { key: 'b', label: 'Blue', color: '#3b82f6' }
                    ].map(({ key, label, color: sliderColor }) => (
                        <div key={key} className="flex items-center gap-4">
                            <span className="w-12 text-sm text-[var(--text-muted)]">{label}</span>
                            <input
                                type="range"
                                min="0"
                                max="255"
                                value={rgb[key]}
                                onChange={(e) => handleRgbChange(key, e.target.value)}
                                className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: sliderColor }}
                            />
                            <input
                                type="number"
                                min="0"
                                max="255"
                                value={rgb[key]}
                                onChange={(e) => handleRgbChange(key, e.target.value)}
                                className="w-16 input-field !py-1 !px-2 text-center font-mono text-sm"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* HSL Sliders */}
            <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">HSL Values</h3>
                <div className="space-y-3">
                    {[
                        { key: 'h', label: 'Hue', max: 360, unit: '°' },
                        { key: 's', label: 'Saturation', max: 100, unit: '%' },
                        { key: 'l', label: 'Lightness', max: 100, unit: '%' }
                    ].map(({ key, label, max, unit }) => (
                        <div key={key} className="flex items-center gap-4">
                            <span className="w-20 text-sm text-[var(--text-muted)]">{label}</span>
                            <input
                                type="range"
                                min="0"
                                max={max}
                                value={hsl[key]}
                                onChange={(e) => handleHslChange(key, e.target.value)}
                                className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="w-16 text-sm font-mono text-[var(--text-primary)] text-right">
                                {hsl[key]}{unit}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Formats */}
            <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">All Formats</h3>
                <div className="space-y-2">
                    {colorFormats.map((format) => (
                        <div
                            key={format.label}
                            className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl"
                        >
                            <span className="text-sm text-[var(--text-muted)]">{format.label}</span>
                            <div className="flex items-center gap-2">
                                <code className="font-mono text-sm text-[var(--text-primary)]">
                                    {format.value}
                                </code>
                                <button
                                    onClick={() => copyValue(format.value, format.label)}
                                    className="p-1 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                                >
                                    <Copy size={16} className="text-[var(--text-muted)]" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
