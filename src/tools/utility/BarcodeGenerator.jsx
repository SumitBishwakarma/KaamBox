import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Barcode, Download, Copy, Check, RefreshCw } from 'lucide-react';

const BarcodeGenerator = () => {
    const [text, setText] = useState('');
    const [format, setFormat] = useState('CODE128');
    const [copied, setCopied] = useState(false);
    const canvasRef = useRef(null);

    const formats = [
        { id: 'CODE128', name: 'Code 128', desc: 'General purpose' },
        { id: 'EAN13', name: 'EAN-13', desc: 'Product barcodes', length: 13 },
        { id: 'UPC', name: 'UPC-A', desc: 'US retail', length: 12 },
        { id: 'CODE39', name: 'Code 39', desc: 'Alphanumeric' }
    ];

    // Simple barcode drawing (Code 128 pattern simulation)
    const drawBarcode = () => {
        if (!text || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Generate simple barcode pattern based on text
        const barWidth = 2;
        const height = 80;
        const startX = 20;
        const startY = 20;

        ctx.fillStyle = 'black';

        // Start pattern
        ctx.fillRect(startX, startY, barWidth, height);
        ctx.fillRect(startX + barWidth * 2, startY, barWidth, height);

        // Generate bars based on character codes
        let x = startX + barWidth * 4;
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            for (let j = 0; j < 8; j++) {
                if ((charCode >> j) & 1) {
                    ctx.fillRect(x, startY, barWidth, height);
                }
                x += barWidth;
            }
            // Separator
            x += barWidth;
        }

        // End pattern
        ctx.fillRect(x, startY, barWidth, height);
        ctx.fillRect(x + barWidth * 2, startY, barWidth, height);

        // Draw text below barcode
        ctx.fillStyle = 'black';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, startY + height + 20);
    };

    const downloadBarcode = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `barcode_${text}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    const copyToClipboard = async () => {
        if (!canvasRef.current) return;
        try {
            const blob = await new Promise(resolve => canvasRef.current.toBlob(resolve));
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Barcode Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate barcodes from text</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Barcode Format</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {formats.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFormat(f.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${format === f.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <p className="font-medium text-sm">{f.name}</p>
                                <p className="text-xs opacity-70">{f.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text or number..."
                        className="input w-full text-lg"
                        maxLength={format === 'EAN13' ? 13 : format === 'UPC' ? 12 : 50}
                    />
                    {formats.find(f => f.id === format)?.length && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            {format} requires {formats.find(f => f.id === format)?.length} digits
                        </p>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={drawBarcode}
                    disabled={!text}
                    className="btn-primary w-full"
                >
                    <Barcode className="w-4 h-4 mr-2" />
                    Generate Barcode
                </motion.button>

                <div className="p-4 bg-white rounded-xl flex justify-center">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={140}
                        className="max-w-full"
                    />
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={downloadBarcode}
                        className="btn-primary flex-1"
                        disabled={!text}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                        disabled={!text}
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default BarcodeGenerator;
