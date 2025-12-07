import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileImage, Upload, Download, Trash2, Layers } from 'lucide-react';

const ImageCropper = () => {
    const [image, setImage] = useState(null);
    const [aspectRatio, setAspectRatio] = useState('free');
    const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
    const canvasRef = useRef(null);
    const imageRef = useRef(null);

    const aspectRatios = [
        { id: 'free', name: 'Free', ratio: null },
        { id: '1:1', name: 'Square (1:1)', ratio: 1 },
        { id: '4:3', name: 'Photo (4:3)', ratio: 4 / 3 },
        { id: '16:9', name: 'Video (16:9)', ratio: 16 / 9 },
        { id: '9:16', name: 'Story (9:16)', ratio: 9 / 16 },
        { id: '3:2', name: 'Classic (3:2)', ratio: 3 / 2 }
    ];

    const presetCrops = [
        { name: 'Profile (400×400)', width: 400, height: 400 },
        { name: 'Cover (1200×628)', width: 1200, height: 628 },
        { name: 'Thumbnail (320×180)', width: 320, height: 180 },
        { name: 'Instagram (1080×1080)', width: 1080, height: 1080 }
    ];

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                imageRef.current = img;
                setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
            };
            img.src = event.target.result;
            setImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const applyCrop = () => {
        if (!imageRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.drawImage(
            img,
            cropArea.x, cropArea.y, cropArea.width, cropArea.height,
            0, 0, cropArea.width, cropArea.height
        );

        return canvas.toDataURL('image/png');
    };

    const downloadCropped = () => {
        const dataUrl = applyCrop();
        if (dataUrl) {
            const link = document.createElement('a');
            link.download = `cropped_${cropArea.width}x${cropArea.height}.png`;
            link.href = dataUrl;
            link.click();
        }
    };

    const applyAspectRatio = (ratioId) => {
        setAspectRatio(ratioId);
        if (!imageRef.current) return;

        const img = imageRef.current;
        const ratio = aspectRatios.find(r => r.id === ratioId)?.ratio;

        if (!ratio) {
            setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
            return;
        }

        let newWidth, newHeight;
        if (img.width / img.height > ratio) {
            newHeight = img.height;
            newWidth = newHeight * ratio;
        } else {
            newWidth = img.width;
            newHeight = newWidth / ratio;
        }

        setCropArea({
            x: (img.width - newWidth) / 2,
            y: (img.height - newHeight) / 2,
            width: newWidth,
            height: newHeight
        });
    };

    const applyPreset = (preset) => {
        setCropArea({ x: 0, y: 0, width: preset.width, height: preset.height });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Image Cropper</h2>
                <p className="text-[var(--text-muted)] text-sm">Crop images to any size or aspect ratio</p>
            </div>

            <div className="space-y-4">
                <canvas ref={canvasRef} className="hidden" />

                {!image ? (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[var(--bg-tertiary)] rounded-xl cursor-pointer hover:border-[var(--accent-primary)] transition-colors">
                        <Upload className="w-12 h-12 mb-3 text-[var(--text-muted)]" />
                        <span className="text-sm text-[var(--text-muted)]">Click or drag to upload image</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                ) : (
                    <>
                        <div className="relative">
                            <img
                                src={image}
                                alt="Preview"
                                className="w-full max-h-64 object-contain rounded-xl bg-[var(--bg-tertiary)]"
                            />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setImage(null); imageRef.current = null; }}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
                            <div className="flex flex-wrap gap-2">
                                {aspectRatios.map(ar => (
                                    <button
                                        key={ar.id}
                                        onClick={() => applyAspectRatio(ar.id)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${aspectRatio === ar.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                            }`}
                                    >
                                        {ar.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Preset Sizes</label>
                            <div className="flex flex-wrap gap-2">
                                {presetCrops.map(p => (
                                    <button
                                        key={p.name}
                                        onClick={() => applyPreset(p)}
                                        className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)]"
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Width (px)</label>
                                <input
                                    type="number"
                                    value={Math.round(cropArea.width)}
                                    onChange={(e) => setCropArea({ ...cropArea, width: parseInt(e.target.value) || 0 })}
                                    className="input w-full text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Height (px)</label>
                                <input
                                    type="number"
                                    value={Math.round(cropArea.height)}
                                    onChange={(e) => setCropArea({ ...cropArea, height: parseInt(e.target.value) || 0 })}
                                    className="input w-full text-center"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={downloadCropped}
                            className="btn-primary w-full"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Cropped ({Math.round(cropArea.width)}×{Math.round(cropArea.height)})
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageCropper;
