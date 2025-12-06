import { useState, useRef } from 'react';
import { Upload, Copy, Download, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ImageToBase64 = () => {
    const [image, setImage] = useState(null);
    const [base64, setBase64] = useState('');
    const [dataUri, setDataUri] = useState('');
    const [outputType, setOutputType] = useState('datauri');
    const fileInputRef = useRef(null);
    const { toast } = useToast();

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setImage({
            name: file.name,
            type: file.type,
            size: file.size,
            preview: URL.createObjectURL(file)
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            setDataUri(result);
            // Extract just the base64 part (remove data:image/...;base64,)
            setBase64(result.split(',')[1]);
        };
        reader.readAsDataURL(file);

        toast.success('Image converted to Base64');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const dt = new DataTransfer();
            dt.items.add(file);
            if (fileInputRef.current) {
                fileInputRef.current.files = dt.files;
                handleFileSelect({ target: { files: dt.files } });
            }
        }
    };

    const handleCopy = () => {
        const textToCopy = outputType === 'datauri' ? dataUri : base64;
        navigator.clipboard.writeText(textToCopy);
        toast.success('Copied to clipboard');
    };

    const handleDownload = () => {
        const textToDownload = outputType === 'datauri' ? dataUri : base64;
        const blob = new Blob([textToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${image?.name || 'image'}_base64.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Downloaded!');
    };

    const reset = () => {
        setImage(null);
        setBase64('');
        setDataUri('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const output = outputType === 'datauri' ? dataUri : base64;

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <label
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--border-color)] rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
            >
                <Upload size={40} className="text-[var(--text-muted)] mb-3" />
                <p className="text-base font-medium text-[var(--text-secondary)]">
                    Drop an image here or click to upload
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                    Supports all common image formats
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </label>

            {/* Image Preview */}
            {image && (
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-32 h-32 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-[var(--text-primary)]">{image.name}</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Type: {image.type} | Size: {formatSize(image.size)}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                            Base64 Length: {base64.length.toLocaleString()} characters
                        </p>
                    </div>
                    <button onClick={reset} className="btn-secondary !py-2 !px-3">
                        <Trash2 size={18} />
                    </button>
                </div>
            )}

            {/* Output Type Toggle */}
            {base64 && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Output Format
                    </label>
                    <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 max-w-md">
                        <button
                            onClick={() => setOutputType('datauri')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${outputType === 'datauri'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Data URI (with prefix)
                        </button>
                        <button
                            onClick={() => setOutputType('base64')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${outputType === 'base64'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Raw Base64
                        </button>
                    </div>
                </div>
            )}

            {/* Output */}
            {output && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            {outputType === 'datauri' ? 'Data URI' : 'Base64 String'}
                        </label>
                        <div className="flex gap-2">
                            <button onClick={handleCopy} className="btn-secondary !py-2 !px-3 text-sm">
                                <Copy size={16} />
                                Copy
                            </button>
                            <button onClick={handleDownload} className="btn-secondary !py-2 !px-3 text-sm">
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="textarea-field !min-h-[200px] !font-mono !text-xs"
                    />
                </div>
            )}

            {/* Usage Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="font-medium text-blue-400 mb-2">How to use:</h4>
                <ul className="text-sm text-blue-300 space-y-1">
                    <li>• <strong>Data URI:</strong> Use directly in HTML img src or CSS background-image</li>
                    <li>• <strong>Raw Base64:</strong> Use for API payloads or when you need to add your own prefix</li>
                </ul>
            </div>
        </div>
    );
};

export default ImageToBase64;
