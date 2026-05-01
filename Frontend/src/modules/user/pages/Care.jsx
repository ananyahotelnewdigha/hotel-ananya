import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Heart, ShieldCheck, Plus } from 'lucide-react';

const Care = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCare = async () => {
            try {
                const { data } = await api.get('/services/care');
                setItems(data);
            } catch (error) {
                console.error('Error fetching care items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCare();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Infusing Essential Oils...</p>
        </div>
    );

    return (
        <div className="bg-[#FAF9F6] min-h-screen pb-24 text-left">
            <header className="px-8 pt-12 pb-8 text-center space-y-3">
                <Heart className="mx-auto text-rose-400 animate-pulse" size={24} />
                <h1 className="text-4xl font-black text-secondary lowercase capitalize leading-tight">Sacred <span className="text-primary italic">Healings</span></h1>
                <p className="max-w-md mx-auto text-[11px] text-slate-500 font-medium italic opacity-80 mt-2 leading-relaxed">
                    A collection of ancient wellness rituals and modern therapies designed to restore your inner equilibrium.
                </p>
                <div className="flex justify-center gap-3 mt-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm text-[7px] font-black uppercase tracking-widest text-slate-400">
                        <ShieldCheck size={10} className="text-emerald-400" /> Ayurvedic Certified
                    </div>
                </div>
            </header>

            <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <Heart size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-serif italic">The sanctuary is currently being prepared for your serenity.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item._id} className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                                {item.image ? (
                                    <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-700 mb-6">
                                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.name} />
                                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] font-black uppercase tracking-widest text-secondary shadow-xl">
                                            {item.category}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-500">
                                        <Heart className="text-primary group-hover:text-secondary transition-colors" size={28} />
                                    </div>
                                )}
                            <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em]">{item.category}</span>
                            <div className="flex justify-between items-start mt-2">
                                <h3 className="text-2xl font-black text-secondary lowercase capitalize leading-tight">{item.name}</h3>
                                <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${item.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    {item.isActive ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 font-medium leading-relaxed italic">{item.description}</p>

                            {/* Integrated Therapy/Items List */}
                            {item.items && item.items.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    {item.items.map((sub, i) => (
                                        <div key={i} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-2xl">
                                            <p className="text-[10px] font-black text-secondary uppercase tracking-tighter">{sub.name}</p>
                                            <span className="text-[10px] font-black text-primary">₹{sub.price}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-base font-black text-secondary lowercase">₹{item.price} <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-1">/ Session</span></span>
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-secondary hover:text-white transition-all">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Care;
