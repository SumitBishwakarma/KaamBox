import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { tools, searchTools } from '../../data/tools';
import * as LucideIcons from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Clear search when navigating
    useEffect(() => {
        setSearchQuery('');
        setIsSearchFocused(false);
    }, [location.pathname]);

    // Handle search
    useEffect(() => {
        if (searchQuery.trim()) {
            const results = searchTools(searchQuery).slice(0, 8);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToolClick = (tool) => {
        navigate(`/tool/${tool.id}`);
        setSearchQuery('');
        setIsSearchFocused(false);
    };

    const getIcon = (iconName) => {
        const Icon = LucideIcons[iconName];
        return Icon ? <Icon size={18} /> : null;
    };

    return (
        <header className="h-16 sticky top-0 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)]">
            <div className="h-full flex items-center gap-4 px-4 lg:px-6">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div ref={searchRef} className="flex-1 max-w-2xl relative">
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                        />
                        <input
                            type="text"
                            placeholder="Search 50+ tools..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            className="w-full h-12 pl-12 pr-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[var(--bg-tertiary)]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden"
                            >
                                {searchResults.map((tool) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => handleToolClick(tool)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--color-primary)]">
                                            {getIcon(tool.icon)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[var(--text-primary)]">{tool.name}</p>
                                            <p className="text-sm text-[var(--text-muted)]">{tool.description}</p>
                                        </div>
                                        {!tool.implemented && (
                                            <span className="ml-auto text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                                                Coming Soon
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side - Can be used for future features */}
                <div className="hidden sm:flex items-center gap-2">
                    <div className="privacy-badge">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>Data stays on your device</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
