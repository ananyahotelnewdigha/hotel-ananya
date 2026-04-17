import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Bed, Ticket, Users, Wallet, LogOut,
    Settings, ShieldCheck, Tag, Zap, Percent, Building2, HardDrive, Image, Layers, Menu, X as CloseIcon, MessageSquare, Scale, Copy, Lock, Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, role, isSuperAdmin, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lockedSections, setLockedSections] = useState([]);
    const [masterPasscode, setMasterPasscode] = useState('123456');
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [passInput, setPassInput] = useState('');
    const [targetLink, setTargetLink] = useState(null);

    useEffect(() => {
        api.get('/setup/property').then(res => {
            const locks = res.data.lockedSections || [];
            setLockedSections(locks);
            setMasterPasscode(res.data.masterPasscode || '123456');

            if (role === 'admin') {
                const allLinks = allSections.flatMap(s => s.links);
                const currentSection = allLinks.find(l => l.path === location.pathname);
                if (currentSection && locks.includes(currentSection.id)) {
                    navigate('/admin');
                }
            }
        }).catch(err => console.error(err));
    }, [location.pathname, role]);

    const allSections = [
        {
            title: 'Governance',
            role: ['admin', 'superadmin'],
            links: [
                { id: 'control', name: 'Admin Control', path: '/admin/control', icon: ShieldCheck },
            ]
        },
        {
            title: 'Operations',
            links: [
                { id: 'insights', name: 'Insights', path: '/admin', icon: LayoutDashboard },
                { id: 'bookings', name: 'Bookings', path: '/admin/bookings', icon: Ticket },
                { id: 'users', name: 'Guest Ledger', path: '/admin/users', icon: Users },
                { id: 'wallet', name: 'Financials', path: '/admin/wallet', icon: Wallet },
            ]
        },
        {
            title: 'Inventory',
            links: [
                { id: 'rooms', name: 'Room Types', path: '/admin/rooms', icon: Bed },
                { id: 'variants', name: 'Room Variants', path: '/admin/rooms/variants', icon: Layers },
                { id: 'availability', name: 'Availability', path: '/admin/inventory/availability', icon: HardDrive },
                { id: 'bulk_update', name: 'Bulk Update', path: '/admin/inventory/bulk-update', icon: Copy },
                { id: 'rates', name: 'Yield Rates', path: '/admin/inventory/rates', icon: Zap },
                { id: 'pricing', name: 'Yield Management', path: '/admin/setup/pricing', icon: Tag },
            ]
        },
        {
            title: 'Configuration',
            links: [
                { id: 'discounts', name: 'Promotions', path: '/admin/discounts', icon: Tag },
                { id: 'taxes', name: 'Tax Registry', path: '/admin/setup/taxes', icon: Percent },
                { id: 'charges', name: 'Service Charges', path: '/admin/setup/charges', icon: ShieldCheck },
                { id: 'rate_plans', name: 'Rate Plans', path: '/admin/setup/rate-plans', icon: Zap },
                { id: 'messages', name: 'Guest Feedback', path: '/admin/messages', icon: MessageSquare },
                { id: 'terms', name: 'Legal Protocols', path: '/admin/setup/terms', icon: Scale },
                { id: 'media', name: 'Media Assets', path: '/admin/media', icon: Image },
                { id: 'payments', name: 'Payment Setups', path: '/admin/setup/payments', icon: Wallet },
                { id: 'property', name: 'Property Info', path: '/admin/setup/property', icon: Building2 },
                { id: 'services', name: 'Other Services', path: '/admin/services', icon: Building2 },
            ]
        }
    ];

    const handleLinkClick = (e, link) => {
        if (link.id === 'control' && role === 'admin') {
            if (sessionStorage.getItem('is_admin_unlocked') === 'true') return;
            e.preventDefault();
            setTargetLink(link);
            setIsPassModalOpen(true);
        }
    };

    const verifyPasscode = () => {
        if (passInput === masterPasscode) {
            sessionStorage.setItem('is_admin_unlocked', 'true');
            if (targetLink) navigate(targetLink.path);
            setIsPassModalOpen(false);
            setPassInput('');
        } else {
            alert("Security Breach Detected: Invalid Credentials");
            setPassInput('');
        }
    };

    const filteredSections = allSections
        .filter(section => !section.role || section.role.includes(role))
        .map(section => ({
            ...section,
            links: section.links.filter(link => {
                if (isSuperAdmin) return true;
                return !lockedSections.includes(link.id);
            })
        }))
        .filter(section => section.links.length > 0);

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar Overlay (Mobile only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-secondary text-white flex flex-col shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 border-b border-white/5 flex flex-col items-center shrink-0 relative">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
                    >
                        <CloseIcon size={20} />
                    </button>
                    <img src="/logo.png" alt="Ananya Hotel" className="h-10 w-auto brightness-0 invert mb-3" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary">Intelligence Portal</span>
                    </div>
                </div>

                <nav className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 mt-2">
                    {filteredSections.map((section) => (
                        <div key={section.title} className="space-y-3">
                            <h3 className="px-4 text-[10px] uppercase font-black tracking-[0.2em] text-white/30">{section.title}</h3>
                            <div className="space-y-1">
                                {section.links.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    const isLocked = lockedSections.includes(link.id);
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={(e) => handleLinkClick(e, link)}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                                ? 'bg-primary text-secondary shadow-lg shadow-primary/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon size={18} className={`${isActive ? 'text-secondary' : 'text-primary/60 group-hover:text-primary'} transition-colors`} />
                                            <span className="text-sm font-bold tracking-tight whitespace-nowrap">{link.name}</span>
                                            {isLocked && isSuperAdmin && <Lock size={12} className="text-rose-500 animate-pulse ml-auto" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-secondary/50 backdrop-blur-xl">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center space-x-3 w-full px-4 py-3.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-500 group shadow-inner"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest leading-none">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col overflow-hidden min-w-0 relative">
                <header className="bg-white/90 backdrop-blur-xl h-16 lg:h-20 border-b border-slate-100 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-secondary lg:hidden hover:bg-primary hover:text-white transition-all active:scale-95 flex items-center justify-center shrink-0"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex flex-col min-w-0">
                            <p className="text-[7px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Node</p>
                            <h1 className="text-xs lg:text-xl font-black text-secondary lowercase capitalize tracking-tighter truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Insights Overview'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-6">


                        <div className="hidden md:flex items-center gap-3 pr-4 lg:pr-6 border-r border-slate-100">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-secondary leading-none">Security Protocol</p>
                                <p className="text-[8px] text-emerald-500 font-bold mt-1 uppercase">Active</p>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck size={16} />
                            </div>
                        </div>

                        <div
                            onClick={() => navigate('/admin/profile')}
                            className="flex items-center space-x-2 lg:space-x-4 group cursor-pointer"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-extrabold text-secondary group-hover:text-primary transition-colors italic leading-none truncate max-w-[100px]">{user?.name || 'Super Admin'}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">L1 AUTH</p>
                            </div>
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-secondary text-primary rounded-lg lg:rounded-2xl flex items-center justify-center font-black text-xs lg:text-lg border-2 border-primary/20 group-hover:border-primary transition-all shadow-lg shadow-secondary/10 shrink-0 overflow-hidden">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    user?.name?.[0]?.toUpperCase() || 'SA'
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-4 lg:p-10 bg-slate-50/50 custom-scrollbar scroll-smooth">
                    <Outlet />
                </div>
            </main>

            {/* Custom Security Modal */}
            {isPassModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsPassModalOpen(false)} />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-100">
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-primary/5">
                                <Key size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-secondary lowercase capitalize tracking-tighter mb-2">Master <span className="text-primary italic">Protocol</span></h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Verification Required for Governance Node</p>

                            <div className="space-y-4">
                                <input
                                    type="password"
                                    autoFocus
                                    placeholder="••••••"
                                    value={passInput}
                                    onChange={(e) => setPassInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && verifyPasscode()}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-center text-2xl font-black tracking-[0.5em] text-secondary focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all outline-none placeholder:text-slate-200"
                                />
                                <div className="grid grid-cols-2 gap-3 pt-4">
                                    <button
                                        onClick={() => setIsPassModalOpen(false)}
                                        className="py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={verifyPasscode}
                                        className="bg-primary text-secondary py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:brightness-105 transition-all shadow-xl shadow-primary/20"
                                    >
                                        Establish Access
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 border-t border-slate-100">
                            <p className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                <ShieldCheck size={10} className="text-primary" /> End-to-End Encryption Active
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
