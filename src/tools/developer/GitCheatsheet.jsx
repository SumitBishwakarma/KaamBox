import { useState, useMemo } from 'react';
import { Search, Copy, GitBranch } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const gitCommands = [
    {
        category: 'Setup & Config', commands: [
            { cmd: 'git init', desc: 'Initialize a new Git repository' },
            { cmd: 'git clone <url>', desc: 'Clone a repository from URL' },
            { cmd: 'git config --global user.name "Name"', desc: 'Set global username' },
            { cmd: 'git config --global user.email "email"', desc: 'Set global email' },
            { cmd: 'git config --list', desc: 'List all configurations' }
        ]
    },
    {
        category: 'Basic Snapshotting', commands: [
            { cmd: 'git status', desc: 'Show working tree status' },
            { cmd: 'git add <file>', desc: 'Add file to staging area' },
            { cmd: 'git add .', desc: 'Add all changes to staging' },
            { cmd: 'git commit -m "message"', desc: 'Commit staged changes with message' },
            { cmd: 'git commit -am "message"', desc: 'Add and commit in one step' },
            { cmd: 'git diff', desc: 'Show changes not staged' },
            { cmd: 'git diff --staged', desc: 'Show staged changes' },
            { cmd: 'git rm <file>', desc: 'Remove file from Git' },
            { cmd: 'git mv <old> <new>', desc: 'Rename/move a file' }
        ]
    },
    {
        category: 'Branching', commands: [
            { cmd: 'git branch', desc: 'List all local branches' },
            { cmd: 'git branch <name>', desc: 'Create new branch' },
            { cmd: 'git branch -d <name>', desc: 'Delete branch' },
            { cmd: 'git branch -m <old> <new>', desc: 'Rename branch' },
            { cmd: 'git checkout <branch>', desc: 'Switch to branch' },
            { cmd: 'git checkout -b <name>', desc: 'Create and switch to new branch' },
            { cmd: 'git switch <branch>', desc: 'Switch to branch (newer syntax)' },
            { cmd: 'git switch -c <name>', desc: 'Create and switch (newer syntax)' }
        ]
    },
    {
        category: 'Merging', commands: [
            { cmd: 'git merge <branch>', desc: 'Merge branch into current' },
            { cmd: 'git merge --abort', desc: 'Abort current merge' },
            { cmd: 'git rebase <branch>', desc: 'Rebase current branch onto another' },
            { cmd: 'git rebase --abort', desc: 'Abort current rebase' },
            { cmd: 'git cherry-pick <commit>', desc: 'Apply specific commit' }
        ]
    },
    {
        category: 'Remote', commands: [
            { cmd: 'git remote -v', desc: 'List remote repositories' },
            { cmd: 'git remote add <name> <url>', desc: 'Add remote repository' },
            { cmd: 'git fetch <remote>', desc: 'Download remote changes' },
            { cmd: 'git pull', desc: 'Fetch and merge remote changes' },
            { cmd: 'git pull --rebase', desc: 'Fetch and rebase instead of merge' },
            { cmd: 'git push', desc: 'Push commits to remote' },
            { cmd: 'git push -u origin <branch>', desc: 'Push and set upstream' },
            { cmd: 'git push --force', desc: 'Force push (use carefully!)' }
        ]
    },
    {
        category: 'History', commands: [
            { cmd: 'git log', desc: 'Show commit history' },
            { cmd: 'git log --oneline', desc: 'Compact commit history' },
            { cmd: 'git log --graph', desc: 'Show branch graph' },
            { cmd: 'git log -p', desc: 'Show commits with diffs' },
            { cmd: 'git show <commit>', desc: 'Show specific commit details' },
            { cmd: 'git blame <file>', desc: 'Show who changed each line' },
            { cmd: 'git reflog', desc: 'Show reference log' }
        ]
    },
    {
        category: 'Undoing Changes', commands: [
            { cmd: 'git reset <file>', desc: 'Unstage file' },
            { cmd: 'git reset --soft HEAD~1', desc: 'Undo last commit, keep changes staged' },
            { cmd: 'git reset --hard HEAD~1', desc: 'Undo last commit, discard changes' },
            { cmd: 'git checkout -- <file>', desc: 'Discard file changes' },
            { cmd: 'git restore <file>', desc: 'Discard file changes (newer syntax)' },
            { cmd: 'git restore --staged <file>', desc: 'Unstage file (newer syntax)' },
            { cmd: 'git revert <commit>', desc: 'Create commit that undoes changes' },
            { cmd: 'git clean -fd', desc: 'Remove untracked files and dirs' }
        ]
    },
    {
        category: 'Stashing', commands: [
            { cmd: 'git stash', desc: 'Stash current changes' },
            { cmd: 'git stash save "message"', desc: 'Stash with description' },
            { cmd: 'git stash list', desc: 'List all stashes' },
            { cmd: 'git stash pop', desc: 'Apply and remove latest stash' },
            { cmd: 'git stash apply', desc: 'Apply stash without removing' },
            { cmd: 'git stash drop', desc: 'Delete latest stash' },
            { cmd: 'git stash clear', desc: 'Delete all stashes' }
        ]
    },
    {
        category: 'Tags', commands: [
            { cmd: 'git tag', desc: 'List all tags' },
            { cmd: 'git tag <name>', desc: 'Create lightweight tag' },
            { cmd: 'git tag -a <name> -m "msg"', desc: 'Create annotated tag' },
            { cmd: 'git push --tags', desc: 'Push all tags to remote' },
            { cmd: 'git tag -d <name>', desc: 'Delete local tag' }
        ]
    }
];

const GitCheatsheet = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const { toast } = useToast();

    const filteredCommands = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return gitCommands
            .map(cat => ({
                ...cat,
                commands: cat.commands.filter(c =>
                    (selectedCategory === 'all' || cat.category === selectedCategory) &&
                    (c.cmd.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query))
                )
            }))
            .filter(cat => cat.commands.length > 0);
    }, [searchQuery, selectedCategory]);

    const copyCommand = (cmd) => {
        navigator.clipboard.writeText(cmd);
        toast.success('Command copied');
    };

    const categories = ['all', ...gitCommands.map(c => c.category)];
    const totalCommands = gitCommands.reduce((acc, c) => acc + c.commands.length, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search commands..."
                        className="input-field pl-10"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field sm:w-48"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>
                            {cat === 'all' ? `All (${totalCommands})` : cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-6">
                {filteredCommands.map((cat) => (
                    <div key={cat.category}>
                        <div className="flex items-center gap-2 mb-3">
                            <GitBranch size={18} className="text-blue-400" />
                            <h3 className="font-medium">{cat.category}</h3>
                            <span className="text-xs text-[var(--text-muted)]">({cat.commands.length})</span>
                        </div>
                        <div className="space-y-2">
                            {cat.commands.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <code className="text-blue-400 font-mono text-sm">{c.cmd}</code>
                                        <p className="text-sm text-[var(--text-muted)] mt-0.5">{c.desc}</p>
                                    </div>
                                    <button
                                        onClick={() => copyCommand(c.cmd)}
                                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-tertiary)] rounded transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredCommands.length === 0 && (
                    <p className="text-center text-[var(--text-muted)] py-8">
                        No commands found matching "{searchQuery}"
                    </p>
                )}
            </div>
        </div>
    );
};

export default GitCheatsheet;
