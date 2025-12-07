import { Suspense, lazy, useMemo, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Home, Shield } from 'lucide-react';
import { getToolById, getToolsByCategory, getCategoryById } from '../data/tools';
import { getToolSEO } from '../data/toolSEO';
import ToolCard from '../components/UI/ToolCard';
import AdContainer from '../components/Layout/AdContainer';

// Lazy load all tool components
const toolComponents = {
    // Text & Content
    WordCounter: lazy(() => import('../tools/text/WordCounter')),
    LoremIpsum: lazy(() => import('../tools/text/LoremIpsum')),
    CaseConverter: lazy(() => import('../tools/text/CaseConverter')),
    MarkdownEditor: lazy(() => import('../tools/text/MarkdownEditor')),
    TextToSpeech: lazy(() => import('../tools/text/TextToSpeech')),
    DuplicateRemover: lazy(() => import('../tools/text/DuplicateRemover')),
    EmojiPicker: lazy(() => import('../tools/text/EmojiPicker')),
    ReverseText: lazy(() => import('../tools/text/ReverseText')),
    SlugGenerator: lazy(() => import('../tools/text/SlugGenerator')),
    PrivacyPolicy: lazy(() => import('../tools/text/PrivacyPolicy')),
    // NEW Text Tools
    HashtagGenerator: lazy(() => import('../tools/text/HashtagGenerator')),
    FancyText: lazy(() => import('../tools/text/FancyText')),
    TextEncrypt: lazy(() => import('../tools/text/TextEncrypt')),
    WordFrequency: lazy(() => import('../tools/text/WordFrequency')),
    BioGenerator: lazy(() => import('../tools/text/BioGenerator')),
    QuoteGenerator: lazy(() => import('../tools/text/QuoteGenerator')),
    AsciiArtGenerator: lazy(() => import('../tools/text/AsciiArtGenerator')),
    TextDiffChecker: lazy(() => import('../tools/text/TextDiffChecker')),
    NameGenerator: lazy(() => import('../tools/text/NameGenerator')),

    // Image & Media
    ImageCompressor: lazy(() => import('../tools/image/ImageCompressor')),
    ImageToBase64: lazy(() => import('../tools/image/ImageToBase64')),
    ColorPicker: lazy(() => import('../tools/image/ColorPicker')),
    QRGenerator: lazy(() => import('../tools/image/QRGenerator')),
    ImageFilters: lazy(() => import('../tools/image/ImageFilters')),
    Base64ToImage: lazy(() => import('../tools/image/Base64ToImage')),
    ImageCropper: lazy(() => import('../tools/image/ImageCropper')),
    YoutubeThumbnail: lazy(() => import('../tools/image/YoutubeThumbnail')),
    SVGBlob: lazy(() => import('../tools/image/SVGBlob')),
    MemeGenerator: lazy(() => import('../tools/image/MemeGenerator')),
    // NEW Image Tools
    GradientGenerator: lazy(() => import('../tools/image/GradientGenerator')),
    ImageResizer: lazy(() => import('../tools/image/ImageResizer')),
    FaviconGenerator: lazy(() => import('../tools/image/FaviconGenerator')),
    PlaceholderImage: lazy(() => import('../tools/image/PlaceholderImage')),
    ImageWatermark: lazy(() => import('../tools/image/ImageWatermark')),
    ColorPaletteGenerator: lazy(() => import('../tools/image/ColorPaletteGenerator')),


    // Developer Tools
    JSONFormatter: lazy(() => import('../tools/developer/JSONFormatter')),
    PasswordGenerator: lazy(() => import('../tools/developer/PasswordGenerator')),
    UUIDGenerator: lazy(() => import('../tools/developer/UUIDGenerator')),
    URLEncoder: lazy(() => import('../tools/developer/URLEncoder')),
    HTMLEncoder: lazy(() => import('../tools/developer/HTMLEncoder')),
    CSSMinifier: lazy(() => import('../tools/developer/CSSMinifier')),
    UserAgentParser: lazy(() => import('../tools/developer/UserAgentParser')),
    GitCheatsheet: lazy(() => import('../tools/developer/GitCheatsheet')),
    CodeDiff: lazy(() => import('../tools/developer/CodeDiff')),
    SQLFormatter: lazy(() => import('../tools/developer/SQLFormatter')),
    // NEW Developer Tools
    RegexTester: lazy(() => import('../tools/developer/RegexTester')),
    HashGenerator: lazy(() => import('../tools/developer/HashGenerator')),
    JWTDecoder: lazy(() => import('../tools/developer/JWTDecoder')),
    MetaTagsGenerator: lazy(() => import('../tools/developer/MetaTagsGenerator')),
    CronGenerator: lazy(() => import('../tools/developer/CronGenerator')),
    RobotsTxtGenerator: lazy(() => import('../tools/developer/RobotsTxtGenerator')),
    IPAddressLookup: lazy(() => import('../tools/developer/IPAddressLookup')),
    UTMBuilder: lazy(() => import('../tools/developer/UTMBuilder')),

    // Math & Converters
    Calculator: lazy(() => import('../tools/math/Calculator')),
    UnitConverter: lazy(() => import('../tools/math/UnitConverter')),
    PercentageCalculator: lazy(() => import('../tools/math/PercentageCalculator')),
    BinaryConverter: lazy(() => import('../tools/math/BinaryConverter')),
    AgeCalculator: lazy(() => import('../tools/math/AgeCalculator')),
    CurrencyConverter: lazy(() => import('../tools/math/CurrencyConverter')),
    GSTCalculator: lazy(() => import('../tools/math/GSTCalculator')),
    HexDecimal: lazy(() => import('../tools/math/HexDecimal')),
    AspectRatio: lazy(() => import('../tools/math/AspectRatio')),
    RomanNumerals: lazy(() => import('../tools/math/RomanNumerals')),
    // NEW Math Tools
    TipCalculator: lazy(() => import('../tools/math/TipCalculator')),
    DiscountCalculator: lazy(() => import('../tools/math/DiscountCalculator')),
    DateCalculator: lazy(() => import('../tools/math/DateCalculator')),
    RandomNumber: lazy(() => import('../tools/math/RandomNumber')),
    InvestmentCalculator: lazy(() => import('../tools/math/InvestmentCalculator')),
    SalaryCalculator: lazy(() => import('../tools/math/SalaryCalculator')),
    ScientificCalculator: lazy(() => import('../tools/math/ScientificCalculator')),
    FuelCostCalculator: lazy(() => import('../tools/math/FuelCostCalculator')),
    AspectRatioCalculator: lazy(() => import('../tools/math/AspectRatioCalculator')),
    MeetingCostCalculator: lazy(() => import('../tools/utility/MeetingCostCalculator')),

    // Utility & Everyday
    Stopwatch: lazy(() => import('../tools/utility/Stopwatch')),
    PomodoroTimer: lazy(() => import('../tools/utility/PomodoroTimer')),
    TodoList: lazy(() => import('../tools/utility/TodoList')),
    NotesApp: lazy(() => import('../tools/utility/NotesApp')),
    BMICalculator: lazy(() => import('../tools/utility/BMICalculator')),
    WorldClock: lazy(() => import('../tools/utility/WorldClock')),
    SpeedTest: lazy(() => import('../tools/utility/SpeedTest')),
    ScreenResolution: lazy(() => import('../tools/utility/ScreenResolution')),
    LoanCalculator: lazy(() => import('../tools/utility/LoanCalculator')),
    DecisionMaker: lazy(() => import('../tools/utility/DecisionMaker')),
    // NEW Utility Tools
    TypingSpeedTest: lazy(() => import('../tools/utility/TypingSpeedTest')),
    CountdownTimer: lazy(() => import('../tools/utility/CountdownTimer')),
    TimeZoneConverter: lazy(() => import('../tools/utility/TimeZoneConverter')),
    BarcodeGenerator: lazy(() => import('../tools/utility/BarcodeGenerator')),
    HabitTracker: lazy(() => import('../tools/utility/HabitTracker')),
    ExpenseTracker: lazy(() => import('../tools/utility/ExpenseTracker')),
    Flashcards: lazy(() => import('../tools/utility/Flashcards')),
    MoodJournal: lazy(() => import('../tools/utility/MoodJournal')),
    WaterIntakeTracker: lazy(() => import('../tools/utility/WaterIntakeTracker')),
    VoiceRecorder: lazy(() => import('../tools/utility/VoiceRecorder')),
    BreathingExercise: lazy(() => import('../tools/utility/BreathingExercise')),
    StickyNotes: lazy(() => import('../tools/utility/StickyNotes')),
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

    // Dynamic SEO - Update document title and meta description
    useEffect(() => {
        if (tool) {
            const seoData = getToolSEO(tool.id);

            // Set optimized title
            document.title = seoData?.title || `${tool.name} - Free Online Tool | KaamBox`;

            // Update meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', seoData?.description || `${tool.description} Free online ${tool.name.toLowerCase()} tool. No signup required, 100% privacy focused.`);
            }

            // Update or create meta keywords
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (seoData?.keywords) {
                if (!metaKeywords) {
                    metaKeywords = document.createElement('meta');
                    metaKeywords.name = 'keywords';
                    document.head.appendChild(metaKeywords);
                }
                metaKeywords.setAttribute('content', seoData.keywords);
            }

            // Update canonical URL
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                canonicalLink.setAttribute('href', `https://kaambox.online/tools/${tool.id}`);
            }

            // Update Open Graph tags
            let ogTitle = document.querySelector('meta[property="og:title"]');
            let ogDesc = document.querySelector('meta[property="og:description"]');
            let ogUrl = document.querySelector('meta[property="og:url"]');

            if (ogTitle) ogTitle.setAttribute('content', seoData?.title || tool.name);
            if (ogDesc) ogDesc.setAttribute('content', seoData?.description || tool.description);
            if (ogUrl) ogUrl.setAttribute('content', `https://kaambox.online/tools/${tool.id}`);
        }

        return () => {
            document.title = 'KaamBox - 50+ Free Online Tools';
        };
    }, [tool]);

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

            {/* Ad below tool */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-6"
            >
                <AdContainer type="native" />
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
