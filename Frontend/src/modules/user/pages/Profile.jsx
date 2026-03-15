import { useAuth } from '../../../context/AuthContext';
import { useWallet } from '../../../context/WalletContext';
import { User, Mail, Shield, LogOut, Settings, CreditCard, History, ChevronRight, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const { balance, transactions } = useWallet();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-4 max-w-sm w-full">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <User size={28} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-serif text-secondary">Please Sign In</h2>
                    <p className="text-slate-400 text-sm">Access your profile and bookings by signing in.</p>
                    <button onClick={() => navigate('/login')}
                        className="w-full bg-secondary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        Sign In Now
                    </button>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Bookings', value: transactions.filter(t => t.type === 'debit').length },
        { label: 'Wallet', value: `₹${balance.toLocaleString()}` },
        { label: 'Rating', value: '4.9' },
    ];

    const menuItems = [
        { name: 'My Bookings', desc: 'View your stays & history', icon: History, path: '/profile/bookings', color: 'text-purple-500 bg-purple-50' },
        { name: 'Wallet', desc: 'Balance & transactions', icon: CreditCard, path: '/wallet', color: 'text-emerald-500 bg-emerald-50' },
        { name: 'Account Details', desc: 'Edit your profile info', icon: Settings, path: '/profile/details', color: 'text-blue-500 bg-blue-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10">
            {/* Hero Profile Card */}
            <div className="relative bg-secondary overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 10% 90%, #c9a84c 0%, transparent 40%), radial-gradient(circle at 90% 10%, #c9a84c 0%, transparent 40%)' }} />

                <div className="relative z-10 px-6 pt-12 pb-20">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 bg-primary/20 border-2 border-primary/40 rounded-2xl flex items-center justify-center text-white font-serif text-2xl font-black">
                                {user.name[0]}
                            </div>
                            <div>
                                <h1 className="text-white font-bold text-xl">{user.name}</h1>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Shield size={11} className="text-primary" />
                                    <span className="text-primary text-[9px] font-black uppercase tracking-widest">{user.role} Member</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <Mail size={10} className="text-white/50" />
                                    <span className="text-white/50 text-[9px]">{user.email}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-lg px-2 py-1">
                            <Star size={10} className="text-primary" fill="currentColor" />
                            <span className="text-primary text-[9px] font-black">Premium</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
                        {stats.map(({ label, value }) => (
                            <div key={label} className="text-center">
                                <p className="text-white font-black text-lg">{value}</p>
                                <p className="text-white/40 text-[8px] font-bold uppercase tracking-widest mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu below hero */}
            <div className="px-4 -mt-10 relative z-10 space-y-3">
                {/* Loyalty Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] font-black text-primary uppercase tracking-widest">Ananya Loyalty</p>
                            <p className="text-secondary font-serif text-base mt-0.5">Gold Tier Member</p>
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map(i => <Star key={i} size={14} fill="currentColor" className="text-amber-400" />)}
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5">
                        <MapPin size={10} className="text-slate-400" />
                        <span className="text-[9px] text-slate-400 font-medium">Digha, West Bengal</span>
                    </div>
                </div>

                {/* Menu Items */}
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.name} onClick={() => navigate(item.path)}
                            className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between hover:border-primary/30 hover:shadow-md transition-all group active:scale-[0.99]">
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center`}>
                                    <Icon size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-secondary text-sm">{item.name}</p>
                                    <p className="text-slate-400 text-[10px] mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                        </button>
                    );
                })}

                {/* Logout */}
                <button onClick={() => { logout(); navigate('/login'); }}
                    className="w-full bg-red-50 rounded-2xl border border-red-100 p-5 flex items-center justify-between hover:bg-red-100 transition-all group active:scale-[0.99]">
                    <div className="flex items-center gap-4 text-red-500">
                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-red-100">
                            <LogOut size={18} />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-sm">Sign Out</p>
                            <p className="text-red-400 text-[10px] mt-0.5">See you soon!</p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-red-300" />
                </button>
            </div>
        </div>
    );
};

export default Profile;

