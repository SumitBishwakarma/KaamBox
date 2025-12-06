import { useState } from 'react';
import { Copy, Database, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SQLFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [uppercase, setUppercase] = useState(true);
    const [indentSize, setIndentSize] = useState(2);
    const { toast } = useToast();

    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'INSERT', 'INTO', 'VALUES',
        'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP',
        'INDEX', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS',
        'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION',
        'ALL', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'CASE',
        'WHEN', 'THEN', 'ELSE', 'END', 'NULL', 'NOT', 'IN', 'LIKE',
        'BETWEEN', 'EXISTS', 'IS', 'TRUE', 'FALSE', 'ASC', 'DESC',
        'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'DEFAULT',
        'AUTO_INCREMENT', 'VARCHAR', 'INT', 'INTEGER', 'TEXT', 'BOOLEAN',
        'DATE', 'DATETIME', 'TIMESTAMP', 'FLOAT', 'DOUBLE', 'DECIMAL'
    ];

    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN',
        'INNER JOIN', 'OUTER JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT',
        'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE',
        'ALTER TABLE', 'DROP TABLE', 'UNION', 'AND', 'OR'];

    const formatSQL = () => {
        if (!input.trim()) {
            toast.warning('Please enter SQL query');
            return;
        }

        let sql = input.trim();
        const indent = ' '.repeat(indentSize);

        // Normalize whitespace
        sql = sql.replace(/\s+/g, ' ');

        // Add newlines before major keywords
        majorKeywords.forEach(kw => {
            const regex = new RegExp(`\\s+${kw}\\s+`, 'gi');
            sql = sql.replace(regex, `\n${uppercase ? kw.toUpperCase() : kw.toLowerCase()} `);
        });

        // Format commas in SELECT
        sql = sql.replace(/,\s*/g, ',\n' + indent);

        // Handle parentheses for subqueries
        let depth = 0;
        let formatted = '';
        for (let i = 0; i < sql.length; i++) {
            const char = sql[i];
            if (char === '(') {
                depth++;
                formatted += char + '\n' + indent.repeat(depth);
            } else if (char === ')') {
                depth = Math.max(0, depth - 1);
                formatted += '\n' + indent.repeat(depth) + char;
            } else {
                formatted += char;
            }
        }
        sql = formatted;

        // Apply case to keywords
        if (uppercase) {
            keywords.forEach(kw => {
                const regex = new RegExp(`\\b${kw}\\b`, 'gi');
                sql = sql.replace(regex, kw.toUpperCase());
            });
        } else {
            keywords.forEach(kw => {
                const regex = new RegExp(`\\b${kw}\\b`, 'gi');
                sql = sql.replace(regex, kw.toLowerCase());
            });
        }

        // Clean up extra whitespace
        sql = sql.replace(/\n\s*\n/g, '\n');
        sql = sql.trim();

        setOutput(sql);
        toast.success('SQL formatted');
    };

    const minifySQL = () => {
        if (!input.trim()) {
            toast.warning('Please enter SQL query');
            return;
        }

        let sql = input.trim();
        sql = sql.replace(/\s+/g, ' ');
        sql = sql.replace(/\s*,\s*/g, ',');
        sql = sql.replace(/\s*\(\s*/g, '(');
        sql = sql.replace(/\s*\)\s*/g, ')');

        setOutput(sql);
        toast.success('SQL minified');
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
    };

    const sampleSQL = `SELECT users.id, users.name, users.email, orders.order_date, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE users.status = 'active' AND orders.total > 100 ORDER BY orders.order_date DESC LIMIT 10`;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Input SQL
                        </label>
                        <button
                            onClick={() => setInput(sampleSQL)}
                            className="text-xs text-blue-400 hover:underline"
                        >
                            Load Sample
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your SQL query here..."
                        className="textarea-field !min-h-[250px] font-mono text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Formatted Output
                    </label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Formatted SQL will appear here..."
                        className="textarea-field !min-h-[250px] font-mono text-sm bg-[var(--bg-tertiary)]"
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={uppercase}
                        onChange={(e) => setUppercase(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-sm">Uppercase Keywords</span>
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-sm">Indent:</span>
                    <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(parseInt(e.target.value))}
                        className="input-field !w-20 !py-1"
                    >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={formatSQL} className="btn-primary">
                    <Database size={18} />
                    Format
                </button>
                <button onClick={minifySQL} className="btn-secondary">
                    Minify
                </button>
                <button onClick={copyOutput} className="btn-secondary" disabled={!output}>
                    <Copy size={18} />
                    Copy
                </button>
                <button onClick={clearAll} className="btn-secondary">
                    <Trash2 size={18} />
                    Clear
                </button>
            </div>
        </div>
    );
};

export default SQLFormatter;
