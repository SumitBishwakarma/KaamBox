import { useState } from 'react';
import { Download, Image, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Base64ToImage = () => {
    const [base64Input, setBase64Input] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageInfo, setImageInfo] = useState(null);
    const { toast } = useToast();

    const decodeImage = () => {
        if (!base64Input.trim()) {
            toast.warning('Please enter Base64 string');
            return;
        }

        try {
            let dataUrl = base64Input.trim();

            // Add data URI prefix if not present
            if (!dataUrl.startsWith('data:')) {
                // Try to detect image type from base64
                const signatures = {
                    '/9j/': 'image/jpeg',
                    'iVBORw0KGgo': 'image/png',
                    'R0lGOD': 'image/gif',
                    'UklGR': 'image/webp',
                    'PHN2Zz': 'image/svg+xml'
                };

                let mimeType = 'image/png'; // default
                for (const [sig, type] of Object.entries(signatures)) {
                    if (dataUrl.startsWith(sig)) {
                        mimeType = type;
                        break;
                    }
                }
                dataUrl = `data:${mimeType};base64,${dataUrl}`;
            }

            // Validate by creating an image
            const img = new window.Image();
            img.onload = () => {
                setImageUrl(dataUrl);
                setImageInfo({
                    width: img.width,
                    height: img.height,
                    size: Math.round(base64Input.length * 0.75 / 1024) // Approximate size in KB
                });
                toast.success('Image decoded successfully');
            };
            img.onerror = () => {
                toast.error('Invalid Base64 image data');
                setImageUrl('');
                setImageInfo(null);
            };
            img.src = dataUrl;
        } catch (err) {
            toast.error('Failed to decode image');
        }
    };

    const downloadImage = () => {
        if (!imageUrl) return;

        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `decoded-image-${Date.now()}.png`;
        link.click();
        toast.success('Image downloaded');
    };

    const clearAll = () => {
        setBase64Input('');
        setImageUrl('');
        setImageInfo(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Base64 String
                </label>
                <textarea
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    placeholder="Paste Base64 encoded image string here... (with or without data URI prefix)"
                    className="textarea-field !min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    {base64Input.length} characters
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={decodeImage} className="btn-primary">
                    <Image size={18} />
                    Decode Image
                </button>
                <button onClick={downloadImage} className="btn-secondary" disabled={!imageUrl}>
                    <Download size={18} />
                    Download
                </button>
                <button onClick={clearAll} className="btn-secondary">
                    <Trash2 size={18} />
                    Clear
                </button>
            </div>

            {imageUrl && (
                <div className="space-y-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Preview</h3>
                        <div className="flex justify-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                            <img
                                src={imageUrl}
                                alt="Decoded"
                                className="max-w-full max-h-[400px] object-contain rounded"
                            />
                        </div>
                    </div>

                    {imageInfo && (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-2xl font-bold text-blue-400">{imageInfo.width}</p>
                                <p className="text-sm text-[var(--text-muted)]">Width (px)</p>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-2xl font-bold text-purple-400">{imageInfo.height}</p>
                                <p className="text-sm text-[var(--text-muted)]">Height (px)</p>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-2xl font-bold text-green-400">~{imageInfo.size} KB</p>
                                <p className="text-sm text-[var(--text-muted)]">Size</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Base64ToImage;
