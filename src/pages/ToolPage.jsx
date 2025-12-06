import { Suspense, lazy, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Shield } from 'lucide-react';
import { getToolById, getToolsByCategory, getCategoryById } from '../data/tools';
import ToolCard from '../components/UI/ToolCard';

// Lazy load all tool components
const toolComponents = {
    // Text & Content
    WordCounter: lazy(() => import('../tools/text/WordCounter')),
    LoremIpsum: lazy(() => import('../tools/text/LoremIpsum')),
    CaseConverter: lazy(() => import('../tools/text/CaseConverter')),
    MarkdownEditor: lazy(() => import('../tools/text/MarkdownEditor')),
    TextToSpeech: lazy(() => import('../tools/text/TextToSpeech')),

    // Image & Media
    ImageCompressor: lazy(() => import('../tools/image/ImageCompressor')),
    ImageToBase64: lazy(() => import('../tools/image/ImageToBase64')),
    ColorPicker: lazy(() => import('../tools/image/ColorPicker')),
    QRGenerator: lazy(() => import('../tools/image/QRGenerator')),
    ImageFilters: lazy(() => import('../tools/image/ImageFilters')),

    // Developer Tools
    JSONFormatter: lazy(() => import('../tools/developer/JSONFormatter')),
    PasswordGenerator: lazy(() => import('../tools/developer/PasswordGenerator')),
    UUIDGenerator: lazy(() => import('../tools/developer/UUIDGenerator')),
    URLEncoder: lazy(() => import('../tools/developer/URLEncoder')),
    HTMLEncoder: lazy(() => import('../tools/developer/HTMLEncoder')),

    // Math & Converters
    Calculator: lazy(() => import('../tools/math/Calculator')),
    UnitConverter: lazy(() => import('../tools/math/UnitConverter')),
    PercentageCalculator: lazy(() => import('../tools/math/PercentageCalculator')),
    BinaryConverter: lazy(() => import('../tools/math/BinaryConverter')),
    AgeCalculator: lazy(() => import('../tools/math/AgeCalculator')),

    // Utility & Everyday
    Stopwatch: lazy(() => import('../tools/utility/Stopwatch')),
    PomodoroTimer: lazy(() => import('../tools/utility/PomodoroTimer')),
    TodoList: lazy(() => import('../tools/utility/TodoList')),
    NotesApp: lazy(() => import('../tools/utility/NotesApp')),
    BMICalculator: lazy(() => import('../tools/utility/BMICalculator')),
};

// Loading Component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
);

// Coming Soon Component
const ComingSoon = ({ tool }) => (
    <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <span className="text-4xl">🚧</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
            {tool.name} is currently under development. Check back soon!
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
            Browse Other Tools
        </Link>
    </div>
);

const ToolPage = () => {
    const { id } = useParams();
    const tool = getToolById(id);

    // Get related tools (same category, excluding current)
    const relatedTools = useMemo(() => {
        if (!tool) return [];
        return getToolsByCategory(tool.category)
            .filter(t => t.id !== tool.id && t.implemented)
            .slice(0, 4);
    }, [tool]);

    // Tool not found
    if (!tool) {
        return <Navigate to="/" replace />;
    }

    const category = getCategoryById(tool.category);
    const ToolComponent = tool.implemented ? toolComponents[tool.component] : null;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm mb-6"
            >
                <Link to="/" className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <Home size={16} />
                    <span>Home</span>
                </Link>
                <ChevronRight size={16} className="text-[var(--text-muted)]" />
                <Link
                    to={`/?category=${tool.category}`}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    style={{ color: category?.color }}
                >
                    {category?.name}
                </Link>
                <ChevronRight size={16} className="text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)] font-medium">{tool.name}</span>
            </motion.nav>

            {/* Tool Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.name}</h1>
                <p className="text-lg text-[var(--text-secondary)] mb-4">{tool.description}</p>

                <div className="flex items-center gap-3">
                    <div className="privacy-badge">
                        <Shield size={14} />
                        <span>Data stays on your device</span>
                    </div>
                    <div className="flex gap-1">
                        {tool.tags.slice(0, 4).map((tag) => (
                            <span
                                key={tag}
                                className="badge"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Tool Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                {ToolComponent ? (
                    <Suspense fallback={<LoadingSpinner />}>
                        <ToolComponent />
                    </Suspense>
                ) : (
                    <ComingSoon tool={tool} />
                )}
            </motion.div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12"
                >
                    <h2 className="text-xl font-bold mb-4">Related Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedTools.map((relTool) => (
                            <ToolCard key={relTool.id} tool={relTool} />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ToolPage;
