import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { getCategoryById } from '../../data/tools';

const ToolCard = ({ tool, index = 0 }) => {
    const navigate = useNavigate();
    const category = getCategoryById(tool.category);

    const Icon = LucideIcons[tool.icon] || LucideIcons.FileText;

    const handleClick = () => {
        if (tool.implemented) {
            navigate(`/tool/${tool.id}`);
        }
    };

    // Special styling for AI category
    const isAI = tool.category === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            data-category={tool.category}
            className={`
                tool-card group relative
                ${!tool.implemented ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                ${isAI ? 'border-pink-500/20 hover:border-pink-500' : ''}
            `}
        >
            {/* Premium Gradient Overlay */}
            <div
                className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: isAI
                        ? 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(168,85,247,0.08) 100%)'
                        : `linear-gradient(135deg, ${category?.color}10 0%, ${category?.color}05 100%)`
                }}
            />

            {/* Category Color Accent Line */}
            <div
                className="absolute top-0 left-0 w-1.5 h-full rounded-l-[20px] opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                    backgroundColor: isAI ? '#ec4899' : category?.color || '#3b82f6',
                    boxShadow: `0 0 20px ${isAI ? 'rgba(236,72,153,0.5)' : category?.color + '50' || 'rgba(59,130,246,0.5)'}`
                }}
            />

            {/* Icon with Enhanced Styling */}
            <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative z-10"
                style={{
                    background: isAI
                        ? 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.15) 100%)'
                        : `linear-gradient(135deg, ${category?.color}15 0%, ${category?.color}10 100%)`,
                    color: isAI ? '#ec4899' : category?.color || '#3b82f6',
                    boxShadow: `0 0 0 1px ${isAI ? 'rgba(236,72,153,0.2)' : category?.color + '20' || 'rgba(59,130,246,0.2)'}`
                }}
            >
                <Icon size={26} strokeWidth={1.8} />
            </div>

            {/* Content */}
            <div className="relative z-10">
                <h3 className={`text-base font-semibold text-[var(--text-primary)] mb-1.5 group-hover:text-gradient transition-colors duration-300 ${isAI ? 'group-hover:text-pink-500' : ''}`}>
                    {tool.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                    {tool.description}
                </p>
            </div>

            {/* Tags with Premium Styling */}
            <div className="flex flex-wrap gap-1.5 mt-4 relative z-10">
                {tool.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className={`text-xs px-2.5 py-1 rounded-full transition-colors duration-200
                            ${isAI
                                ? 'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] group-hover:bg-[var(--bg-secondary)]'
                            }`}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* AI Badge for AI tools */}
            {isAI && tool.implemented && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30">
                        <LucideIcons.Sparkles size={12} />
                        AI
                    </span>
                </div>
            )}

            {/* Coming Soon Badge */}
            {!tool.implemented && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 backdrop-blur-sm">
                        Coming Soon
                    </span>
                </div>
            )}

            {/* Shimmer Effect on Hover */}
            <div className="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:left-full transition-all duration-700 ease-out" />
            </div>
        </motion.div>
    );
};

export default ToolCard;
