import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Search, Sun, Moon, Shield, ChevronLeft, ChevronRight,
    FileText, Image, Code, Calculator, Wrench, Home, Brain, Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { categories } from '../../data/tools';

const iconMap = {
    FileText, Image, Code, Calculator, Wrench, Brain
};

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { isDark, toggleTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full z-50
                    bg-[var(--bg-secondary)]/95 backdrop-blur-xl border-r border-[var(--border-color)]
                    transition-all duration-300 ease-in-out
                    ${sidebarWidth}
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border-color)]">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
                                <span className="text-white font-bold text-sm">KB</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-gradient">KaamBox</span>
                                <span className="text-xs text-[var(--text-muted)]">50+ Free Tools</span>
                            </div>
                        </motion.div>
                    )}

                    {/* Collapse Button (Desktop) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>

                    {/* Close Button (Mobile) */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {/* Home */}
                    <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                            ${isActive
                                ? 'bg-gradient-to-r from-blue-500/15 to-purple-500/15 text-blue-500 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}
                        `}
                    >
                        <Home size={20} />
                        {!isCollapsed && <span className="font-medium">Home</span>}
                    </NavLink>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent my-4" />

                    {/* Categories */}
                    {!isCollapsed && (
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 mb-3 flex items-center gap-2">
                            <span className="w-8 h-px bg-[var(--border-color)]"></span>
                            Categories
                            <span className="w-8 h-px bg-[var(--border-color)]"></span>
                        </p>
                    )}

                    {categories.map((category) => {
                        const Icon = iconMap[category.icon] || FileText;
                        const isAI = category.id === 'ai';

                        return (
                            <NavLink
                                key={category.id}
                                to={`/?category=${category.id}`}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden
                                    ${isActive
                                        ? isAI
                                            ? 'bg-gradient-to-r from-pink-500/15 to-purple-500/15 text-pink-500 border border-pink-500/30'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]'
                                        : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}
                                    ${isAI ? 'group' : ''}
                                `}
                            >
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-transform group-hover:scale-110 ${isAI ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20' : ''}`}
                                    style={{
                                        backgroundColor: !isAI ? `${category.color}15` : undefined
                                    }}
                                >
                                    <Icon size={18} style={{ color: category.color }} />
                                </div>
                                {!isCollapsed && (
                                    <span className="font-medium flex items-center gap-2">
                                        {category.name}
                                        {isAI && (
                                            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
                                                NEW
                                            </span>
                                        )}
                                    </span>
                                )}

                                {/* AI Category Sparkle Effect */}
                                {isAI && !isCollapsed && (
                                    <Sparkles
                                        size={14}
                                        className="absolute right-4 text-pink-400 animate-pulse"
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/80 backdrop-blur-lg">
                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--bg-tertiary)] to-[var(--bg-secondary)] hover:from-[var(--bg-primary)] hover:to-[var(--bg-tertiary)] transition-all border border-[var(--border-color)]"
                    >
                        {isDark ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} className="text-blue-500" />
                        )}
                        {!isCollapsed && (
                            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        )}
                    </motion.button>

                    {/* Privacy Badge */}
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 flex items-center justify-center gap-2 text-xs text-green-500 bg-green-500/10 py-2 px-3 rounded-lg border border-green-500/20"
                        >
                            <Shield size={14} />
                            <span className="font-medium">100% Privacy Focused</span>
                        </motion.div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
