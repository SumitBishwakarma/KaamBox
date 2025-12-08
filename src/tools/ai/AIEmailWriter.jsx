import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, Sparkles, RefreshCw, Send } from 'lucide-react';

const AIEmailWriter = () => {
    const [purpose, setPurpose] = useState('');
    const [recipient, setRecipient] = useState('colleague');
    const [tone, setTone] = useState('professional');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

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

    const emailTemplates = {
        professional: {
            colleague: {
                opening: "Hi [Name],\n\nI hope this email finds you well.",
                closing: "Please let me know if you have any questions or need further clarification.\n\nBest regards,"
            },
            boss: {
                opening: "Dear [Name],\n\nI wanted to bring to your attention",
                closing: "I would appreciate your guidance on this matter.\n\nBest regards,"
            },
            client: {
                opening: "Dear [Client Name],\n\nThank you for reaching out to us.",
                closing: "We value your business and look forward to serving you.\n\nWarm regards,"
            },
            team: {
                opening: "Hi Team,\n\nI wanted to share an update regarding",
                closing: "Looking forward to our continued collaboration.\n\nBest,"
            },
            support: {
                opening: "Hello,\n\nI am writing to inquire about",
                closing: "Thank you for your assistance.\n\nRegards,"
            }
        },
        friendly: {
            colleague: {
                opening: "Hey [Name]! 👋\n\nHope you're having a great day!",
                closing: "Let me know what you think!\n\nCheers,"
            },
            boss: {
                opening: "Hi [Name],\n\nHope your week is going well!",
                closing: "Would love to hear your thoughts when you get a chance!\n\nBest,"
            },
            client: {
                opening: "Hi [Name]!\n\nGreat to connect with you!",
                closing: "Looking forward to hearing from you!\n\nBest wishes,"
            },
            team: {
                opening: "Hey everyone! 🎉\n\nQuick update for you all:",
                closing: "Can't wait to see what we accomplish together!\n\nCheers,"
            },
            support: {
                opening: "Hi there!\n\nI was hoping you could help me with something:",
                closing: "Really appreciate any help you can provide!\n\nThanks so much,"
            }
        },
        formal: {
            colleague: {
                opening: "Dear [Name],\n\nI am writing to formally address",
                closing: "Your prompt attention to this matter would be greatly appreciated.\n\nRespectfully,"
            },
            boss: {
                opening: "Dear Sir/Madam,\n\nI am writing to formally submit",
                closing: "I remain at your disposal for any further information you may require.\n\nYours sincerely,"
            },
            client: {
                opening: "Dear Valued Client,\n\nWe are pleased to inform you",
                closing: "We appreciate your continued trust in our services.\n\nYours faithfully,"
            },
            team: {
                opening: "Dear Team Members,\n\nPlease be informed that",
                closing: "Your cooperation in this matter is expected.\n\nRegards,"
            },
            support: {
                opening: "To Whom It May Concern,\n\nI am writing to formally request",
                closing: "I trust this matter will be handled with appropriate priority.\n\nYours sincerely,"
            }
        },
        urgent: {
            colleague: {
                opening: "Hi [Name],\n\n⚠️ URGENT: I need your immediate attention on",
                closing: "Please get back to me ASAP.\n\nThanks,"
            },
            boss: {
                opening: "Dear [Name],\n\n🚨 This requires your immediate attention:",
                closing: "I await your urgent response.\n\nRegards,"
            },
            client: {
                opening: "Dear [Client],\n\n⚡ Important Update Requiring Immediate Action:",
                closing: "Please respond at your earliest convenience.\n\nUrgently,"
            },
            team: {
                opening: "Team,\n\n🔴 URGENT ACTION REQUIRED:",
                closing: "Please prioritize this immediately.\n\nThanks,"
            },
            support: {
                opening: "URGENT SUPPORT REQUEST\n\nI am experiencing a critical issue:",
                closing: "This is impacting our operations and requires immediate resolution.\n\nUrgently,"
            }
        },
        apologetic: {
            colleague: {
                opening: "Hi [Name],\n\nI wanted to sincerely apologize for",
                closing: "I truly appreciate your understanding and patience.\n\nSorry again,"
            },
            boss: {
                opening: "Dear [Name],\n\nI am writing to express my sincere apologies for",
                closing: "I take full responsibility and will ensure this doesn't happen again.\n\nWith sincere apologies,"
            },
            client: {
                opening: "Dear [Client],\n\nPlease accept our sincere apologies for",
                closing: "We are committed to making this right and regaining your trust.\n\nWith deepest apologies,"
            },
            team: {
                opening: "Hi Team,\n\nI owe everyone an apology for",
                closing: "I appreciate your patience and understanding.\n\nSorry and thanks,"
            },
            support: {
                opening: "Hello,\n\nI apologize for any inconvenience caused, but",
                closing: "Thank you for your understanding.\n\nApologies for any trouble,"
            }
        }
    };

    const generateEmail = () => {
        if (!purpose.trim()) return;

        setGenerating(true);

        setTimeout(() => {
            const template = emailTemplates[tone][recipient];
            const subject = `${tone === 'urgent' ? '🚨 URGENT: ' : ''}${purpose.charAt(0).toUpperCase() + purpose.slice(1)}`;

            const body = `${template.opening}\n\n${purpose}\n\n${template.closing}\n[Your Name]`;

            setGeneratedEmail(`Subject: ${subject}\n\n${body}`);
            setGenerating(false);
        }, 600);
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
                <p className="text-[var(--text-muted)] text-sm">Generate professional emails instantly</p>
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
                            Writing...
                        </>
                    ) : (
                        <>
                            <Mail className="w-4 h-4 mr-2" />
                            Generate Email
                        </>
                    )}
                </motion.button>

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
                                Generated Email
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
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIEmailWriter;
