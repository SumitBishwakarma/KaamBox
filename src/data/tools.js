// ============================================
// KAAMBOX - Master Tools Registry
// ============================================
// This file contains metadata for all 50 tools
// Used for search, filtering, and dynamic routing

export const categories = [
    { id: 'text', name: 'Text & Content', icon: 'FileText', color: '#3b82f6' },
    { id: 'image', name: 'Image & Media', icon: 'Image', color: '#8b5cf6' },
    { id: 'developer', name: 'Developer Tools', icon: 'Code', color: '#10b981' },
    { id: 'math', name: 'Math & Converters', icon: 'Calculator', color: '#f59e0b' },
    { id: 'utility', name: 'Utility & Everyday', icon: 'Wrench', color: '#ef4444' }
];

export const tools = [
    // ============================================
    // CATEGORY A: Text & Content (10 tools)
    // ============================================
    {
        id: 'word-counter',
        name: 'Word Counter',
        description: 'Real-time word, character, sentence, and paragraph statistics',
        icon: 'FileText',
        category: 'text',
        component: 'WordCounter',
        tags: ['text', 'count', 'words', 'characters', 'statistics'],
        implemented: true
    },
    {
        id: 'lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Generate placeholder text by paragraphs, sentences, or words',
        icon: 'AlignLeft',
        category: 'text',
        component: 'LoremIpsum',
        tags: ['lorem', 'ipsum', 'placeholder', 'dummy text'],
        implemented: true
    },
    {
        id: 'case-converter',
        name: 'Case Converter',
        description: 'Convert text to UPPER, lower, Title, sentence, or camelCase',
        icon: 'CaseSensitive',
        category: 'text',
        component: 'CaseConverter',
        tags: ['case', 'uppercase', 'lowercase', 'title', 'camel'],
        implemented: true
    },
    {
        id: 'markdown-editor',
        name: 'Markdown to HTML',
        description: 'Write markdown and see live HTML preview',
        icon: 'FileCode',
        category: 'text',
        component: 'MarkdownEditor',
        tags: ['markdown', 'html', 'editor', 'preview'],
        implemented: true
    },
    {
        id: 'text-to-speech',
        name: 'Text to Speech',
        description: 'Convert text to speech with selectable voices',
        icon: 'Volume2',
        category: 'text',
        component: 'TextToSpeech',
        tags: ['speech', 'audio', 'voice', 'tts'],
        implemented: true
    },
    {
        id: 'duplicate-remover',
        name: 'Duplicate Line Remover',
        description: 'Remove duplicate lines from text',
        icon: 'ListX',
        category: 'text',
        component: 'DuplicateRemover',
        tags: ['duplicate', 'remove', 'lines', 'unique'],
        implemented: true
    },
    {
        id: 'emoji-picker',
        name: 'Emoji Picker',
        description: 'Search and copy emojis to clipboard',
        icon: 'Smile',
        category: 'text',
        component: 'EmojiPicker',
        tags: ['emoji', 'emoticon', 'copy'],
        implemented: true
    },
    {
        id: 'reverse-text',
        name: 'Reverse Text',
        description: 'Reverse and mirror text strings',
        icon: 'FlipHorizontal',
        category: 'text',
        component: 'ReverseText',
        tags: ['reverse', 'mirror', 'flip'],
        implemented: true
    },
    {
        id: 'slug-generator',
        name: 'Slug Generator',
        description: 'Create URL-friendly slugs from text',
        icon: 'Link',
        category: 'text',
        component: 'SlugGenerator',
        tags: ['slug', 'url', 'seo', 'permalink'],
        implemented: true
    },
    {
        id: 'privacy-policy',
        name: 'Privacy Policy Generator',
        description: 'Generate privacy policy from template',
        icon: 'Shield',
        category: 'text',
        component: 'PrivacyPolicy',
        tags: ['privacy', 'policy', 'legal', 'template'],
        implemented: true
    },

    // ============================================
    // CATEGORY B: Image & Media (10 tools)
    // ============================================
    {
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Compress images while maintaining quality',
        icon: 'ImageDown',
        category: 'image',
        component: 'ImageCompressor',
        tags: ['compress', 'resize', 'optimize', 'reduce'],
        implemented: true
    },
    {
        id: 'image-to-base64',
        name: 'Image to Base64',
        description: 'Convert images to Base64 encoded strings',
        icon: 'Binary',
        category: 'image',
        component: 'ImageToBase64',
        tags: ['base64', 'encode', 'convert', 'data uri'],
        implemented: true
    },
    {
        id: 'base64-to-image',
        name: 'Base64 to Image',
        description: 'Decode Base64 strings back to images',
        icon: 'Image',
        category: 'image',
        component: 'Base64ToImage',
        tags: ['base64', 'decode', 'convert'],
        implemented: true
    },
    {
        id: 'color-picker',
        name: 'Color Picker',
        description: 'Pick colors and convert between HEX, RGB, and HSL',
        icon: 'Palette',
        category: 'image',
        component: 'ColorPicker',
        tags: ['color', 'hex', 'rgb', 'hsl', 'picker'],
        implemented: true
    },
    {
        id: 'image-cropper',
        name: 'Image Cropper',
        description: 'Crop images with canvas-based editor',
        icon: 'Crop',
        category: 'image',
        component: 'ImageCropper',
        tags: ['crop', 'resize', 'edit'],
        implemented: true
    },
    {
        id: 'youtube-thumbnail',
        name: 'YouTube Thumbnail Downloader',
        description: 'Download thumbnails from YouTube videos',
        icon: 'Youtube',
        category: 'image',
        component: 'YoutubeThumbnail',
        tags: ['youtube', 'thumbnail', 'download', 'video'],
        implemented: true
    },
    {
        id: 'qr-generator',
        name: 'QR Code Generator',
        description: 'Generate QR codes with custom colors and sizes',
        icon: 'QrCode',
        category: 'image',
        component: 'QRGenerator',
        tags: ['qr', 'code', 'generate', 'barcode'],
        implemented: true
    },
    {
        id: 'svg-blob',
        name: 'SVG Blob Generator',
        description: 'Generate organic SVG blob shapes',
        icon: 'Shapes',
        category: 'image',
        component: 'SVGBlob',
        tags: ['svg', 'blob', 'shape', 'design'],
        implemented: true
    },
    {
        id: 'image-filters',
        name: 'Image Filter Editor',
        description: 'Apply CSS filters like grayscale, blur, and contrast',
        icon: 'SlidersHorizontal',
        category: 'image',
        component: 'ImageFilters',
        tags: ['filter', 'effect', 'edit', 'grayscale', 'blur'],
        implemented: true
    },
    {
        id: 'meme-generator',
        name: 'Meme Generator',
        description: 'Add text to images to create memes',
        icon: 'MessageSquare',
        category: 'image',
        component: 'MemeGenerator',
        tags: ['meme', 'text', 'image', 'funny'],
        implemented: true
    },

    // ============================================
    // CATEGORY C: Developer Tools (10 tools)
    // ============================================
    {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format and validate JSON with syntax highlighting',
        icon: 'Braces',
        category: 'developer',
        component: 'JSONFormatter',
        tags: ['json', 'format', 'validate', 'pretty'],
        implemented: true
    },
    {
        id: 'css-minifier',
        name: 'CSS Minifier',
        description: 'Minify CSS by removing whitespace',
        icon: 'FileCode2',
        category: 'developer',
        component: 'CSSMinifier',
        tags: ['css', 'minify', 'compress', 'optimize'],
        implemented: true
    },
    {
        id: 'html-encoder',
        name: 'HTML Encoder/Decoder',
        description: 'Encode and decode HTML special characters',
        icon: 'Code2',
        category: 'developer',
        component: 'HTMLEncoder',
        tags: ['html', 'encode', 'decode', 'entities'],
        implemented: true
    },
    {
        id: 'url-encoder',
        name: 'URL Encoder/Decoder',
        description: 'Encode and decode URL strings',
        icon: 'Link2',
        category: 'developer',
        component: 'URLEncoder',
        tags: ['url', 'encode', 'decode', 'uri'],
        implemented: true
    },
    {
        id: 'uuid-generator',
        name: 'UUID Generator',
        description: 'Generate random UUIDs/GUIDs',
        icon: 'Fingerprint',
        category: 'developer',
        component: 'UUIDGenerator',
        tags: ['uuid', 'guid', 'random', 'id'],
        implemented: true
    },
    {
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure passwords with custom options',
        icon: 'KeyRound',
        category: 'developer',
        component: 'PasswordGenerator',
        tags: ['password', 'secure', 'random', 'generator'],
        implemented: true
    },
    {
        id: 'user-agent',
        name: 'User Agent Parser',
        description: 'View and parse current browser user agent',
        icon: 'Monitor',
        category: 'developer',
        component: 'UserAgentParser',
        tags: ['user agent', 'browser', 'device', 'info'],
        implemented: true
    },
    {
        id: 'git-cheatsheet',
        name: 'Git Cheatsheet',
        description: 'Searchable list of common Git commands',
        icon: 'GitBranch',
        category: 'developer',
        component: 'GitCheatsheet',
        tags: ['git', 'commands', 'cheatsheet', 'reference'],
        implemented: true
    },
    {
        id: 'code-diff',
        name: 'Code Diff Checker',
        description: 'Compare two text inputs and highlight differences',
        icon: 'GitCompare',
        category: 'developer',
        component: 'CodeDiff',
        tags: ['diff', 'compare', 'code', 'changes'],
        implemented: true
    },
    {
        id: 'sql-formatter',
        name: 'SQL Formatter',
        description: 'Format SQL queries with proper indentation',
        icon: 'Database',
        category: 'developer',
        component: 'SQLFormatter',
        tags: ['sql', 'format', 'query', 'database'],
        implemented: true
    },

    // ============================================
    // CATEGORY D: Math & Converters (10 tools)
    // ============================================
    {
        id: 'calculator',
        name: 'Calculator',
        description: 'Simple calculator with standard operations',
        icon: 'Calculator',
        category: 'math',
        component: 'Calculator',
        tags: ['calculator', 'math', 'arithmetic'],
        implemented: true
    },
    {
        id: 'unit-converter',
        name: 'Unit Converter',
        description: 'Convert between length, weight, and temperature units',
        icon: 'ArrowLeftRight',
        category: 'math',
        component: 'UnitConverter',
        tags: ['unit', 'convert', 'length', 'weight', 'temperature'],
        implemented: true
    },
    {
        id: 'currency-converter',
        name: 'Currency Converter',
        description: 'Convert between different currencies',
        icon: 'DollarSign',
        category: 'math',
        component: 'CurrencyConverter',
        tags: ['currency', 'money', 'exchange', 'convert'],
        implemented: true
    },
    {
        id: 'age-calculator',
        name: 'Age Calculator',
        description: 'Calculate precise age from date of birth',
        icon: 'Calendar',
        category: 'math',
        component: 'AgeCalculator',
        tags: ['age', 'birthday', 'date', 'years'],
        implemented: true
    },
    {
        id: 'percentage-calculator',
        name: 'Percentage Calculator',
        description: 'Calculate percentages in multiple ways',
        icon: 'Percent',
        category: 'math',
        component: 'PercentageCalculator',
        tags: ['percentage', 'percent', 'calculate'],
        implemented: true
    },
    {
        id: 'gst-calculator',
        name: 'GST/VAT Calculator',
        description: 'Add or remove GST/VAT from amounts',
        icon: 'Receipt',
        category: 'math',
        component: 'GSTCalculator',
        tags: ['gst', 'vat', 'tax', 'calculate'],
        implemented: true
    },
    {
        id: 'binary-converter',
        name: 'Binary Converter',
        description: 'Convert text to binary and vice versa',
        icon: 'Binary',
        category: 'math',
        component: 'BinaryConverter',
        tags: ['binary', 'text', 'convert', 'code'],
        implemented: true
    },
    {
        id: 'hex-decimal',
        name: 'Hex to Decimal',
        description: 'Convert between hexadecimal and decimal numbers',
        icon: 'Hash',
        category: 'math',
        component: 'HexDecimal',
        tags: ['hex', 'decimal', 'convert', 'number'],
        implemented: true
    },
    {
        id: 'aspect-ratio',
        name: 'Aspect Ratio Calculator',
        description: 'Calculate aspect ratios for screens and images',
        icon: 'Maximize2',
        category: 'math',
        component: 'AspectRatio',
        tags: ['aspect', 'ratio', 'screen', 'resolution'],
        implemented: true
    },
    {
        id: 'roman-numerals',
        name: 'Roman Numerals Converter',
        description: 'Convert numbers to Roman numerals and back',
        icon: 'Hash',
        category: 'math',
        component: 'RomanNumerals',
        tags: ['roman', 'numerals', 'convert', 'number'],
        implemented: true
    },

    // ============================================
    // CATEGORY E: Utility & Everyday (10 tools)
    // ============================================
    {
        id: 'stopwatch',
        name: 'Stopwatch',
        description: 'Precise stopwatch with lap functionality',
        icon: 'Timer',
        category: 'utility',
        component: 'Stopwatch',
        tags: ['stopwatch', 'timer', 'lap', 'time'],
        implemented: true
    },
    {
        id: 'pomodoro-timer',
        name: 'Pomodoro Timer',
        description: 'Productivity timer with work/break cycles',
        icon: 'Clock',
        category: 'utility',
        component: 'PomodoroTimer',
        tags: ['pomodoro', 'timer', 'productivity', 'focus'],
        implemented: true
    },
    {
        id: 'world-clock',
        name: 'World Clock',
        description: 'View time in multiple timezones',
        icon: 'Globe',
        category: 'utility',
        component: 'WorldClock',
        tags: ['clock', 'timezone', 'world', 'time'],
        implemented: true
    },
    {
        id: 'speed-test',
        name: 'Internet Speed Test',
        description: 'Test your download speed',
        icon: 'Gauge',
        category: 'utility',
        component: 'SpeedTest',
        tags: ['speed', 'internet', 'test', 'download'],
        implemented: true
    },
    {
        id: 'screen-resolution',
        name: 'Screen Resolution',
        description: 'View your current screen resolution and viewport',
        icon: 'Monitor',
        category: 'utility',
        component: 'ScreenResolution',
        tags: ['screen', 'resolution', 'viewport', 'display'],
        implemented: true
    },
    {
        id: 'bmi-calculator',
        name: 'BMI Calculator',
        description: 'Calculate your Body Mass Index',
        icon: 'Heart',
        category: 'utility',
        component: 'BMICalculator',
        tags: ['bmi', 'health', 'weight', 'body'],
        implemented: true
    },
    {
        id: 'loan-calculator',
        name: 'Loan/EMI Calculator',
        description: 'Calculate loan EMI and interest breakdown',
        icon: 'Landmark',
        category: 'utility',
        component: 'LoanCalculator',
        tags: ['loan', 'emi', 'interest', 'mortgage'],
        implemented: true
    },
    {
        id: 'decision-maker',
        name: 'Decision Maker',
        description: 'Spin wheel or flip coin to make decisions',
        icon: 'Dices',
        category: 'utility',
        component: 'DecisionMaker',
        tags: ['decision', 'random', 'wheel', 'coin'],
        implemented: true
    },
    {
        id: 'todo-list',
        name: 'To-Do List',
        description: 'Simple task manager with local storage',
        icon: 'CheckSquare',
        category: 'utility',
        component: 'TodoList',
        tags: ['todo', 'task', 'list', 'productivity'],
        implemented: true
    },
    {
        id: 'notes-app',
        name: 'Notes App',
        description: 'Take notes with markdown support',
        icon: 'StickyNote',
        category: 'utility',
        component: 'NotesApp',
        tags: ['notes', 'markdown', 'text', 'save'],
        implemented: true
    }
];

// Helper functions
export const getToolById = (id) => tools.find(tool => tool.id === id);

export const getToolsByCategory = (category) => tools.filter(tool => tool.category === category);

export const getImplementedTools = () => tools.filter(tool => tool.implemented);

export const searchTools = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return tools;

    return tools.filter(tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
};

export const getCategoryById = (id) => categories.find(cat => cat.id === id);
