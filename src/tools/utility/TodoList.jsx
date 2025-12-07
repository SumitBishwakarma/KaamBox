import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, CheckCircle, Circle, List, Calendar } from 'lucide-react';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const saved = localStorage.getItem('todoList');
        if (saved) setTodos(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (!newTodo.trim()) return;

        setTodos([...todos, {
            id: Date.now(),
            text: newTodo,
            completed: false,
            createdAt: new Date().toISOString()
        }]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const clearCompleted = () => {
        setTodos(todos.filter(todo => !todo.completed));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const completedCount = todos.filter(t => t.completed).length;
    const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Todo List</h2>
                <p className="text-[var(--text-muted)] text-sm">Organize your tasks</p>
            </div>

            <div className="space-y-4">
                {/* Progress */}
                {todos.length > 0 && (
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="flex justify-between text-sm mb-2">
                            <span>{completedCount} of {todos.length} done</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-green-500 rounded-full"
                            />
                        </div>
                    </div>
                )}

                {/* Add Todo */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="Add a new task..."
                        className="input flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addTodo}
                        className="btn-primary px-4"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 justify-center">
                    {['all', 'active', 'completed'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-lg text-sm capitalize transition-colors ${filter === f ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Todo List */}
                {filteredTodos.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>{filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks`}</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredTodos.map(todo => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${todo.completed
                                        ? 'bg-green-500/10'
                                        : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleTodo(todo.id)}
                                    className="shrink-0"
                                >
                                    {todo.completed ? (
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <Circle className="w-6 h-6 text-[var(--text-muted)]" />
                                    )}
                                </motion.button>

                                <div className="flex-1">
                                    <p className={`${todo.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                                        {todo.text}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(todo.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteTodo(todo.id)}
                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Clear Completed */}
                {completedCount > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearCompleted}
                        className="w-full p-3 rounded-xl bg-red-500/20 text-red-400 text-sm"
                    >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Clear {completedCount} completed task{completedCount > 1 ? 's' : ''}
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default TodoList;
