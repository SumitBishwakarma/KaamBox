import { useState } from 'react';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const UUIDGenerator = () => {
    const [uuids, setUuids] = useState([]);
    const [count, setCount] = useState(5);
    const [format, setFormat] = useState('standard'); // standard, uppercase, no-dashes
    const { toast } = useToast();

    // Generate UUID v4
    const generateUUID = () => {
        // Use crypto.getRandomValues for better randomness
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);

        // Set version (4) and variant (RFC 4122)
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        // Convert to hex string
        const hex = Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        // Format as UUID
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    };

    const formatUUID = (uuid) => {
        switch (format) {
            case 'uppercase':
                return uuid.toUpperCase();
            case 'no-dashes':
                return uuid.replace(/-/g, '');
            case 'braces':
                return `{${uuid}}`;
            default:
                return uuid;
        }
    };

    const generate = () => {
        const newUuids = Array.from({ length: count }, () => formatUUID(generateUUID()));
        setUuids(newUuids);
        toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''}`);
    };

    const copyOne = (uuid) => {
        navigator.clipboard.writeText(uuid);
        toast.success('UUID copied');
    };

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
        toast.success('All UUIDs copied');
    };

    const clear = () => {
        setUuids([]);
    };

    return (
        <div className="space-y-6">
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Count */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Number of UUIDs
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                        className="input-field"
                    />
                </div>

                {/* Format */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Format
                    </label>
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="input-field"
                    >
                        <option value="standard">Standard (lowercase)</option>
                        <option value="uppercase">Uppercase</option>
                        <option value="no-dashes">No Dashes</option>
                        <option value="braces">With Braces {'{}'}</option>
                    </select>
                </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-3">
                <button onClick={generate} className="btn-primary flex-1">
                    <RefreshCw size={20} />
                    Generate UUIDs
                </button>
                {uuids.length > 0 && (
                    <>
                        <button onClick={copyAll} className="btn-secondary">
                            <Copy size={20} />
                            Copy All
                        </button>
                        <button onClick={clear} className="btn-secondary">
                            <Trash2 size={20} />
                        </button>
                    </>
                )}
            </div>

            {/* Generated UUIDs */}
            {uuids.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Generated UUIDs ({uuids.length})
                        </label>
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-auto">
                        {uuids.map((uuid, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl group"
                            >
                                <code className="font-mono text-sm text-[var(--text-primary)] select-all">
                                    {uuid}
                                </code>
                                <button
                                    onClick={() => copyOne(uuid)}
                                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-secondary)] transition-all"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Generate (Single UUID) */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-400 mb-3">
                    <strong>Quick Generate:</strong> Click below for an instant UUID
                </p>
                <button
                    onClick={() => {
                        const uuid = formatUUID(generateUUID());
                        navigator.clipboard.writeText(uuid);
                        toast.success(`Copied: ${uuid.substring(0, 13)}...`);
                    }}
                    className="w-full py-3 px-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl font-mono text-sm text-blue-300 transition-colors"
                >
                    Click to generate and copy single UUID
                </button>
            </div>

            {/* Info */}
            <div className="text-sm text-[var(--text-muted)] space-y-2">
                <p><strong>UUID v4</strong> (Random): Uses cryptographically strong random values.</p>
                <p>Format: <code className="bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code></p>
            </div>
        </div>
    );
};

export default UUIDGenerator;
