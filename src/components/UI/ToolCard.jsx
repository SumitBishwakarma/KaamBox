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

    const isAI = tool.category === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={handleClick}
            className={`
                tool-card group relative
                ${!tool.implemented ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {/* Category Color Accent */}
            <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: category?.color || '#3b82f6' }}
            />

            {/* Icon */}
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{
                    backgroundColor: `${category?.color || '#3b82f6'}15`,
                    color: category?.color || '#3b82f6'
                }}
            >
                <Icon size={24} />
            </div>

            {/* Content */}
            <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 group-hover:text-gradient transition-colors">
                {tool.name}
            </h3>
            <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                {tool.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
                {tool.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* AI Badge */}
            {isAI && tool.implemented && (
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/30">
                        <LucideIcons.Sparkles size={12} />
                        AI
                    </span>
                </div>
            )}

            {/* Coming Soon Badge */}
            {!tool.implemented && (
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
                        Coming Soon
                    </span>
                </div>
            )}
        </motion.div>
    );
};

export default ToolCard;
