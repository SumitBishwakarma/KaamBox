import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ImageCompressor = () => {
    const [originalFile, setOriginalFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [compressedPreview, setCompressedPreview] = useState(null);
    const [quality, setQuality] = useState(0.8);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [isCompressing, setIsCompressing] = useState(false);
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setOriginalFile(file);
        setOriginalPreview(URL.createObjectURL(file));
        setCompressedFile(null);
        setCompressedPreview(null);
        toast.success('Image loaded successfully');
    };

    const compressImage = async () => {
        if (!originalFile) {
            toast.warning('Please select an image first');
            return;
        }

        setIsCompressing(true);

        try {
            const options = {
                maxSizeMB: 10,
                maxWidthOrHeight: maxWidth,
                useWebWorker: true,
                initialQuality: quality,
            };

            const compressed = await imageCompression(originalFile, options);
            setCompressedFile(compressed);
            setCompressedPreview(URL.createObjectURL(compressed));

            const reduction = ((1 - compressed.size / originalFile.size) * 100).toFixed(1);
            toast.success(`Compressed! Reduced by ${reduction}%`);
        } catch (error) {
            console.error('Compression error:', error);
            toast.error('Failed to compress image');
        } finally {
            setIsCompressing(false);
        }
    };

    const downloadCompressed = () => {
        if (!compressedFile) return;

        const url = URL.createObjectURL(compressedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${originalFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Image downloaded!');
    };

    const reset = () => {
        setOriginalFile(null);
        setOriginalPreview(null);
        setCompressedFile(null);
        setCompressedPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            {!originalFile && (
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

            {/* Settings */}
            {originalFile && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Quality: {Math.round(quality * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                            <span>Smaller Size</span>
                            <span>Better Quality</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Max Width: {maxWidth}px
                        </label>
                        <input
                            type="range"
                            min="320"
                            max="3840"
                            step="160"
                            value={maxWidth}
                            onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                            className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                            <span>320px</span>
                            <span>3840px</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {originalFile && (
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={compressImage}
                        disabled={isCompressing}
                        className="btn-primary flex-1 sm:flex-none"
                    >
                        {isCompressing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Compressing...
                            </>
                        ) : (
                            <>
                                <ImageIcon size={20} />
                                Compress Image
                            </>
                        )}
                    </button>

                    {compressedFile && (
                        <button onClick={downloadCompressed} className="btn-secondary flex-1 sm:flex-none">
                            <Download size={20} />
                            Download
                        </button>
                    )}

                    <button onClick={reset} className="btn-secondary flex-1 sm:flex-none">
                        <Trash2 size={20} />
                        Reset
                    </button>
                </div>
            )}

            {/* Preview */}
            {originalFile && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Original */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Original</h3>
                            <span className="text-sm text-[var(--text-muted)]">
                                {formatSize(originalFile.size)}
                            </span>
                        </div>
                        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                            <img
                                src={originalPreview}
                                alt="Original"
                                className="max-w-full max-h-[300px] rounded-lg object-contain"
                            />
                        </div>
                    </div>

                    {/* Compressed */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">Compressed</h3>
                            {compressedFile && (
                                <span className="text-sm text-green-500">
                                    {formatSize(compressedFile.size)}
                                    ({((1 - compressedFile.size / originalFile.size) * 100).toFixed(1)}% smaller)
                                </span>
                            )}
                        </div>
                        <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 flex items-center justify-center min-h-[200px]">
                            {compressedPreview ? (
                                <img
                                    src={compressedPreview}
                                    alt="Compressed"
                                    className="max-w-full max-h-[300px] rounded-lg object-contain"
                                />
                            ) : (
                                <p className="text-[var(--text-muted)]">
                                    {isCompressing ? 'Compressing...' : 'Click "Compress Image" to see result'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCompressor;
