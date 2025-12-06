import { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX, Globe, User, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const TextToSpeech = () => {
    const [text, setText] = useState('Hello! Welcome to KaamBox Text to Speech tool. Type or paste any text here and I will read it aloud for you.');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [languageFilter, setLanguageFilter] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');
    const { toast } = useToast();

    // Language names mapping
    const languageNames = {
        'en': 'English',
        'hi': 'Hindi',
        'bn': 'Bengali',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'nl': 'Dutch',
        'pl': 'Polish',
        'tr': 'Turkish',
        'vi': 'Vietnamese',
        'th': 'Thai',
        'id': 'Indonesian',
        'ms': 'Malay',
        'ta': 'Tamil',
        'te': 'Telugu',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'pa': 'Punjabi',
        'ur': 'Urdu'
    };

    // Detect gender from voice name
    const getVoiceGender = (voice) => {
        const name = voice.name.toLowerCase();
        const femaleKeywords = ['female', 'woman', 'girl', 'zira', 'hazel', 'susan', 'linda', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'fiona', 'veena', 'heera'];
        const maleKeywords = ['male', 'man', 'boy', 'david', 'mark', 'james', 'richard', 'daniel', 'george', 'rishi', 'hemant'];

        if (femaleKeywords.some(k => name.includes(k))) return 'female';
        if (maleKeywords.some(k => name.includes(k))) return 'male';
        return 'unknown';
    };

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            const processedVoices = availableVoices.map(voice => ({
                ...voice,
                gender: getVoiceGender(voice),
                langCode: voice.lang.split('-')[0].toLowerCase(),
                langName: languageNames[voice.lang.split('-')[0].toLowerCase()] || voice.lang
            }));
            setVoices(processedVoices);

            if (processedVoices.length > 0 && !selectedVoice) {
                const englishVoice = processedVoices.find(v => v.langCode === 'en');
                setSelectedVoice(englishVoice?.name || processedVoices[0].name);
            }
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            speechSynthesis.cancel();
        };
    }, []);

    // Filter voices
    const filteredVoices = voices.filter(voice => {
        if (languageFilter !== 'all' && voice.langCode !== languageFilter) return false;
        if (genderFilter !== 'all' && voice.gender !== genderFilter) return false;
        return true;
    });

    // Get unique languages
    const availableLanguages = [...new Set(voices.map(v => v.langCode))].sort();

    const speak = () => {
        if (!text.trim()) {
            toast.warning('Please enter some text first');
            return;
        }

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = voices.find(v => v.name === selectedVoice);

        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            setIsSpeaking(false);
            setIsPaused(false);
            toast.error('Speech synthesis error');
        };

        speechSynthesis.speak(utterance);
        toast.info('Speaking...');
    };

    const pause = () => {
        if (isSpeaking && !isPaused) {
            speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const resume = () => {
        if (isPaused) {
            speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const stop = () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    // Quick voice presets
    const voicePresets = [
        { name: 'English (US)', filter: 'en-US' },
        { name: 'English (UK)', filter: 'en-GB' },
        { name: 'Hindi', filter: 'hi' },
        { name: 'Bengali', filter: 'bn' },
        { name: 'Spanish', filter: 'es' },
        { name: 'French', filter: 'fr' },
        { name: 'German', filter: 'de' },
        { name: 'Japanese', filter: 'ja' }
    ];

    const selectPreset = (langFilter) => {
        const matchingVoice = voices.find(v => v.lang.startsWith(langFilter) || v.langCode === langFilter);
        if (matchingVoice) {
            setSelectedVoice(matchingVoice.name);
            toast.success(`Selected: ${matchingVoice.name}`);
        } else {
            toast.warning('Voice not available for this language');
        }
    };

    // Group voices by language
    const groupedVoices = filteredVoices.reduce((acc, voice) => {
        const lang = voice.langName;
        if (!acc[lang]) acc[lang] = [];
        acc[lang].push(voice);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Text Input */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Enter Text to Speak
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste text here..."
                    className="textarea-field !min-h-[120px]"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    {text.length} characters
                </p>
            </div>

            {/* Quick Language Presets */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Quick Language Selection
                </label>
                <div className="flex flex-wrap gap-2">
                    {voicePresets.map((preset) => (
                        <button
                            key={preset.filter}
                            onClick={() => selectPreset(preset.filter)}
                            className="px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        <Globe size={14} className="inline mr-1" />
                        Filter by Language
                    </label>
                    <select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Languages ({voices.length})</option>
                        {availableLanguages.map(lang => (
                            <option key={lang} value={lang}>
                                {languageNames[lang] || lang.toUpperCase()} ({voices.filter(v => v.langCode === lang).length})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        <User size={14} className="inline mr-1" />
                        Filter by Gender
                    </label>
                    <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="input-field"
                    >
                        <option value="all">All Voices</option>
                        <option value="female">Female Voices</option>
                        <option value="male">Male Voices</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Select Voice ({filteredVoices.length})
                    </label>
                    <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="input-field"
                    >
                        {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                            <optgroup key={lang} label={`${lang} (${langVoices.length})`}>
                                {langVoices.map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name} {voice.gender !== 'unknown' ? `(${voice.gender})` : ''} {voice.localService ? '★' : ''}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>

            {/* Voice Info */}
            {selectedVoice && (
                <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-sm">
                    <span className="text-[var(--text-muted)]">Selected: </span>
                    <span className="font-medium">{selectedVoice}</span>
                </div>
            )}

            {/* Rate, Pitch, Volume */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Speed: {rate}x
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Pitch: {pitch}
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Volume: {Math.round(volume * 100)}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
                {!isSpeaking ? (
                    <button onClick={speak} className="btn-primary flex-1 sm:flex-none">
                        <Play size={20} />
                        Speak
                    </button>
                ) : (
                    <>
                        {!isPaused ? (
                            <button onClick={pause} className="btn-secondary flex-1 sm:flex-none">
                                <Pause size={20} />
                                Pause
                            </button>
                        ) : (
                            <button onClick={resume} className="btn-primary flex-1 sm:flex-none">
                                <Play size={20} />
                                Resume
                            </button>
                        )}
                        <button onClick={stop} className="btn-secondary flex-1 sm:flex-none">
                            <Square size={20} />
                            Stop
                        </button>
                    </>
                )}
            </div>

            {/* Speaking Status */}
            {isSpeaking && (
                <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-6 bg-blue-500 rounded-full animate-pulse"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                    <span className="text-blue-400 font-medium">
                        {isPaused ? 'Paused' : 'Speaking...'}
                    </span>
                </div>
            )}

            {/* Voice Stats */}
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-2">Available Voices</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                        <span className="text-[var(--text-muted)]">Total: </span>
                        <span className="font-medium">{voices.length}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Languages: </span>
                        <span className="font-medium">{availableLanguages.length}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Female: </span>
                        <span className="font-medium">{voices.filter(v => v.gender === 'female').length}</span>
                    </div>
                    <div>
                        <span className="text-[var(--text-muted)]">Male: </span>
                        <span className="font-medium">{voices.filter(v => v.gender === 'male').length}</span>
                    </div>
                </div>
            </div>

            {/* Browser Support Note */}
            {voices.length === 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-yellow-400 text-sm">
                        Loading voices... If no voices appear, your browser may not support the Web Speech API.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TextToSpeech;
