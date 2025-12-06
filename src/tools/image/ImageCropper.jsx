import { useState, useRef, useCallback } from 'react';
import { Upload, Download, RotateCcw, Crop } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ImageCropper = () => {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const { toast } = useToast();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
                setCrop({ x: 50, y: 50, width: 200, height: 200 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = useCallback((e, type) => {
        e.preventDefault();
        setIsDragging(true);
        setDragType(type);
        setStartPos({ x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return;

        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        const container = containerRef.current.getBoundingClientRect();

        setCrop(prev => {
            let newCrop = { ...prev };

            if (dragType === 'move') {
                newCrop.x = Math.max(0, Math.min(container.width - prev.width, prev.x + dx));
                newCrop.y = Math.max(0, Math.min(container.height - prev.height, prev.y + dy));
            } else if (dragType === 'resize') {
                newCrop.width = Math.max(50, Math.min(container.width - prev.x, prev.width + dx));
                newCrop.height = Math.max(50, Math.min(container.height - prev.y, prev.height + dy));
            }

            return newCrop;
        });

        setStartPos({ x: e.clientX, y: e.clientY });
    }, [isDragging, dragType, startPos]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragType(null);
    }, []);

    const cropImage = () => {
        if (!imageRef.current || !containerRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;
        const container = containerRef.current.getBoundingClientRect();

        const scaleX = img.naturalWidth / container.width;
        const scaleY = img.naturalHeight / container.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        ctx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const link = document.createElement('a');
        link.download = `cropped-image-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('Cropped image downloaded');
    };

    const resetCrop = () => {
        setCrop({ x: 50, y: 50, width: 200, height: 200 });
    };

    return (
        <div className="space-y-6">
            {!image ? (
                <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--border-primary)] rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload size={48} className="text-[var(--text-muted)] mb-4" />
                    <span className="text-lg font-medium">Upload Image</span>
                    <span className="text-sm text-[var(--text-muted)]">Click or drag & drop</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </label>
            ) : (
                <>
                    <div
                        ref={containerRef}
                        className="relative bg-[var(--bg-tertiary)] rounded-xl overflow-hidden"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ userSelect: 'none' }}
                    >
                        <img
                            ref={imageRef}
                            src={image}
                            alt="To crop"
                            className="w-full h-auto max-h-[500px] object-contain"
                            draggable={false}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

                        {/* Crop Area */}
                        <div
                            className="absolute border-2 border-white cursor-move"
                            style={{
                                left: crop.x,
                                top: crop.y,
                                width: crop.width,
                                height: crop.height,
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
                            }}
                            onMouseDown={(e) => handleMouseDown(e, 'move')}
                        >
                            {/* Grid lines */}
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="border border-white/30" />
                                ))}
                            </div>

                            {/* Resize handle */}
                            <div
                                className="absolute -right-2 -bottom-2 w-4 h-4 bg-white rounded-full cursor-se-resize"
                                onMouseDown={(e) => handleMouseDown(e, 'resize')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)]">X</p>
                            <p className="font-mono">{Math.round(crop.x)}px</p>
                        </div>
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)]">Y</p>
                            <p className="font-mono">{Math.round(crop.y)}px</p>
                        </div>
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)]">Width</p>
                            <p className="font-mono">{Math.round(crop.width)}px</p>
                        </div>
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)]">Height</p>
                            <p className="font-mono">{Math.round(crop.height)}px</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={cropImage} className="btn-primary">
                            <Crop size={18} />
                            Crop & Download
                        </button>
                        <button onClick={resetCrop} className="btn-secondary">
                            <RotateCcw size={18} />
                            Reset
                        </button>
                        <label className="btn-secondary cursor-pointer">
                            <Upload size={18} />
                            New Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCropper;
