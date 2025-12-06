import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Search, Sun, Moon, Shield, ChevronLeft, ChevronRight,
    FileText, Image, Code, Calculator, Wrench, Home
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { categories } from '../../data/tools';

const iconMap = {
    FileText, Image, Code, Calculator, Wrench
};

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { isDark, toggleTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full z-50
          bg-[var(--bg-secondary)] border-r border-[var(--border-color)]
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
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">KB</span>
                            </div>
                            <span className="text-lg font-bold text-gradient">KaamBox</span>
                        </motion.div>
                    )}

                    {/* Collapse Button (Desktop) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>

                    {/* Close Button (Mobile) */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {/* Home */}
                    <NavLink
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
              ${isActive
                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                                : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}
            `}
                    >
                        <Home size={20} />
                        {!isCollapsed && <span className="font-medium">Home</span>}
                    </NavLink>

                    {/* Divider */}
                    <div className="h-px bg-[var(--border-color)] my-4" />

                    {/* Categories */}
                    {!isCollapsed && (
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-3 mb-2">
                            Categories
                        </p>
                    )}

                    {categories.map((category) => {
                        const Icon = iconMap[category.icon] || FileText;
                        return (
                            <NavLink
                                key={category.id}
                                to={`/?category=${category.id}`}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${isActive
                                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                                        : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}
                `}
                            >
                                <Icon size={20} style={{ color: category.color }} />
                                {!isCollapsed && <span className="font-medium">{category.name}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] transition-colors"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        {!isCollapsed && (
                            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        )}
                    </button>

                    {/* Privacy Badge */}
                    {!isCollapsed && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-500">
                            <Shield size={14} />
                            <span>Privacy Focused</span>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
