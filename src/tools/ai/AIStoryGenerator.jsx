import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Copy, Check, RefreshCw, Sparkles, Shuffle } from 'lucide-react';

const AIStoryGenerator = () => {
    const [genre, setGenre] = useState('fantasy');
    const [setting, setSetting] = useState('');
    const [character, setCharacter] = useState('');
    const [story, setStory] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const genres = [
        { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
        { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
        { id: 'romance', name: 'Romance', icon: '💕' },
        { id: 'mystery', name: 'Mystery', icon: '🔍' },
        { id: 'horror', name: 'Horror', icon: '👻' },
        { id: 'adventure', name: 'Adventure', icon: '⚔️' }
    ];

    const storyTemplates = {
        fantasy: [
            `In a realm where magic flowed like rivers through the ancient forests, [CHARACTER] stood at the edge of [SETTING]. The prophecy had spoken of this moment for a thousand years.\n\n"The time has come," whispered the wind, carrying secrets from the Elder Trees. [CHARACTER] clutched the enchanted amulet, feeling its warmth pulse against their chest.\n\nBeyond the mist, the Dragon's Keep awaited. No one had returned from its depths in centuries, but tonight would be different. Tonight, [CHARACTER] would either fulfill the prophecy or become another forgotten legend.\n\nWith a deep breath and unwavering determination, the journey into destiny began...`,

            `The kingdom of [SETTING] had been cursed for a hundred years. Darkness crept across the land, and hope was but a fading memory. That is, until [CHARACTER] discovered the ancient spellbook hidden beneath the old oak tree.\n\n"These words hold the power to change everything," [CHARACTER] realized, tracing the glowing runes with trembling fingers.\n\nBut with great power came even greater danger. The Shadow Lord was watching, and he would not let his curse be broken without a fight...`
        ],
        scifi: [
            `The year was 2347, and humanity had spread across the stars. [CHARACTER] piloted their vessel through the asteroid field surrounding [SETTING], the ship's AI humming with calculations.\n\n"Warning: Unknown signal detected," the computer announced. "Origin: Planet X-7942."\n\n[CHARACTER] had heard the legends. An abandoned civilization, technology beyond comprehension, and something... watching. Against protocol, they set a course for the signal.\n\nWhat they would discover would change the fate of the human race forever...`,

            `The space station orbiting [SETTING] was humanity's last hope. [CHARACTER], the station's chief engineer, stared at the readouts with growing alarm.\n\n"The reactor's failing," they muttered. "If we don't fix this in the next six hours..."\n\nBut the problem wasn't mechanical. Something had gotten aboard. Something from the void between stars...`
        ],
        romance: [
            `[CHARACTER] never believed in love at first sight, not until that rainy evening in [SETTING]. The stranger had appeared from nowhere, seeking shelter under the same awning, their eyes meeting in a moment that would change everything.\n\n"Beautiful weather we're having," the stranger laughed, raindrops dancing on the pavement.\n\nSomething shifted in [CHARACTER]'s heart that day. Something they couldn't explain but couldn't deny. In a world of chaos and uncertainty, they had found an unexpected anchor...\n\nBut love, as [CHARACTER] would soon discover, was never simple...`,

            `The letters had been arriving for months, each one more passionate than the last. [CHARACTER] had never responded, believing them to be a mistake. But standing in [SETTING] on this moonlit night, they finally understood.\n\nThe mysterious author was here, waiting...`
        ],
        mystery: [
            `The body was found at dawn in [SETTING], and [CHARACTER] was called in immediately. This was no ordinary crime scene. The victim was smiling, eyes open, with a single red rose clutched in their hands.\n\n"What do you make of this?" the officer asked.\n\n[CHARACTER] knelt beside the body, observing details others had missed. A faded ticket stub in the pocket. A mark on the wrist. And something that didn't belong: a key to a place that hadn't existed for fifty years.\n\nThe hunt for truth had begun...`,

            `Everyone in [SETTING] had secrets. [CHARACTER] knew this better than anyone. But when the mayor's daughter disappeared, leaving behind only a cryptic message, the town's carefully hidden sins began to surface...`
        ],
        horror: [
            `The old house at [SETTING] had been empty for decades. At least, that's what the locals believed. When [CHARACTER] inherited the property, everyone warned them to stay away.\n\n"Some doors," the old woman had said, "are meant to stay closed."\n\nBut [CHARACTER] didn't listen. The first night, they heard the whispers. By the second night, they saw the shadows moving. And by the third night, they realized the terrible truth: they were not alone, and there was no way out...\n\nThe house had been waiting for them...`,

            `It started with the dreams. [CHARACTER] would see [SETTING], always the same place, always the same figure standing in the darkness. When they finally visited in waking hours, they found a message written in the dust: "We've been waiting for you to remember..."...`
        ],
        adventure: [
            `The map was ancient, its edges crumbling, but to [CHARACTER], it was priceless. It showed the way to [SETTING], the legendary lost city filled with treasures beyond imagination.\n\n"If the legends are true," [CHARACTER] said to their crew, "we'll be richer than kings."\n\nThe journey would take them through treacherous jungles, across raging rivers, and past dangers that had claimed countless adventurers before. But [CHARACTER] was different. They had a secret, one that gave them an edge no one else possessed...\n\nThe adventure of a lifetime awaited...`,

            `The storm had driven [CHARACTER]'s ship off course, and now they found themselves staring at an island that existed on no chart. [SETTING] rose from the mist like a forgotten dream, ancient ruins visible on its shores.\n\nSomewhere on that island lay answers to questions humanity had asked for millennia...`
        ]
    };

    const generateStory = () => {
        setGenerating(true);

        setTimeout(() => {
            const templates = storyTemplates[genre];
            const template = templates[Math.floor(Math.random() * templates.length)];

            const characterName = character.trim() || 'Alex';
            const settingPlace = setting.trim() || 'the ancient valley';

            const generatedStory = template
                .replace(/\[CHARACTER\]/g, characterName)
                .replace(/\[SETTING\]/g, settingPlace);

            setStory(generatedStory);
            setGenerating(false);
        }, 1000);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(story);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Story Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create unique story starters instantly</p>
            </div>

            <div className="space-y-4">
                {/* Genre Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Choose Genre</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {genres.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setGenre(g.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${genre === g.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                <span className="text-2xl block mb-1">{g.icon}</span>
                                <span className="text-xs">{g.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Character Name */}
                <div>
                    <label className="block text-sm font-medium mb-2">Main Character Name (Optional)</label>
                    <input
                        type="text"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
                        placeholder="e.g., Luna, Marcus, Aria..."
                        className="input w-full"
                    />
                </div>

                {/* Setting */}
                <div>
                    <label className="block text-sm font-medium mb-2">Setting/Location (Optional)</label>
                    <input
                        type="text"
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        placeholder="e.g., the enchanted forest, Mars colony, Victorian London..."
                        className="input w-full"
                    />
                </div>

                {/* Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateStory}
                    disabled={generating}
                    className="btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                    {generating ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Creating Story...
                        </>
                    ) : (
                        <>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Generate Story
                        </>
                    )}
                </motion.button>

                {/* Generated Story */}
                {story && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                Your Story Starter
                            </label>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={generateStory}
                                    className="p-2 rounded-lg bg-[var(--bg-tertiary)]"
                                    title="Generate new"
                                >
                                    <Shuffle className="w-4 h-4 text-[var(--text-muted)]" />
                                </motion.button>
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
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-pink-500/20">
                            <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                {story}
                            </p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            💡 Tip: Use this as a starting point and continue the story!
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIStoryGenerator;
