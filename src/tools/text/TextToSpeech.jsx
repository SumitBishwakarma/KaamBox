import { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
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
    const { toast } = useToast();

    // Load available voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice) {
                // Try to find an English voice
                const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
                setSelectedVoice(englishVoice?.name || availableVoices[0].name);
            }
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            speechSynthesis.cancel();
        };
    }, []);

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

    // Group voices by language
    const groupedVoices = voices.reduce((acc, voice) => {
        const lang = voice.lang.split('-')[0].toUpperCase();
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
                    className="textarea-field !min-h-[150px]"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                    {text.length} characters
                </p>
            </div>

            {/* Voice Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Voice
                    </label>
                    <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="input-field"
                    >
                        {Object.entries(groupedVoices).map(([lang, voices]) => (
                            <optgroup key={lang} label={lang}>
                                {voices.map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name} {voice.localService ? '(Local)' : ''}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Volume: {Math.round(volume * 100)}%
                    </label>
                    <div className="flex items-center gap-3">
                        <VolumeX size={18} className="text-[var(--text-muted)]" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <Volume2 size={18} className="text-[var(--text-muted)]" />
                    </div>
                </div>
            </div>

            {/* Rate and Pitch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                        <span>Slower</span>
                        <span>Faster</span>
                    </div>
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
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                        <span>Lower</span>
                        <span>Higher</span>
                    </div>
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

            {/* Status */}
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
