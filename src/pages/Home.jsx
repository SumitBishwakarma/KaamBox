import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Shield, Zap, Lock } from 'lucide-react';
import { tools, categories, searchTools, getToolsByCategory } from '../data/tools';
import ToolCard from '../components/UI/ToolCard';
import AdContainer from '../components/Layout/AdContainer';

const Home = () => {
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter tools based on search and category
    const filteredTools = useMemo(() => {
        let result = tools;

        if (categoryFilter) {
            result = getToolsByCategory(categoryFilter);
        }

        if (searchQuery.trim()) {
            result = searchTools(searchQuery).filter(t =>
                !categoryFilter || t.category === categoryFilter
            );
        }

        return result;
    }, [searchQuery, categoryFilter]);

    // Get current category info
    const currentCategory = categories.find(c => c.id === categoryFilter);

    // Insert ads every 8 cards
    const renderToolsWithAds = () => {
        const elements = [];
        filteredTools.forEach((tool, index) => {
            elements.push(
                <ToolCard key={tool.id} tool={tool} index={index} />
            );
            // Insert ad after every 8th card
            if ((index + 1) % 8 === 0 && index < filteredTools.length - 1) {
                elements.push(
                    <div key={`ad-${index}`} className="tool-card !p-0 overflow-hidden">
                        <AdContainer type="ingrid" />
                    </div>
                );
            }
        });
        return elements;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            {!categoryFilter && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6"
                    >
                        <Sparkles size={16} />
                        <span>50+ Free Tools</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        Your <span className="text-gradient">Digital Swiss Army Knife</span>
                    </h1>

                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
                        Powerful tools for text, images, development, math, and everyday tasks.
                        100% client-side processing - your data never leaves your device.
                    </p>

                    {/* Search Bar (Hero) */}
                    <div className="relative max-w-xl mx-auto">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                        />
                        <input
                            type="text"
                            placeholder="Search tools... (e.g., 'json', 'password', 'converter')"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-lg"
                        />
                    </div>

                    {/* Feature Badges */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Shield size={16} className="text-green-500" />
                            <span>Privacy Focused</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Zap size={16} className="text-yellow-500" />
                            <span>Lightning Fast</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <Lock size={16} className="text-blue-500" />
                            <span>No Data Collection</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Category Header */}
            {currentCategory && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold mb-2">{currentCategory.name}</h1>
                    <p className="text-[var(--text-secondary)]">
                        {getToolsByCategory(currentCategory.id).length} tools available
                    </p>
                </motion.div>
            )}

            {/* Category Pills (when no filter) */}
            {!categoryFilter && !searchQuery && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                        <a
                            key={category.id}
                            href={`/?category=${category.id}`}
                            className="px-4 py-2 rounded-xl border border-[var(--border-color)] hover:border-[var(--color-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-all text-sm font-medium"
                            style={{ color: category.color }}
                        >
                            {category.name}
                        </a>
                    ))}
                </div>
            )}

            {/* Tools Grid (Bento Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {renderToolsWithAds()}
            </div>

            {/* No Results */}
            {filteredTools.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <p className="text-xl text-[var(--text-muted)]">
                        No tools found for "{searchQuery}"
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 btn-secondary"
                    >
                        Clear Search
                    </button>
                </motion.div>
            )}

            {/* Stats Section */}
            {!categoryFilter && !searchQuery && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: 'Total Tools', value: '50+' },
                        { label: 'Categories', value: '5' },
                        { label: 'Data Stored', value: '0 bytes' },
                        { label: 'Server Calls', value: 'Zero' }
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="glass-card p-6 text-center"
                        >
                            <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Home;
