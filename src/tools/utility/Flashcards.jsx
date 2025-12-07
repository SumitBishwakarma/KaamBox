import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Trash2, Shuffle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const Flashcards = () => {
    const [decks, setDecks] = useState([]);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [newDeckName, setNewDeckName] = useState('');
    const [newFront, setNewFront] = useState('');
    const [newBack, setNewBack] = useState('');
    const [showAddCard, setShowAddCard] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('flashcards');
        if (saved) setDecks(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('flashcards', JSON.stringify(decks));
    }, [decks]);

    const createDeck = () => {
        if (!newDeckName.trim()) return;
        setDecks([...decks, { id: Date.now(), name: newDeckName, cards: [] }]);
        setNewDeckName('');
    };

    const deleteDeck = (id) => {
        setDecks(decks.filter(d => d.id !== id));
        if (currentDeck?.id === id) setCurrentDeck(null);
    };

    const addCard = () => {
        if (!newFront.trim() || !newBack.trim() || !currentDeck) return;

        const updatedDecks = decks.map(d => {
            if (d.id === currentDeck.id) {
                return { ...d, cards: [...d.cards, { id: Date.now(), front: newFront, back: newBack }] };
            }
            return d;
        });

        setDecks(updatedDecks);
        setCurrentDeck(updatedDecks.find(d => d.id === currentDeck.id));
        setNewFront('');
        setNewBack('');
        setShowAddCard(false);
    };

    const deleteCard = (cardId) => {
        const updatedDecks = decks.map(d => {
            if (d.id === currentDeck.id) {
                return { ...d, cards: d.cards.filter(c => c.id !== cardId) };
            }
            return d;
        });
        setDecks(updatedDecks);
        setCurrentDeck(updatedDecks.find(d => d.id === currentDeck.id));
    };

    const shuffleCards = () => {
        if (!currentDeck) return;
        const shuffled = [...currentDeck.cards].sort(() => Math.random() - 0.5);
        const updatedDecks = decks.map(d => d.id === currentDeck.id ? { ...d, cards: shuffled } : d);
        setDecks(updatedDecks);
        setCurrentDeck({ ...currentDeck, cards: shuffled });
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const nextCard = () => {
        if (currentDeck && currentCardIndex < currentDeck.cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Flashcards</h2>
                <p className="text-[var(--text-muted)] text-sm">Create and study flashcard decks</p>
            </div>

            <div className="space-y-4">
                {!currentDeck ? (
                    <>
                        {/* Create New Deck */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newDeckName}
                                onChange={(e) => setNewDeckName(e.target.value)}
                                placeholder="New deck name..."
                                className="input flex-1"
                                onKeyPress={(e) => e.key === 'Enter' && createDeck()}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={createDeck}
                                className="btn-primary px-4"
                            >
                                <Plus className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Deck List */}
                        {decks.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No decks yet. Create one above!</p>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {decks.map(deck => (
                                    <motion.div
                                        key={deck.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl cursor-pointer"
                                        onClick={() => { setCurrentDeck(deck); setCurrentCardIndex(0); setIsFlipped(false); }}
                                    >
                                        <div>
                                            <p className="font-medium">{deck.name}</p>
                                            <p className="text-sm text-[var(--text-muted)]">{deck.cards.length} cards</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Back Button */}
                        <button
                            onClick={() => setCurrentDeck(null)}
                            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back to Decks
                        </button>

                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{currentDeck.name}</h3>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={shuffleCards}
                                    className="p-2 rounded-lg bg-[var(--bg-tertiary)]"
                                    title="Shuffle"
                                >
                                    <Shuffle className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowAddCard(!showAddCard)}
                                    className="p-2 rounded-lg bg-[var(--bg-tertiary)]"
                                >
                                    <Plus className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Add Card Form */}
                        {showAddCard && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-[var(--bg-tertiary)] rounded-xl space-y-2"
                            >
                                <input
                                    type="text"
                                    value={newFront}
                                    onChange={(e) => setNewFront(e.target.value)}
                                    placeholder="Front (question)..."
                                    className="input w-full"
                                />
                                <input
                                    type="text"
                                    value={newBack}
                                    onChange={(e) => setNewBack(e.target.value)}
                                    placeholder="Back (answer)..."
                                    className="input w-full"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={addCard}
                                    className="btn-primary w-full"
                                >
                                    Add Card
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Flashcard Display */}
                        {currentDeck.cards.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <p>No cards in this deck. Add some!</p>
                            </div>
                        ) : (
                            <>
                                <motion.div
                                    onClick={() => setIsFlipped(!isFlipped)}
                                    className="relative h-48 cursor-pointer perspective-1000"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute w-full h-full"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        <div className={`absolute w-full h-full flex items-center justify-center p-6 rounded-2xl text-center text-xl font-medium ${isFlipped ? 'bg-green-500/20' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                                            }`}>
                                            {isFlipped ? currentDeck.cards[currentCardIndex]?.back : currentDeck.cards[currentCardIndex]?.front}
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <p className="text-center text-sm text-[var(--text-muted)]">
                                    {isFlipped ? 'Answer' : 'Question'} - Click to flip
                                </p>

                                <div className="flex items-center justify-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={prevCard}
                                        disabled={currentCardIndex === 0}
                                        className="p-3 rounded-xl bg-[var(--bg-tertiary)] disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </motion.button>
                                    <span className="text-lg font-medium">
                                        {currentCardIndex + 1} / {currentDeck.cards.length}
                                    </span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={nextCard}
                                        disabled={currentCardIndex === currentDeck.cards.length - 1}
                                        className="p-3 rounded-xl bg-[var(--bg-tertiary)] disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Flashcards;
