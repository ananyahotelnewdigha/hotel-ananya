import { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, Zap, Activity, AlertTriangle, RefreshCcw, Key, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const lockableSections = [
    { id: 'insights', name: 'Insights Dashboard', path: '/admin' },
    { id: 'bookings', name: 'Booking Operations', path: '/admin/bookings' },
    { id: 'users', name: 'Guest Ledger (Users)', path: '/admin/users' },
    { id: 'wallet', name: 'Financial Matrix', path: '/admin/wallet' },
    { id: 'rooms', name: 'Room Architecture', path: '/admin/rooms' },
    { id: 'variants', name: 'Room Variants', path: '/admin/rooms/variants' },
    { id: 'availability', name: 'Inventory Control', path: '/admin/inventory/availability' },
    { id: 'bulk_update', name: 'Bulk Inventory Sync', path: '/admin/inventory/bulk-update' },
    { id: 'rates', name: 'Yield Rates Matrix', path: '/admin/inventory/rates' },
    { id: 'pricing', name: 'Yield Management', path: '/admin/setup/pricing' },
    { id: 'discounts', name: 'Promotional Engine', path: '/admin/discounts' },
    { id: 'taxes', name: 'Tax Registry', path: '/admin/setup/taxes' },
    { id: 'charges', name: 'Service Charges', path: '/admin/setup/charges' },
    { id: 'rate_plans', name: 'Rate Plan Master', path: '/admin/setup/rate-plans' },
    { id: 'messages', name: 'Guest Feedback', path: '/admin/messages' },
    { id: 'terms', name: 'Legal Protocols', path: '/admin/setup/terms' },
    { id: 'media', name: 'Media Asset Library', path: '/admin/media' },
    { id: 'payments', name: 'Payment Gateways', path: '/admin/setup/payments' },
    { id: 'property', name: 'Property Identity', path: '/admin/setup/property' },
    { id: 'services', name: 'Auxiliary Services', path: '/admin/services' },
];

const SuperAdminControl = () => {
    const { isSuperAdmin } = useAuth();
    const [lockedSections, setLockedSections] = useState([]);
    const [masterPasscode, setMasterPasscode] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/setup/property');
            setLockedSections(data.lockedSections || []);
            setMasterPasscode(data.masterPasscode || '123456');
        } catch (error) {
            toast.error("Failed to sync system states");
        } finally {
            setLoading(false);
        }
    };

    const toggleLock = (sectionId) => {
        setLockedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.put('/setup/property', { lockedSections, masterPasscode });
            toast.success("System Governance Updated", {
                icon: '🔒',
                style: { borderRadius: '1rem', background: '#1e293b', color: '#fff' }
            });
        } catch (error) {
            toast.error("Sync Failure");
        } finally {
            setIsSaving(false);
        }
    };

    const lockAll = () => {
        setLockedSections(lockableSections.map(s => s.id));
        toast("Emergency Protocol: All sections selected for restriction", { icon: '⚠️' });
    };

    const unlockAll = () => {
        setLockedSections([]);
        toast("Access Restored: All sections selected for release", { icon: '🔓' });
    };

    const isUnlocked = sessionStorage.getItem('is_admin_unlocked') === 'true';

    if (!isSuperAdmin && !isUnlocked) return <Navigate to="/admin" />;

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-xl lg:text-3xl font-black text-secondary lowercase capitalize tracking-tighter leading-none mb-1">
                        System <span className="text-primary italic">Governance</span>
                    </h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">L4 Unauthorized Access Protection & Protocol Control</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 sm:flex-none bg-primary text-secondary px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 active:scale-95"
                    >
                        {isSaving ? <RefreshCcw size={14} className="animate-spin" /> : <ShieldCheck size={16} />}
                        Sync Protocols
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sm:p-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center shadow-lg">
                                    <Activity size={24} />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-xl font-black text-secondary lowercase capitalize tracking-tight">Access <span className="text-primary italic">Architecture</span></h2>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Toggle visibility and access for standard admin nodes</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={unlockAll} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Unlock All</button>
                                <button onClick={lockAll} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">Lock All</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {lockableSections.map(section => {
                                const isLocked = lockedSections.includes(section.id);
                                return (
                                    <div
                                        key={section.id}
                                        className={`p-5 rounded-[1.8rem] border transition-all duration-500 group flex items-center justify-between ${isLocked ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50/50 border-slate-100 hover:border-primary/20 hover:bg-white'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isLocked ? 'bg-rose-500 text-white rotate-12' : 'bg-white text-slate-400 group-hover:text-primary group-hover:-rotate-6 shadow-sm border border-slate-100'}`}>
                                                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-secondary uppercase tracking-tight leading-none mb-1">{section.name}</p>
                                                <p className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">{section.path}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleLock(section.id)}
                                            className={`relative w-12 h-6 rounded-full transition-all duration-500 border-2 ${isLocked ? 'bg-rose-500 border-rose-500' : 'bg-slate-200 border-slate-200'}`}
                                        >
                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-sm ${isLocked ? 'left-6' : 'left-0.5'}`} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-secondary p-8 rounded-[2.5rem] text-white border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold italic text-primary">Security <span className="text-white">Notice</span></h3>
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mt-2">Critical Operations Policy</p>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed font-medium">Standard administrators will lose access to locked sections immediately upon protocol sync. Super Admins retain persistent access to ensure emergency recovery capabilities.</p>
                            <div className="pt-4 space-y-3">
                                <div className="flex items-center gap-3 text-emerald-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/80">L4 encryption active</span>
                                </div>
                                <div className="flex items-center gap-3 text-primary">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Role isolation verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <Key size={20} />
                        </div>
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1 leading-none">Passcode Protocol</h4>
                        <div className="mt-4 space-y-3">
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={masterPasscode}
                                    onChange={(e) => setMasterPasscode(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-secondary focus:border-primary outline-none"
                                />
                                <button
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary transition-colors"
                                    title={showPass ? "Hide Passcode" : "Show Passcode"}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase text-center">Master Auth Key</p>
                        </div>
                    </div>

                    <div className="bg-slate-100/50 rounded-[2.5rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 mb-4">
                            <Zap size={20} />
                        </div>
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1 leading-none">Global Lock Status</h4>
                        <p className="text-3xl font-black text-secondary tracking-tight mt-2">{lockedSections.length}<span className="text-xs text-slate-400 ml-1">/{lockableSections.length}</span></p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase mt-4">Restricted Nodes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminControl;
