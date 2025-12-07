import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Copy, Check, RefreshCw } from 'lucide-react';

const HashtagGenerator = () => {
    const [topic, setTopic] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [copied, setCopied] = useState(false);

    const hashtagDatabase = {
        tech: ['#technology', '#tech', '#innovation', '#digital', '#coding', '#programming', '#developer', '#software', '#ai', '#machinelearning', '#webdev', '#javascript', '#python', '#startup', '#entrepreneur'],
        travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#trip', '#traveling', '#travelgram', '#instatravel', '#travelphotography', '#travelblogger', '#traveltheworld', '#roadtrip', '#backpacking', '#tourism'],
        food: ['#food', '#foodie', '#yummy', '#delicious', '#cooking', '#recipe', '#homemade', '#foodporn', '#instafood', '#foodphotography', '#healthyfood', '#foodlover', '#tasty', '#chef', '#restaurant'],
        fitness: ['#fitness', '#gym', '#workout', '#health', '#motivation', '#fit', '#training', '#exercise', '#healthy', '#bodybuilding', '#fitfam', '#lifestyle', '#muscle', '#cardio', '#yoga'],
        fashion: ['#fashion', '#style', '#ootd', '#fashionista', '#outfit', '#trendy', '#clothing', '#fashionblogger', '#streetstyle', '#instafashion', '#fashionstyle', '#lookoftheday', '#stylish', '#dress', '#accessories'],
        photography: ['#photography', '#photo', '#photooftheday', '#photographer', '#instagood', '#picoftheday', '#nature', '#portrait', '#art', '#camera', '#landscape', '#photoshoot', '#instagram', '#beautiful', '#naturephotography'],
        business: ['#business', '#entrepreneur', '#success', '#marketing', '#motivation', '#money', '#startup', '#leadership', '#digitalmarketing', '#branding', '#smallbusiness', '#goals', '#hustle', '#growth', '#ceo'],
        music: ['#music', '#musician', '#singing', '#song', '#singer', '#artist', '#guitar', '#hiphop', '#rap', '#newmusic', '#live', '#concert', '#producer', '#beats', '#soundcloud'],
        art: ['#art', '#artist', '#artwork', '#drawing', '#painting', '#illustration', '#creative', '#design', '#sketch', '#instaart', '#artistsoninstagram', '#digitalart', '#contemporaryart', '#artoftheday', '#gallery'],
        nature: ['#nature', '#naturephotography', '#landscape', '#mountains', '#sunset', '#ocean', '#wildlife', '#forest', '#sky', '#beach', '#flowers', '#outdoors', '#earth', '#sunrise', '#animals']
    };

    const generateHashtags = () => {
        if (!topic.trim()) return;

        const words = topic.toLowerCase().split(' ');
        let selectedHashtags = new Set();

        // Find matching categories
        Object.entries(hashtagDatabase).forEach(([category, tags]) => {
            words.forEach(word => {
                if (category.includes(word) || word.includes(category.substring(0, 4))) {
                    tags.forEach(tag => selectedHashtags.add(tag));
                }
            });
        });

        // Add custom hashtags based on input
        words.forEach(word => {
            if (word.length > 2) {
                selectedHashtags.add(`#${word}`);
                selectedHashtags.add(`#${word}lover`);
                selectedHashtags.add(`#${word}life`);
            }
        });

        // If no matches, add generic popular hashtags
        if (selectedHashtags.size < 10) {
            ['#instagood', '#love', '#photooftheday', '#beautiful', '#happy', '#follow', '#like4like', '#instadaily', '#followme', '#trending'].forEach(tag => selectedHashtags.add(tag));
        }

        // Convert to array and limit to 30
        setHashtags(Array.from(selectedHashtags).slice(0, 30));
    };

    const copyToClipboard = () => {
        const text = hashtags.join(' ');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const removeHashtag = (tag) => {
        setHashtags(hashtags.filter(h => h !== tag));
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Hashtag Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate trending hashtags for your social media posts</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Topic or Keywords</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., travel photography, food blogger, tech startup"
                            className="input flex-1"
                            onKeyPress={(e) => e.key === 'Enter' && generateHashtags()}
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={generateHashtags}
                            className="btn-primary px-6"
                        >
                            <Hash className="w-4 h-4 mr-2" />
                            Generate
                        </motion.button>
                    </div>
                </div>

                {hashtags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-muted)]">{hashtags.length} hashtags generated</span>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={generateHashtags}
                                    className="p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                    title="Regenerate"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={copyToClipboard}
                                    className="btn-primary px-4 py-2"
                                >
                                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy All'}
                                </motion.button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 p-4 bg-[var(--bg-tertiary)] rounded-xl min-h-[120px]">
                            {hashtags.map((tag, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    onClick={() => removeHashtag(tag)}
                                    className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm cursor-pointer hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                    title="Click to remove"
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                            <p className="text-sm text-[var(--text-muted)] break-all">
                                {hashtags.join(' ')}
                            </p>
                        </div>
                    </motion.div>
                )}

                <div className="mt-6 p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <h3 className="font-medium mb-2">Quick Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(hashtagDatabase).map(category => (
                            <button
                                key={category}
                                onClick={() => {
                                    setTopic(category);
                                    setTimeout(generateHashtags, 100);
                                }}
                                className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg text-sm hover:bg-[var(--accent-primary)] hover:text-white transition-colors capitalize"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HashtagGenerator;
