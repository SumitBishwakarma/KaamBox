import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';
import AdContainer from './AdContainer';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            {/* Top Banner Ad */}
            <div className="hidden md:flex justify-center py-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <AdContainer type="banner" />
            </div>

            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content Area */}
            <div className="lg:ml-64 min-h-screen flex">
                {/* Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <Header onMenuClick={() => setSidebarOpen(true)} />

                    {/* Page Content */}
                    <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">
                        <Outlet />
                    </main>
                </div>

                {/* Right Sidebar Ad (Desktop) */}
                <aside className="hidden xl:block w-[320px] p-4 border-l border-[var(--border-color)]">
                    <div className="sticky top-20">
                        <AdContainer type="sidebar" />
                    </div>
                </aside>
            </div>

            {/* Bottom Navigation (Mobile) */}
            <BottomNav />

            {/* Mobile Sticky Ad */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 flex justify-center bg-[var(--bg-secondary)]/95 backdrop-blur border-t border-[var(--border-color)]">
                <AdContainer type="sticky" />
            </div>
        </div>
    );
};

export default MainLayout;
