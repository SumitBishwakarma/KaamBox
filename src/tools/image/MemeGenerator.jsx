import { useState, useRef } from 'react';
import { Upload, Download, Type, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const MemeGenerator = () => {
    const [image, setImage] = useState(null);
    const [topText, setTopText] = useState('TOP TEXT');
    const [bottomText, setBottomText] = useState('BOTTOM TEXT');
    const [fontSize, setFontSize] = useState(40);
    const [textColor, setTextColor] = useState('#ffffff');
    const [strokeColor, setStrokeColor] = useState('#000000');
    const canvasRef = useRef(null);
    const { toast } = useToast();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage({ src: event.target.result, width: img.width, height: img.height });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const drawMeme = () => {
        if (!canvasRef.current || !image) return null;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            // Text style
            ctx.fillStyle = textColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = fontSize / 10;
            ctx.font = `bold ${fontSize}px Impact, sans-serif`;
            ctx.textAlign = 'center';
            ctx.lineJoin = 'round';

            // Top text
            if (topText) {
                const topY = fontSize + 20;
                ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topY);
                ctx.fillText(topText.toUpperCase(), canvas.width / 2, topY);
            }

            // Bottom text
            if (bottomText) {
                const bottomY = canvas.height - 20;
                ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
                ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
            }
        };
        img.src = image.src;
    };

    // Redraw when anything changes
    useState(() => {
        if (image) drawMeme();
    }, [image, topText, bottomText, fontSize, textColor, strokeColor]);

    const downloadMeme = () => {
        if (!canvasRef.current) return;

        // Ensure canvas is drawn
        drawMeme();

        setTimeout(() => {
            const link = document.createElement('a');
            link.download = `meme-${Date.now()}.png`;
            link.href = canvasRef.current.toDataURL('image/png');
            link.click();
            toast.success('Meme downloaded!');
        }, 100);
    };

    const clearAll = () => {
        setImage(null);
        setTopText('TOP TEXT');
        setBottomText('BOTTOM TEXT');
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
                    <div className="relative bg-[var(--bg-tertiary)] rounded-xl p-4 flex justify-center">
                        <div className="relative inline-block">
                            <img
                                src={image.src}
                                alt="Meme base"
                                className="max-w-full max-h-[400px] rounded"
                            />
                            {/* Preview overlay */}
                            <div
                                className="absolute inset-0 flex flex-col justify-between pointer-events-none"
                                style={{ fontFamily: 'Impact, sans-serif' }}
                            >
                                <p
                                    className="text-center pt-4"
                                    style={{
                                        fontSize: `${fontSize * 0.6}px`,
                                        color: textColor,
                                        textShadow: `2px 2px 0 ${strokeColor}, -2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}`
                                    }}
                                >
                                    {topText.toUpperCase()}
                                </p>
                                <p
                                    className="text-center pb-4"
                                    style={{
                                        fontSize: `${fontSize * 0.6}px`,
                                        color: textColor,
                                        textShadow: `2px 2px 0 ${strokeColor}, -2px -2px 0 ${strokeColor}, 2px -2px 0 ${strokeColor}, -2px 2px 0 ${strokeColor}`
                                    }}
                                >
                                    {bottomText.toUpperCase()}
                                </p>
                            </div>
                        </div>
                        {/* Hidden canvas for export */}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <Type size={14} className="inline mr-1" />
                                Top Text
                            </label>
                            <input
                                type="text"
                                value={topText}
                                onChange={(e) => setTopText(e.target.value)}
                                placeholder="Top text..."
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <Type size={14} className="inline mr-1" />
                                Bottom Text
                            </label>
                            <input
                                type="text"
                                value={bottomText}
                                onChange={(e) => setBottomText(e.target.value)}
                                placeholder="Bottom text..."
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Font Size: {fontSize}px
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="80"
                                value={fontSize}
                                onChange={(e) => setFontSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Text Color
                            </label>
                            <input
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                                className="w-full h-10 rounded cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Stroke Color
                            </label>
                            <input
                                type="color"
                                value={strokeColor}
                                onChange={(e) => setStrokeColor(e.target.value)}
                                className="w-full h-10 rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button onClick={downloadMeme} className="btn-primary">
                            <Download size={18} />
                            Download Meme
                        </button>
                        <label className="btn-secondary cursor-pointer">
                            <Upload size={18} />
                            Change Image
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                        <button onClick={clearAll} className="btn-secondary">
                            <Trash2 size={18} />
                            Clear
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MemeGenerator;
