import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, Check, Wand2 } from 'lucide-react';
import { generateWithGemini } from '../../utils/geminiAPI';

const AIPromptGenerator = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('chatgpt');
    const [style, setStyle] = useState('detailed');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const platforms = [
        { id: 'chatgpt', name: 'ChatGPT', icon: '🤖' },
        { id: 'midjourney', name: 'Midjourney', icon: '🎨' },
        { id: 'dalle', name: 'DALL-E', icon: '🖼️' },
        { id: 'stable', name: 'Stable Diffusion', icon: '🌟' },
        { id: 'claude', name: 'Claude AI', icon: '🧠' }
    ];

    const styles = [
        { id: 'detailed', name: 'Detailed' },
        { id: 'creative', name: 'Creative' },
        { id: 'professional', name: 'Professional' },
        { id: 'casual', name: 'Casual' },
        { id: 'technical', name: 'Technical' }
    ];

    const generatePrompt = async () => {
        if (!topic.trim()) return;

        setGenerating(true);
        setError('');

        let aiPrompt = '';

        if (platform === 'chatgpt' || platform === 'claude') {
            aiPrompt = `Create an optimized ${style} prompt for ${platform === 'chatgpt' ? 'ChatGPT' : 'Claude AI'} about: "${topic}"

Requirements:
- Make it ${style} in nature
- Include clear instructions for the AI
- Structure it for best results
- Make it ready to copy-paste

Only provide the prompt itself, nothing else.`;
        } else {
            // Image generation prompts (Midjourney, DALL-E, Stable Diffusion)
            aiPrompt = `Create an optimized ${platform} image generation prompt for: "${topic}"

Style: ${style}
Platform-specific formatting:
- Midjourney: Include aspect ratio (--ar), version (--v 5.2), stylize if creative
- DALL-E: Natural language description, focus on visual details
- Stable Diffusion: Include quality tags like masterpiece, best quality, detailed

Make the prompt highly effective for ${platform}. Only provide the prompt itself.`;
        }

        const result = await generateWithGemini(aiPrompt, { temperature: 0.8 });

        if (result.success) {
            setGeneratedPrompt(result.text.trim());
        } else {
            setError(result.error || 'Failed to generate prompt. Please try again.');
        }

        setGenerating(false);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Prompt Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate perfect prompts for any AI tool</p>
            </div>

            <div className="space-y-4">
                {/* Topic Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Your Topic / Subject</label>
                    <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., A futuristic city, Explain quantum computing, Design a logo..."
                        className="input w-full h-24 resize-none"
                    />
                </div>

                {/* Platform Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">AI Platform</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {platforms.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPlatform(p.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${platform === p.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                <span className="text-xl block mb-1">{p.icon}</span>
                                <span className="text-xs">{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Style Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Prompt Style</label>
                    <div className="flex flex-wrap gap-2">
                        {styles.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setStyle(s.id)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${style === s.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generatePrompt}
                    disabled={!topic.trim() || generating}
                    className="btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                    {generating ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            AI Generating...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Generate Prompt with AI
                        </>
                    )}
                </motion.button>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Generated Prompt */}
                {generatedPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                AI Generated Prompt
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
                            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                                {generatedPrompt}
                            </pre>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            Powered by Gemini AI • Copy and paste into {platforms.find(p => p.id === platform)?.name}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIPromptGenerator;
