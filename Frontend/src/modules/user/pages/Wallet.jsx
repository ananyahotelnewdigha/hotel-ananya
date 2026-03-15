import { useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import {
    CreditCard, ArrowUpRight, ArrowDownLeft, Plus, Ticket,
    Sparkles, TrendingUp, X, Check
} from 'lucide-react';

const quickAmounts = [500, 1000, 2000, 5000];

const Wallet = () => {
    const { balance, transactions, coupons, addFunds } = useWallet();
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState('');
    const [success, setSuccess] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const handleAddFunds = (e) => {
        e.preventDefault();
        if (amount && !isNaN(amount) && Number(amount) > 0) {
            addFunds(Number(amount));
            setSuccess(true);
            setTimeout(() => { setSuccess(false); setShowModal(false); setAmount(''); }, 1500);
        }
    };

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code).catch(() => { });
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
    const totalAdded = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10">
            {/* Page Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-5 shadow-sm">
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Hotel Ananya</p>
                <h1 className="text-xl font-serif text-secondary mt-0.5">My <span className="text-primary italic">Wallet</span></h1>
            </div>

            <div className="px-4 pt-5 space-y-4 max-w-2xl mx-auto">

                {/* Main Balance Card */}
                <div className="relative bg-secondary rounded-3xl overflow-hidden shadow-2xl shadow-secondary/30 p-7">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/15 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <p className="text-white/50 text-[9px] font-black uppercase tracking-[0.4em]">Available Balance</p>
                                <h2 className="text-4xl font-black text-white tracking-tight mt-1">₹{balance.toLocaleString()}</h2>
                            </div>
                            <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center">
                                <CreditCard size={24} className="text-primary" />
                            </div>
                        </div>

                        {/* Mini Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                                <p className="text-white/40 text-[8px] font-bold uppercase tracking-wider">Total Added</p>
                                <p className="text-emerald-400 font-black text-base mt-0.5">+₹{totalAdded.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                                <p className="text-white/40 text-[8px] font-bold uppercase tracking-wider">Total Spent</p>
                                <p className="text-rose-400 font-black text-base mt-0.5">-₹{totalSpent.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowModal(true)}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary text-secondary py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/30">
                                <Plus size={16} /> Add Funds
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-90 transition-all">
                                <TrendingUp size={16} /> History
                            </button>
                        </div>
                    </div>
                </div>

                {/* Coupons Section */}
                {coupons.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                            <Ticket size={16} className="text-primary" />
                            <h2 className="text-sm font-black text-secondary uppercase tracking-wider">Exclusive Offers</h2>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {coupons.map(coupon => (
                                <div key={coupon.id} className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-xs">
                                            {coupon.discount}%
                                        </div>
                                        <div>
                                            <p className="text-secondary font-black text-sm">{coupon.code}</p>
                                            <p className="text-slate-400 text-[9px] mt-0.5">{coupon.description}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleCopy(coupon.code)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border active:scale-90
                                            ${copiedCode === coupon.code ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-primary border-slate-200 hover:border-primary/40'}`}>
                                        {copiedCode === coupon.code ? <><Check size={11} /> Copied</> : 'Copy'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Platinum Tip */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-4">
                    <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Sparkles size={18} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">Pro Tip</p>
                        <p className="text-secondary text-xs font-medium mt-1 leading-relaxed">
                            Maintain a wallet balance of <span className="font-black">₹5,000+</span> to unlock <span className="font-black text-primary">Ananya Platinum</span> and enjoy free room upgrades!
                        </p>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                        <TrendingUp size={16} className="text-primary" />
                        <h2 className="text-sm font-black text-secondary uppercase tracking-wider">Recent Transactions</h2>
                    </div>
                    <div>
                        {transactions.length > 0 ? transactions.slice().reverse().map((t) => (
                            <div key={t.id} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                    ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                    {t.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-secondary font-bold text-sm truncate">{t.description}</p>
                                    <p className="text-slate-400 text-[9px] font-medium mt-0.5 capitalize">{t.date} · {t.type}</p>
                                </div>
                                <p className={`font-black text-sm flex-shrink-0 ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                </p>
                            </div>
                        )) : (
                            <div className="py-14 text-center space-y-2">
                                <CreditCard size={32} className="text-slate-200 mx-auto" />
                                <p className="text-slate-400 text-sm font-medium">No transactions yet</p>
                                <p className="text-slate-300 text-xs">Start your Ananya journey!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Funds Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="bg-white relative z-10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-secondary px-6 py-5 flex items-center justify-between">
                            <div>
                                <p className="text-primary text-[8px] font-black uppercase tracking-widest">Secure Add</p>
                                <h3 className="text-white font-serif text-lg mt-0.5">Add Funds</h3>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {success ? (
                                <div className="py-8 text-center space-y-3">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                        <Check size={32} className="text-emerald-600" />
                                    </div>
                                    <p className="text-secondary font-black text-lg">Funds Added!</p>
                                    <p className="text-slate-400 text-sm">₹{Number(amount).toLocaleString()} added to your wallet.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleAddFunds} className="space-y-5">
                                    {/* Quick amounts */}
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Quick Select</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {quickAmounts.map(a => (
                                                <button key={a} type="button" onClick={() => setAmount(String(a))}
                                                    className={`py-2 rounded-xl text-xs font-black border transition-all active:scale-90
                                                        ${amount === String(a) ? 'bg-secondary text-white border-secondary' : 'bg-slate-50 text-secondary border-slate-200 hover:border-primary/40'}`}>
                                                    ₹{a}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Custom input */}
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Custom Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-black">₹</span>
                                            <input
                                                type="number" min="1" value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary text-xl font-black text-secondary pl-9 pr-4 py-4 rounded-xl outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setShowModal(false)}
                                            className="flex-1 py-4 border border-slate-200 rounded-xl text-sm font-black text-slate-400 hover:text-secondary transition-colors">
                                            Cancel
                                        </button>
                                        <button type="submit"
                                            disabled={!amount || isNaN(amount) || Number(amount) <= 0}
                                            className="flex-1 py-4 bg-secondary text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-primary transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed">
                                            Add Funds
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;

