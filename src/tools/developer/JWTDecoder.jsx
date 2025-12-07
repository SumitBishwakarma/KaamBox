import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, AlertCircle } from 'lucide-react';

const JWTDecoder = () => {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(null);

    const decodeJWT = () => {
        if (!token.trim()) {
            setDecoded(null);
            setError('');
            return;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Token must have 3 parts separated by dots.');
            }

            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            // Check expiration
            let isExpired = false;
            let expiresAt = null;
            if (payload.exp) {
                expiresAt = new Date(payload.exp * 1000);
                isExpired = expiresAt < new Date();
            }

            let issuedAt = null;
            if (payload.iat) {
                issuedAt = new Date(payload.iat * 1000);
            }

            setDecoded({
                header,
                payload,
                signature: parts[2],
                isExpired,
                expiresAt,
                issuedAt
            });
            setError('');
        } catch (e) {
            setError(e.message || 'Invalid JWT token');
            setDecoded(null);
        }
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatJSON = (obj) => JSON.stringify(obj, null, 2);

    const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">JWT Decoder</h2>
                <p className="text-[var(--text-muted)] text-sm">Decode and inspect JSON Web Tokens</p>
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">JWT Token</label>
                        <button
                            onClick={() => setToken(sampleToken)}
                            className="text-xs text-[var(--accent-primary)] hover:underline"
                        >
                            Load Sample
                        </button>
                    </div>
                    <textarea
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="Paste your JWT token here..."
                        className="input w-full h-28 resize-none font-mono text-sm"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={decodeJWT}
                    className="btn-primary w-full"
                >
                    <Key className="w-4 h-4 mr-2" />
                    Decode Token
                </motion.button>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                    </motion.div>
                )}

                {decoded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {decoded.isExpired !== null && (
                            <div className={`p-4 rounded-xl ${decoded.isExpired ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${decoded.isExpired ? 'bg-red-500' : 'bg-green-500'}`} />
                                    <span className={`font-medium ${decoded.isExpired ? 'text-red-400' : 'text-green-400'}`}>
                                        {decoded.isExpired ? 'Token Expired' : 'Token Valid'}
                                    </span>
                                </div>
                                {decoded.expiresAt && (
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        Expires: {decoded.expiresAt.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-red-400">HEADER</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard(decoded.header, 'header')}
                                    className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]"
                                >
                                    {copied === 'header' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </motion.button>
                            </div>
                            <pre className="font-mono text-sm text-red-300 overflow-x-auto">{formatJSON(decoded.header)}</pre>
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-purple-400">PAYLOAD</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard(decoded.payload, 'payload')}
                                    className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]"
                                >
                                    {copied === 'payload' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </motion.button>
                            </div>
                            <pre className="font-mono text-sm text-purple-300 overflow-x-auto">{formatJSON(decoded.payload)}</pre>

                            {decoded.issuedAt && (
                                <div className="mt-3 pt-3 border-t border-[var(--bg-secondary)]">
                                    <p className="text-xs text-[var(--text-muted)]">
                                        Issued At: {decoded.issuedAt.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-400">SIGNATURE</span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => copyToClipboard(decoded.signature, 'signature')}
                                    className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]"
                                >
                                    {copied === 'signature' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </motion.button>
                            </div>
                            <p className="font-mono text-sm text-blue-300 break-all">{decoded.signature}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-2">
                                ⚠️ Signature verification requires the secret key
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default JWTDecoder;
