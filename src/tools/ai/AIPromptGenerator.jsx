import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, Check, Wand2 } from 'lucide-react';

const AIPromptGenerator = () => {
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('chatgpt');
    const [style, setStyle] = useState('detailed');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

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

    const promptTemplates = {
        chatgpt: {
            detailed: `Act as an expert in [TOPIC]. I need you to provide a comprehensive, well-structured response about [TOPIC]. Include:\n\n1. A clear introduction explaining the concept\n2. Key points and details\n3. Practical examples or use cases\n4. Potential challenges or considerations\n5. A conclusion with actionable insights\n\nPlease use bullet points, numbered lists, and clear headings to organize the information. Be thorough but concise.`,
            creative: `I want you to think outside the box about [TOPIC]. Be creative, imaginative, and don't hold back on innovative ideas. Surprise me with unique perspectives and unconventional approaches to [TOPIC]. Feel free to use metaphors, analogies, and storytelling.`,
            professional: `As a professional consultant, provide a formal analysis of [TOPIC]. Include industry best practices, data-driven insights, and strategic recommendations. Maintain a professional tone suitable for a business presentation.`,
            casual: `Hey! Can you explain [TOPIC] to me like I'm talking to a friend? Keep it simple, fun, and easy to understand. Use everyday examples and avoid jargon.`,
            technical: `Provide a technical deep-dive into [TOPIC]. Include code examples if applicable, system architecture considerations, implementation details, and technical specifications. Assume I have an advanced technical background.`
        },
        midjourney: {
            detailed: `[TOPIC], highly detailed, ultra-realistic, 8k resolution, professional photography, volumetric lighting, depth of field, sharp focus, intricate details, octane render, cinematic composition --ar 16:9 --v 5.2`,
            creative: `[TOPIC], surreal art style, dreamlike atmosphere, vibrant colors, abstract elements, fantasy inspired, magical lighting, ethereal mood, imaginative composition, artistic interpretation --ar 1:1 --v 5.2 --stylize 750`,
            professional: `[TOPIC], corporate style, clean design, minimalist aesthetic, professional lighting, studio photography, white background, commercial quality, brand-ready image --ar 3:2 --v 5.2`,
            casual: `[TOPIC], candid shot, natural lighting, lifestyle photography, warm tones, authentic feel, everyday setting, relatable aesthetic --ar 4:5 --v 5.2`,
            technical: `[TOPIC], technical illustration, blueprint style, engineering diagram, exploded view, precise details, technical accuracy, clean lines, informative design --ar 16:9 --v 5.2`
        },
        dalle: {
            detailed: `Create a highly detailed image of [TOPIC]. The image should have photorealistic quality with perfect lighting, sharp details, and professional composition. Include subtle textures and realistic shadows.`,
            creative: `Generate an artistic and creative interpretation of [TOPIC]. Use bold colors, unique perspectives, and imaginative elements. The style should be surreal and thought-provoking.`,
            professional: `Design a professional, clean image of [TOPIC] suitable for business use. Use neutral colors, balanced composition, and a polished, corporate aesthetic.`,
            casual: `Create a friendly, approachable image of [TOPIC]. Use warm colors, natural lighting, and a relaxed atmosphere that feels inviting and authentic.`,
            technical: `Generate a technical diagram or illustration of [TOPIC]. Include labeled parts, clean lines, and an educational layout that explains the concept clearly.`
        },
        stable: {
            detailed: `masterpiece, best quality, [TOPIC], ultra detailed, highly detailed, sharp focus, professional photography, 8k uhd, intricate details, perfect composition, beautiful lighting`,
            creative: `[TOPIC], artistic, surreal, vibrant colors, fantasy art, magical atmosphere, dreamscape, ethereal lighting, imaginative, unique style, trending on artstation`,
            professional: `[TOPIC], professional photo, studio lighting, commercial photography, clean background, corporate style, high resolution, brand quality`,
            casual: `[TOPIC], casual style, natural lighting, lifestyle photo, warm colors, authentic, friendly atmosphere, everyday scene`,
            technical: `[TOPIC], technical drawing, blueprint, schematic, detailed diagram, engineering style, precise, informative, educational illustration`
        },
        claude: {
            detailed: `I'd like you to provide an in-depth analysis of [TOPIC]. Please structure your response with:\n\n• Executive Summary\n• Detailed Explanation\n• Key Considerations\n• Practical Applications\n• Nuanced Perspectives\n• Potential Limitations\n\nBe thorough, balanced, and cite relevant concepts where applicable.`,
            creative: `Let's explore [TOPIC] from creative angles. I'd love to hear unconventional perspectives, thought experiments, and imaginative scenarios related to this topic. Feel free to be playful with ideas while maintaining substance.`,
            professional: `Please provide a professional analysis of [TOPIC] as if preparing for a board presentation. Include strategic insights, risk considerations, and actionable recommendations with a formal tone.`,
            casual: `Can we have a relaxed conversation about [TOPIC]? Explain it like you're chatting with a curious friend - keep it accessible, engaging, and fun while still being informative.`,
            technical: `I need a technical deep-dive into [TOPIC]. Please include implementation details, edge cases, performance considerations, and best practices. Assume expertise-level technical background.`
        }
    };

    const generatePrompt = () => {
        if (!topic.trim()) return;

        setGenerating(true);

        setTimeout(() => {
            const template = promptTemplates[platform][style];
            const prompt = template.replace(/\[TOPIC\]/g, topic.trim());
            setGeneratedPrompt(prompt);
            setGenerating(false);
        }, 500);
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
                <p className="text-[var(--text-muted)] text-sm">Generate perfect prompts for AI tools</p>
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
                            Generating...
                        </>
                    ) : (
                        <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Generate Prompt
                        </>
                    )}
                </motion.button>

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
                                Generated Prompt
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
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIPromptGenerator;
