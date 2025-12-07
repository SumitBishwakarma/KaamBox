import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Copy, Check, RefreshCw, Heart, Share2 } from 'lucide-react';

const QuoteGenerator = () => {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);

    const quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
        { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "The mind is everything. What you think you become.", author: "Buddha" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James" }
    ];

    useEffect(() => {
        const saved = localStorage.getItem('favoriteQuotes');
        if (saved) setFavorites(JSON.parse(saved));
        generateQuote();
    }, []);

    useEffect(() => {
        localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    }, [favorites]);

    const generateQuote = () => {
        setLoading(true);
        setTimeout(() => {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setQuote(randomQuote);
            setLoading(false);
        }, 300);
    };

    const copyQuote = () => {
        if (!quote) return;
        navigator.clipboard.writeText(`"${quote.text}" - ${quote.author}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleFavorite = () => {
        if (!quote) return;
        const exists = favorites.find(f => f.text === quote.text);
        if (exists) {
            setFavorites(favorites.filter(f => f.text !== quote.text));
        } else {
            setFavorites([...favorites, quote]);
        }
    };

    const isFavorite = quote && favorites.some(f => f.text === quote.text);

    const shareQuote = async () => {
        if (!quote) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Inspirational Quote',
                    text: `"${quote.text}" - ${quote.author}`
                });
            } catch (e) {
                console.log('Share cancelled');
            }
        } else {
            copyQuote();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Quote Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Get inspired with random quotes</p>
            </div>

            <div className="space-y-4">
                {quote && (
                    <motion.div
                        key={quote.text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl text-center"
                    >
                        <Quote className="w-8 h-8 mx-auto mb-4 text-[var(--accent-primary)]" />
                        <p className="text-xl font-medium mb-4 leading-relaxed">"{quote.text}"</p>
                        <p className="text-[var(--text-muted)]">— {quote.author}</p>
                    </motion.div>
                )}

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateQuote}
                        disabled={loading}
                        className="btn-primary flex-1"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        New Quote
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyQuote}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFavorite}
                        className={`p-3 rounded-xl ${isFavorite ? 'bg-red-500/20 text-red-500' : 'bg-[var(--bg-tertiary)]'}`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={shareQuote}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <Share2 className="w-5 h-5" />
                    </motion.button>
                </div>

                <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="w-full p-3 bg-[var(--bg-tertiary)] rounded-xl text-sm flex items-center justify-center gap-2"
                >
                    <Heart className="w-4 h-4" />
                    {showFavorites ? 'Hide' : 'Show'} Favorites ({favorites.length})
                </button>

                {showFavorites && favorites.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {favorites.map((fav, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-[var(--bg-tertiary)] rounded-xl"
                            >
                                <p className="text-sm mb-1">"{fav.text}"</p>
                                <p className="text-xs text-[var(--text-muted)]">— {fav.author}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuoteGenerator;
