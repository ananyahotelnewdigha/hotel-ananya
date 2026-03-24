import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { roomCategories } from '../../../../utils/roomData';

const FeaturedStays = () => {
    const navigate = useNavigate();

    return (
        <section className="py-6 bg-white border-b border-slate-100">
            <div className="px-4 flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary border-l-2 border-primary pl-3">Curated Stays</h3>
                <button
                    onClick={() => navigate('/rooms')}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                >
                    View All
                </button>
            </div>
            <div className="flex overflow-x-auto px-4 pb-4 space-x-3 no-scrollbar snap-x">
                {roomCategories.map((room, i) => (
                    <div
                        key={i}
                        onClick={() => navigate('/rooms', { state: { initialSearch: room.type } })}
                        className="flex-shrink-0 w-[75vw] bg-white rounded-xl border border-slate-100 shadow-md overflow-hidden snap-center group cursor-pointer active:scale-95 transition-all"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <img src={room.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={room.type} />
                            <div
                                onClick={(e) => { e.stopPropagation(); }}
                                className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-rose-500 transition-all"
                            >
                                <Heart size={14} />
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center space-x-1.5">
                                <span className="bg-primary px-2 py-0.5 text-[7px] font-bold text-white uppercase tracking-widest rounded-md">Luxury</span>
                                <div className="bg-secondary/80 backdrop-blur-md px-2 py-0.5 flex items-center space-x-1 rounded-md">
                                    <Star size={8} className="text-accent" fill="currentColor" />
                                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">4.9 (120)</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <h4 className="text-sm font-bold text-secondary truncate uppercase tracking-tight">{room.type}</h4>
                            <div className="flex items-center justify-between">
                                <p className="text-primary font-bold text-lg">₹{room.price}<span className="text-[8px] text-slate-400 font-normal uppercase ml-1">/ Night</span></p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/rooms', { state: { initialSearch: room.type } }); }}
                                    className="bg-secondary text-white text-[8px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest active:scale-90 transition-all shadow-sm"
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedStays;
