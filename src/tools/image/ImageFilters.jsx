import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ImageFilters = () => {
    const [image, setImage] = useState(null);
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        hueRotate: 0,
        invert: 0
    });
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const { toast } = useToast();

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImage({
                name: file.name,
                src: e.target.result
            });
            resetFilters();
        };
        reader.readAsDataURL(file);
        toast.success('Image loaded');
    };

    const resetFilters = () => {
        setFilters({
            brightness: 100,
            contrast: 100,
            saturate: 100,
            grayscale: 0,
            sepia: 0,
            blur: 0,
            hueRotate: 0,
            invert: 0
        });
    };

    const getFilterString = () => {
        return `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturate}%)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      blur(${filters.blur}px)
      hue-rotate(${filters.hueRotate}deg)
      invert(${filters.invert}%)
    `.trim();
    };

    const downloadImage = () => {
        if (!image) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.filter = getFilterString();
            ctx.drawImage(img, 0, 0);

            const link = document.createElement('a');
            link.download = `filtered_${image.name}`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Image downloaded!');
        };
        img.src = image.src;
    };

    const presets = [
        { name: 'Normal', filters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0, invert: 0 } },
        { name: 'Vintage', filters: { brightness: 110, contrast: 90, saturate: 80, grayscale: 0, sepia: 40, blur: 0, hueRotate: 0, invert: 0 } },
        { name: 'B&W', filters: { brightness: 100, contrast: 120, saturate: 0, grayscale: 100, sepia: 0, blur: 0, hueRotate: 0, invert: 0 } },
        { name: 'Warm', filters: { brightness: 105, contrast: 100, saturate: 120, grayscale: 0, sepia: 20, blur: 0, hueRotate: -10, invert: 0 } },
        { name: 'Cool', filters: { brightness: 100, contrast: 100, saturate: 90, grayscale: 0, sepia: 0, blur: 0, hueRotate: 180, invert: 0 } },
        { name: 'Pop', filters: { brightness: 110, contrast: 130, saturate: 140, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0, invert: 0 } },
        { name: 'Dreamy', filters: { brightness: 105, contrast: 90, saturate: 110, grayscale: 0, sepia: 10, blur: 1, hueRotate: 0, invert: 0 } },
        { name: 'Negative', filters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0, invert: 100 } },
    ];

    const filterControls = [
        { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
        { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
        { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
        { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
        { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
        { key: 'blur', label: 'Blur', min: 0, max: 10, unit: 'px', step: 0.5 },
        { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: '°' },
        { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
    ];

    const reset = () => {
        setImage(null);
        resetFilters();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            {/* Hidden canvas for export */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Upload Area */}
            {!image && (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[var(--border-color)] rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all">
                    <Upload size={48} className="text-[var(--text-muted)] mb-4" />
                    <p className="text-lg font-medium text-[var(--text-secondary)]">
                        Drop an image here or click to upload
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                        Supports JPEG, PNG, WebP, GIF
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </label>
            )}

            {image && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Preview */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium">Preview</h3>
                            <div className="flex gap-2">
                                <button onClick={downloadImage} className="btn-primary !py-2 !px-3 text-sm">
                                    <Download size={16} />
                                    Download
                                </button>
                                <button onClick={reset} className="btn-secondary !py-2 !px-3 text-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                            <img
                                src={image.src}
                                alt="Preview"
                                className="max-w-full max-h-[400px] rounded-lg object-contain"
                                style={{ filter: getFilterString() }}
                            />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                        {/* Presets */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Presets
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {presets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        onClick={() => setFilters(preset.filters)}
                                        className="px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm"
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Sliders */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">
                                    Adjustments
                                </label>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1"
                                >
                                    <RotateCcw size={14} />
                                    Reset
                                </button>
                            </div>

                            {filterControls.map((control) => (
                                <div key={control.key} className="flex items-center gap-3">
                                    <span className="w-24 text-sm text-[var(--text-muted)]">{control.label}</span>
                                    <input
                                        type="range"
                                        min={control.min}
                                        max={control.max}
                                        step={control.step || 1}
                                        value={filters[control.key]}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            [control.key]: parseFloat(e.target.value)
                                        })}
                                        className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <span className="w-16 text-sm text-[var(--text-primary)] text-right font-mono">
                                        {filters[control.key]}{control.unit}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CSS Output */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                CSS Filter
                            </label>
                            <code className="block p-3 bg-[var(--bg-tertiary)] rounded-xl text-xs font-mono text-[var(--text-muted)] break-all">
                                filter: {getFilterString()};
                            </code>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageFilters;
