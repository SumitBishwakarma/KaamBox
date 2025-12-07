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
    },

    // ============================================
    // NEW TOOLS BATCH 1 (19 tools)
    // ============================================

    // Text & Content
    {
        id: 'hashtag-generator',
        name: 'Hashtag Generator',
        description: 'Generate trending hashtags for social media posts',
        icon: 'Hash',
        category: 'text',
        component: 'HashtagGenerator',
        tags: ['hashtag', 'social media', 'instagram', 'twitter'],
        implemented: true
    },
    {
        id: 'fancy-text',
        name: 'Fancy Text Generator',
        description: 'Convert text to stylish fonts for social media',
        icon: 'Wand2',
        category: 'text',
        component: 'FancyText',
        tags: ['fancy', 'font', 'unicode', 'stylish', 'text'],
        implemented: true
    },
    {
        id: 'text-encrypt',
        name: 'Text Encrypt/Decrypt',
        description: 'Encode and decode text with various methods',
        icon: 'Lock',
        category: 'text',
        component: 'TextEncrypt',
        tags: ['encrypt', 'decrypt', 'encode', 'decode', 'cipher'],
        implemented: true
    },
    {
        id: 'word-frequency',
        name: 'Word Frequency Counter',
        description: 'Analyze how often each word appears in text',
        icon: 'BarChart3',
        category: 'text',
        component: 'WordFrequency',
        tags: ['word', 'frequency', 'count', 'analyze'],
        implemented: true
    },
    {
        id: 'bio-generator',
        name: 'Bio Generator',
        description: 'Create perfect bios for social media profiles',
        icon: 'User',
        category: 'text',
        component: 'BioGenerator',
        tags: ['bio', 'social media', 'profile', 'instagram', 'twitter'],
        implemented: true
    },

    // Developer Tools
    {
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test and debug regular expressions in real-time',
        icon: 'Code',
        category: 'developer',
        component: 'RegexTester',
        tags: ['regex', 'regular expression', 'pattern', 'test'],
        implemented: true
    },
    {
        id: 'hash-generator',
        name: 'Hash Generator',
        description: 'Generate MD5, SHA-1, SHA-256 and more hashes',
        icon: 'Hash',
        category: 'developer',
        component: 'HashGenerator',
        tags: ['hash', 'md5', 'sha', 'sha256', 'encrypt'],
        implemented: true
    },
    {
        id: 'jwt-decoder',
        name: 'JWT Decoder',
        description: 'Decode and inspect JSON Web Tokens',
        icon: 'Key',
        category: 'developer',
        component: 'JWTDecoder',
        tags: ['jwt', 'token', 'decode', 'json', 'auth'],
        implemented: true
    },
    {
        id: 'meta-tags-generator',
        name: 'Meta Tags Generator',
        description: 'Generate SEO meta tags for your website',
        icon: 'FileCode',
        category: 'developer',
        component: 'MetaTagsGenerator',
        tags: ['meta', 'seo', 'tags', 'og', 'twitter'],
        implemented: true
    },

    // Image & Media
    {
        id: 'gradient-generator',
        name: 'Gradient Generator',
        description: 'Create beautiful CSS gradients for your projects',
        icon: 'Palette',
        category: 'image',
        component: 'GradientGenerator',
        tags: ['gradient', 'css', 'color', 'design'],
        implemented: true
    },
    {
        id: 'image-resizer',
        name: 'Image Resizer',
        description: 'Resize images to any dimension',
        icon: 'Move',
        category: 'image',
        component: 'ImageResizer',
        tags: ['image', 'resize', 'scale', 'dimension'],
        implemented: true
    },

    // Math & Finance
    {
        id: 'tip-calculator',
        name: 'Tip Calculator',
        description: 'Calculate tips and split the bill',
        icon: 'Receipt',
        category: 'math',
        component: 'TipCalculator',
        tags: ['tip', 'restaurant', 'bill', 'split'],
        implemented: true
    },
    {
        id: 'discount-calculator',
        name: 'Discount Calculator',
        description: 'Calculate discounted prices quickly',
        icon: 'Percent',
        category: 'math',
        component: 'DiscountCalculator',
        tags: ['discount', 'sale', 'price', 'save'],
        implemented: true
    },
    {
        id: 'date-calculator',
        name: 'Date Calculator',
        description: 'Calculate difference between dates or add/subtract days',
        icon: 'Calendar',
        category: 'math',
        component: 'DateCalculator',
        tags: ['date', 'calendar', 'difference', 'days'],
        implemented: true
    },
    {
        id: 'random-number',
        name: 'Random Number Generator',
        description: 'Generate random numbers for any purpose',
        icon: 'Shuffle',
        category: 'math',
        component: 'RandomNumber',
        tags: ['random', 'number', 'dice', 'lottery'],
        implemented: true
    },
    {
        id: 'investment-calculator',
        name: 'Investment Calculator',
        description: 'Calculate compound interest and future value',
        icon: 'TrendingUp',
        category: 'math',
        component: 'InvestmentCalculator',
        tags: ['investment', 'compound', 'interest', 'finance'],
        implemented: true
    },
    {
        id: 'salary-calculator',
        name: 'Salary Calculator',
        description: 'Convert salary between hourly, monthly, yearly',
        icon: 'DollarSign',
        category: 'math',
        component: 'SalaryCalculator',
        tags: ['salary', 'wage', 'hourly', 'yearly'],
        implemented: true
    },

    // Utility
    {
        id: 'typing-speed-test',
        name: 'Typing Speed Test',
        description: 'Test and improve your typing speed',
        icon: 'Keyboard',
        category: 'utility',
        component: 'TypingSpeedTest',
        tags: ['typing', 'speed', 'wpm', 'test'],
        implemented: true
    },
    {
        id: 'countdown-timer',
        name: 'Countdown Timer',
        description: 'Track time until important events',
        icon: 'Clock',
        category: 'utility',
        component: 'CountdownTimer',
        tags: ['countdown', 'timer', 'event', 'date'],
        implemented: true
    },

    // ============================================
    // NEW TOOLS BATCH 2 (13 tools)
    // ============================================

    // Utility
    {
        id: 'timezone-converter',
        name: 'Time Zone Converter',
        description: 'Convert time between different time zones',
        icon: 'Globe',
        category: 'utility',
        component: 'TimeZoneConverter',
        tags: ['timezone', 'time', 'convert', 'world'],
        implemented: true
    },
    {
        id: 'barcode-generator',
        name: 'Barcode Generator',
        description: 'Generate barcodes from text',
        icon: 'Barcode',
        category: 'utility',
        component: 'BarcodeGenerator',
        tags: ['barcode', 'code128', 'scan'],
        implemented: true
    },
    {
        id: 'habit-tracker',
        name: 'Habit Tracker',
        description: 'Build good habits day by day',
        icon: 'Target',
        category: 'utility',
        component: 'HabitTracker',
        tags: ['habit', 'track', 'streak', 'daily'],
        implemented: true
    },
    {
        id: 'expense-tracker',
        name: 'Expense Tracker',
        description: 'Track your income and expenses',
        icon: 'Wallet',
        category: 'utility',
        component: 'ExpenseTracker',
        tags: ['expense', 'income', 'money', 'budget'],
        implemented: true
    },
    {
        id: 'meeting-cost-calculator',
        name: 'Meeting Cost Calculator',
        description: 'Calculate the true cost of meetings',
        icon: 'Users',
        category: 'utility',
        component: 'MeetingCostCalculator',
        tags: ['meeting', 'cost', 'time', 'salary'],
        implemented: true
    },
    {
        id: 'flashcards',
        name: 'Flashcards',
        description: 'Create and study flashcard decks',
        icon: 'BookOpen',
        category: 'utility',
        component: 'Flashcards',
        tags: ['flashcard', 'study', 'learn', 'memorize'],
        implemented: true
    },
    {
        id: 'mood-journal',
        name: 'Mood Journal',
        description: 'Track your daily mood and feelings',
        icon: 'Smile',
        category: 'utility',
        component: 'MoodJournal',
        tags: ['mood', 'journal', 'feelings', 'daily'],
        implemented: true
    },

    // Image & Media
    {
        id: 'favicon-generator',
        name: 'Favicon Generator',
        description: 'Create website favicons from text',
        icon: 'FileImage',
        category: 'image',
        component: 'FaviconGenerator',
        tags: ['favicon', 'icon', 'website', 'logo'],
        implemented: true
    },
    {
        id: 'placeholder-image',
        name: 'Placeholder Image',
        description: 'Create placeholder images for development',
        icon: 'Image',
        category: 'image',
        component: 'PlaceholderImage',
        tags: ['placeholder', 'dummy', 'mockup', 'image'],
        implemented: true
    },
    {
        id: 'image-watermark',
        name: 'Image Watermark',
        description: 'Add text watermark to images',
        icon: 'Type',
        category: 'image',
        component: 'ImageWatermark',
        tags: ['watermark', 'image', 'text', 'protect'],
        implemented: true
    },

    // Developer Tools
    {
        id: 'cron-generator',
        name: 'Cron Expression Generator',
        description: 'Build cron expressions for scheduled tasks',
        icon: 'Clock',
        category: 'developer',
        component: 'CronGenerator',
        tags: ['cron', 'schedule', 'task', 'timer'],
        implemented: true
    },
    {
        id: 'robots-txt-generator',
        name: 'robots.txt Generator',
        description: 'Create robots.txt for search engines',
        icon: 'FileText',
        category: 'developer',
        component: 'RobotsTxtGenerator',
        tags: ['robots', 'seo', 'crawler', 'search'],
        implemented: true
    },
    {
        id: 'ip-address-lookup',
        name: 'IP Address Lookup',
        description: 'Get geolocation info for any IP',
        icon: 'MapPin',
        category: 'developer',
        component: 'IPAddressLookup',
        tags: ['ip', 'geolocation', 'location', 'address'],
        implemented: true
    },

    // ============================================
    // NEW TOOLS BATCH 3 (18 tools - completing 50 total)
    // ============================================

    // Text & Content
    {
        id: 'quote-generator',
        name: 'Quote Generator',
        description: 'Get inspired with random quotes',
        icon: 'Quote',
        category: 'text',
        component: 'QuoteGenerator',
        tags: ['quote', 'inspiration', 'motivation'],
        implemented: true
    },
    {
        id: 'ascii-art-generator',
        name: 'ASCII Art Generator',
        description: 'Convert text to ASCII art',
        icon: 'Type',
        category: 'text',
        component: 'AsciiArtGenerator',
        tags: ['ascii', 'art', 'text', 'font'],
        implemented: true
    },
    {
        id: 'text-diff-checker',
        name: 'Text Diff Checker',
        description: 'Compare two texts and highlight differences',
        icon: 'FileText',
        category: 'text',
        component: 'TextDiffChecker',
        tags: ['diff', 'compare', 'text', 'changes'],
        implemented: true
    },
    {
        id: 'name-generator',
        name: 'Name Generator',
        description: 'Generate creative names for projects',
        icon: 'Sparkles',
        category: 'text',
        component: 'NameGenerator',
        tags: ['name', 'business', 'brand', 'generator'],
        implemented: true
    },
    // Utility
    {
        id: 'water-intake-tracker',
        name: 'Water Intake Tracker',
        description: 'Stay hydrated, track your water intake',
        icon: 'Droplets',
        category: 'utility',
        component: 'WaterIntakeTracker',
        tags: ['water', 'health', 'hydration', 'tracker'],
        implemented: true
    },
    {
        id: 'voice-recorder',
        name: 'Voice Recorder',
        description: 'Record audio notes and memos',
        icon: 'Mic',
        category: 'utility',
        component: 'VoiceRecorder',
        tags: ['voice', 'audio', 'record', 'memo'],
        implemented: true
    },
    {
        id: 'breathing-exercise',
        name: 'Breathing Exercise',
        description: 'Relax with guided breathing patterns',
        icon: 'Wind',
        category: 'utility',
        component: 'BreathingExercise',
        tags: ['breathing', 'relax', 'meditation', 'calm'],
        implemented: true
    },

    {
        id: 'sticky-notes',
        name: 'Sticky Notes',
        description: 'Quick colorful notes',
        icon: 'StickyNote',
        category: 'utility',
        component: 'StickyNotes',
        tags: ['notes', 'sticky', 'memo', 'reminder'],
        implemented: true
    },

    // Math & Finance
    {
        id: 'scientific-calculator',
        name: 'Scientific Calculator',
        description: 'Advanced calculations at your fingertips',
        icon: 'Calculator',
        category: 'math',
        component: 'ScientificCalculator',
        tags: ['calculator', 'math', 'scientific', 'trig'],
        implemented: true
    },
    {
        id: 'fuel-cost-calculator',
        name: 'Fuel Cost Calculator',
        description: 'Calculate trip fuel costs',
        icon: 'Fuel',
        category: 'math',
        component: 'FuelCostCalculator',
        tags: ['fuel', 'gas', 'travel', 'cost'],
        implemented: true
    },
    {
        id: 'aspect-ratio-calculator',
        name: 'Aspect Ratio Calculator',
        description: 'Calculate and scale aspect ratios',
        icon: 'Ruler',
        category: 'math',
        component: 'AspectRatioCalculator',
        tags: ['aspect', 'ratio', 'scale', 'dimension'],
        implemented: true
    },

    // Image & Media

    {
        id: 'color-palette-generator',
        name: 'Color Palette Generator',
        description: 'Generate harmonious color palettes',
        icon: 'Palette',
        category: 'image',
        component: 'ColorPaletteGenerator',
        tags: ['color', 'palette', 'scheme', 'design'],
        implemented: true
    },

    // Developer Tools
    {
        id: 'utm-builder',
        name: 'UTM Builder',
        description: 'Create tracking URLs for campaigns',
        icon: 'Link',
        category: 'developer',
        component: 'UTMBuilder',
        tags: ['utm', 'tracking', 'marketing', 'analytics'],
        implemented: true
    },
    {
        id: 'background-remover',
        name: 'Background Remover',
        description: 'Remove background from images',
        icon: 'Eraser',
        category: 'image',
        component: 'BackgroundRemover',
        tags: ['background', 'remove', 'transparent', 'cutout'],
        implemented: true
    },
    {
        id: 'image-to-transparent',
        name: 'Image to Transparent',
        description: 'Add transparency to images',
        icon: 'Droplets',
        category: 'image',
        component: 'ImageToTransparent',
        tags: ['transparent', 'opacity', 'alpha', 'png'],
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
