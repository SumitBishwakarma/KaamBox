import { useState } from 'react';
import { Plus, Trash2, Check, Circle, GripVertical } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

const TodoList = () => {
    const [todos, setTodos] = useLocalStorage('kaambox-todos', []);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, completed
    const { toast } = useToast();

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const todo = {
            id: Date.now(),
            text: newTodo.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTodos([todo, ...todos]);
        setNewTodo('');
        toast.success('Task added');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
        toast.info('Task deleted');
    };

    const clearCompleted = () => {
        const count = todos.filter(t => t.completed).length;
        setTodos(todos.filter(todo => !todo.completed));
        toast.success(`Cleared ${count} completed tasks`);
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const activeCount = todos.filter(t => !t.completed).length;
    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Add Todo Form */}
            <form onSubmit={addTodo} className="flex gap-3">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="What needs to be done?"
                    className="input-field flex-1"
                    autoFocus
                />
                <button type="submit" className="btn-primary">
                    <Plus size={20} />
                    Add
                </button>
            </form>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">
                    {activeCount} active, {completedCount} completed
                </span>
                {completedCount > 0 && (
                    <button
                        onClick={clearCompleted}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        Clear completed
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
                {[
                    { key: 'all', label: 'All' },
                    { key: 'active', label: 'Active' },
                    { key: 'completed', label: 'Completed' }
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${filter === f.key
                                ? 'bg-blue-500 text-white'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Todo List */}
            <div className="space-y-2">
                {filteredTodos.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        {filter === 'all' && 'No tasks yet. Add one above!'}
                        {filter === 'active' && 'No active tasks. Great job!'}
                        {filter === 'completed' && 'No completed tasks yet.'}
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`group flex items-center gap-3 p-4 bg-[var(--bg-tertiary)] rounded-xl transition-all ${todo.completed ? 'opacity-60' : ''
                                }`}
                        >
                            {/* Drag Handle (visual only for now) */}
                            <GripVertical size={16} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 cursor-grab" />

                            {/* Checkbox */}
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-[var(--border-color)] hover:border-green-500'
                                    }`}
                            >
                                {todo.completed && <Check size={14} className="text-white" />}
                            </button>

                            {/* Text */}
                            <span className={`flex-1 ${todo.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                                {todo.text}
                            </span>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Progress */}
            {todos.length > 0 && (
                <div>
                    <div className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
                        <span>Progress</span>
                        <span>{Math.round((completedCount / todos.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${(completedCount / todos.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Info */}
            <p className="text-center text-sm text-[var(--text-muted)]">
                Your tasks are saved locally in your browser
            </p>
        </div>
    );
};

export default TodoList;
