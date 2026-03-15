import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, UserPlus, User, Eye, EyeOff, Sparkles } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(r => setTimeout(r, 700));
        login({ name, email, role: 'user' });
        navigate('/');
    };

    const perks = ['Exclusive member rates', 'Priority bookings', 'Loyalty rewards', 'Complimentary upgrades'];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-serif text-xl italic shadow-lg shadow-primary/30">a</div>
                <div>
                    <p className="text-[9px] font-black tracking-[0.4em] text-secondary uppercase">Ananya</p>
                    <p className="text-[7px] font-bold text-primary tracking-widest uppercase">Luxury Hotels</p>
                </div>
            </div>

            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
                    {/* Header Banner */}
                    <div className="relative bg-secondary px-8 pt-8 pb-12 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #c9a84c 0%, transparent 50%), radial-gradient(circle at 70% 30%, #c9a84c 0%, transparent 50%)' }} />
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <UserPlus size={30} className="text-primary" />
                            </div>
                            <h1 className="text-2xl font-serif text-white">Join Ananya</h1>
                            <p className="text-white/60 text-xs mt-1 font-medium">Create your luxury membership account</p>
                        </div>
                    </div>

                    <div className="px-8 -mt-6 pb-8">
                        {/* Perks Strip */}
                        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 mb-6 shadow-sm">
                            <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Sparkles size={10} /> Member Benefits
                            </p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {perks.map(p => (
                                    <div key={p} className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                                        <span className="text-[9px] text-secondary font-medium">{p}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-5">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <User size={10} className="text-primary" /> Full Name
                                    </label>
                                    <input type="text" required value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                                    />
                                </div>
                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Mail size={10} className="text-primary" /> Email Address
                                    </label>
                                    <input type="email" required value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                                    />
                                </div>
                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Lock size={10} className="text-primary" /> Password
                                    </label>
                                    <div className="relative">
                                        <input type={showPass ? 'text' : 'password'} required value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 pr-12 rounded-xl outline-none transition-all text-secondary font-medium"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary transition-colors">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg
                                        ${loading ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-secondary text-white shadow-secondary/20 hover:bg-primary active:scale-95'}`}>
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        <><UserPlus size={18} /> Create Account</>
                                    )}
                                </button>
                            </form>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

