import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { RefreshCcw } from 'lucide-react';

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">
                <Outlet />
                {/* Global Refresh Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="fixed bottom-[85px] right-6 md:bottom-10 md:right-10 z-[200] bg-white/90 backdrop-blur-xl border border-slate-100 p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all text-primary group group-active:rotate-180"
                    title="Refresh Page"
                >
                    <RefreshCcw size={20} className="group-hover:rotate-180 transition-all duration-700 ease-in-out" />
                </button>
            </main>
            <BottomNavbar />
        </div>
    );
};

export default UserLayout;
