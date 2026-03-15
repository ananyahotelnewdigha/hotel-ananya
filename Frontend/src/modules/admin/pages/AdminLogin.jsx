import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));

        if (email === 'admin@ananya.com' && password === 'admin123') {
            login({ name: 'System Admin', email, role: 'admin' });
            navigate('/admin');
        } else {
            setError('Access Denied. Only authorized staff can login here.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 py-12">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-serif text-xl italic shadow-lg shadow-primary/30">a</div>
                <div>
                    <p className="text-[9px] font-black tracking-[0.4em] text-white/40 uppercase">Ananya</p>
                    <p className="text-[7px] font-bold text-primary tracking-widest uppercase">Management Portal</p>
                </div>
            </div>

            <div className="w-full max-w-md">
                <div className="bg-slate-800 rounded-3xl shadow-2xl shadow-black/50 border border-slate-700 overflow-hidden">
                    {/* Header Banner */}
                    <div className="relative bg-secondary px-8 pt-8 pb-12 text-center overflow-hidden border-b border-slate-700">
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c9a84c 0%, transparent 50%)' }} />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck size={30} className="text-primary" />
                            </div>
                            <h1 className="text-2xl font-serif text-white">Staff Login</h1>
                            <p className="text-white/40 text-xs mt-1 font-medium italic">Hotel Ananya Administrative Gateway</p>
                        </div>
                    </div>

                    <div className="px-8 -mt-6 pb-8">
                        <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-6 mb-6 space-y-5">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
                                    <span className="mt-0.5">⚠</span> {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Mail size={10} className="text-primary" /> Admin ID / Email
                                    </label>
                                    <input
                                        type="email" required value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="admin@ananya.com"
                                        className="w-full bg-slate-900 border border-slate-700 focus:border-primary focus:bg-slate-900/50 text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Lock size={10} className="text-primary" /> Security Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'} required value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-900 border border-slate-700 focus:border-primary focus:bg-slate-900/50 text-sm px-4 py-3.5 pr-12 rounded-xl outline-none transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-xl
                                        ${loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-primary text-secondary shadow-primary/10 hover:brightness-110 active:scale-95'}`}>
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                                            Authenticating...
                                        </span>
                                    ) : (
                                        <><ShieldCheck size={18} /> Enter Portal</>
                                    )}
                                </button>
                            </form>
                        </div>

                        <div className="py-4 border-t border-slate-700 flex flex-col items-center gap-4">
                            <Link to="/login" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">
                                Back to Guest Login
                            </Link>
                            <p className="text-[8px] text-slate-600 text-center leading-relaxed">
                                This system is for authorized users only. Unauthorized access attempts are monitored and logged.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
