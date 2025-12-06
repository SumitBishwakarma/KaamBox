import { NavLink } from 'react-router-dom';
import { Home, FileText, Image, Code, Calculator, Wrench } from 'lucide-react';
import { categories } from '../../data/tools';

const iconMap = {
    FileText, Image, Code, Calculator, Wrench
};

const BottomNav = () => {
    const navItems = [
        { id: 'home', name: 'Home', icon: Home, path: '/' },
        ...categories.slice(0, 4).map(cat => ({
            id: cat.id,
            name: cat.name.split(' ')[0], // Just first word for mobile
            icon: iconMap[cat.icon] || FileText,
            path: `/?category=${cat.id}`,
            color: cat.color
        }))
    ];

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-secondary)]/95 backdrop-blur-lg border-t border-[var(--border-color)]">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all
                ${isActive
                                    ? 'text-blue-500'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}
              `}
                        >
                            <Icon size={20} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
