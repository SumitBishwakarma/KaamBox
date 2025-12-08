import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, Sparkles, RefreshCw, Send } from 'lucide-react';
import { generateWithGemini } from '../../utils/geminiAPI';

const AIEmailWriter = () => {
    const [purpose, setPurpose] = useState('');
    const [recipient, setRecipient] = useState('colleague');
    const [tone, setTone] = useState('professional');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const recipients = [
        { id: 'colleague', name: 'Colleague', icon: '👤' },
        { id: 'boss', name: 'Boss/Manager', icon: '👔' },
        { id: 'client', name: 'Client', icon: '🤝' },
        { id: 'team', name: 'Team', icon: '👥' },
        { id: 'support', name: 'Support', icon: '💬' }
    ];

    const tones = [
        { id: 'professional', name: 'Professional' },
        { id: 'friendly', name: 'Friendly' },
        { id: 'formal', name: 'Formal' },
        { id: 'urgent', name: 'Urgent' },
        { id: 'apologetic', name: 'Apologetic' }
    ];

    const generateEmail = async () => {
        if (!purpose.trim()) return;

        setGenerating(true);
        setError('');

        const prompt = `Write a ${tone} email to my ${recipient} about: ${purpose}

Include:
- A clear subject line (format: "Subject: ...")
- Appropriate greeting
- Well-structured body
- Professional closing
- Placeholder for signature [Your Name]

Use ${tone} tone throughout. Make it concise but complete.`;

        const result = await generateWithGemini(prompt, { temperature: 0.7 });

        if (result.success) {
            setGeneratedEmail(result.text.trim());
        } else {
            setError(result.error || 'Failed to generate email. Please try again.');
        }

        setGenerating(false);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(generatedEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Email Writer</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate professional emails with AI</p>
            </div>

            <div className="space-y-4">
                {/* Purpose */}
                <div>
                    <label className="block text-sm font-medium mb-2">What's the purpose of your email?</label>
                    <textarea
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="e.g., Request for project update, Follow up on meeting, Ask for time off..."
                        className="input w-full h-24 resize-none"
                    />
                </div>

                {/* Recipient */}
                <div>
                    <label className="block text-sm font-medium mb-2">Who are you writing to?</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {recipients.map(r => (
                            <button
                                key={r.id}
                                onClick={() => setRecipient(r.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${recipient === r.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                <span className="text-xl block mb-1">{r.icon}</span>
                                <span className="text-xs">{r.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tone */}
                <div>
                    <label className="block text-sm font-medium mb-2">Email Tone</label>
                    <div className="flex flex-wrap gap-2">
                        {tones.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTone(t.id)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${tone === t.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateEmail}
                    disabled={!purpose.trim() || generating}
                    className="btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                    {generating ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            AI Writing...
                        </>
                    ) : (
                        <>
                            <Mail className="w-4 h-4 mr-2" />
                            Generate Email with AI
                        </>
                    )}
                </motion.button>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Generated Email */}
                {generatedEmail && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Send className="w-4 h-4 text-pink-500" />
                                AI Generated Email
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </motion.button>
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-pink-500/20">
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                                {generatedEmail}
                            </pre>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            Powered by Gemini AI
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIEmailWriter;
