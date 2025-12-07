import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Download, Trash2, Clock } from 'lucide-react';

const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [duration, setDuration] = useState(0);
    const [playingId, setPlayingId] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const newRecording = {
                    id: Date.now(),
                    url: audioUrl,
                    blob: audioBlob,
                    duration,
                    date: new Date().toISOString()
                };
                setRecordings([newRecording, ...recordings]);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);

        } catch (err) {
            console.error('Failed to start recording:', err);
            alert('Could not access microphone. Please allow microphone access.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const deleteRecording = (id) => {
        const recording = recordings.find(r => r.id === id);
        if (recording) {
            URL.revokeObjectURL(recording.url);
        }
        setRecordings(recordings.filter(r => r.id !== id));
    };

    const downloadRecording = (recording) => {
        const link = document.createElement('a');
        link.href = recording.url;
        link.download = `recording_${new Date(recording.date).toISOString().slice(0, 19)}.webm`;
        link.click();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const playRecording = (id) => {
        if (playingId === id) {
            setPlayingId(null);
        } else {
            setPlayingId(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Voice Recorder</h2>
                <p className="text-[var(--text-muted)] text-sm">Record audio notes and memos</p>
            </div>

            <div className="space-y-4">
                {/* Recording Area */}
                <div className="p-8 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl text-center">
                    <motion.div
                        animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="inline-block"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-24 h-24 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500' : 'bg-[var(--accent-primary)]'
                                }`}
                        >
                            {isRecording ? (
                                <Square className="w-10 h-10 text-white" />
                            ) : (
                                <Mic className="w-10 h-10 text-white" />
                            )}
                        </motion.button>
                    </motion.div>

                    <p className="mt-4 text-3xl font-mono font-bold">
                        {formatTime(duration)}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                        {isRecording ? 'Recording...' : 'Tap to record'}
                    </p>

                    {isRecording && (
                        <div className="flex justify-center gap-1 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ scaleY: [1, 2, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-1 h-4 bg-red-500 rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Recordings List */}
                {recordings.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                        <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No recordings yet. Start recording!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Recordings ({recordings.length})</p>
                        {recordings.map(recording => (
                            <motion.div
                                key={recording.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-4 bg-[var(--bg-tertiary)] rounded-xl"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => playRecording(recording.id)}
                                    className="w-10 h-10 rounded-full bg-[var(--accent-primary)] flex items-center justify-center"
                                >
                                    <Play className="w-5 h-5 text-white ml-0.5" />
                                </motion.button>

                                <div className="flex-1">
                                    <audio
                                        src={recording.url}
                                        controls
                                        className="w-full h-8"
                                        style={{ maxHeight: '32px' }}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(recording.duration)}
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => downloadRecording(recording)}
                                        className="p-2 rounded-lg bg-[var(--bg-secondary)]"
                                    >
                                        <Download className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => deleteRecording(recording.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceRecorder;
