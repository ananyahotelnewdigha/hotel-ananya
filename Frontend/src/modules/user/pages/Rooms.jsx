import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { roomCategories } from '../../../utils/roomData';
import { Star, Wifi, Wind, Coffee, Tv, Maximize2, BedDouble, Users, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

const amenityIcons = { 'Free WiFi': Wifi, 'Split AC': Wind, 'Electric Kettle': Coffee, 'Flat TV': Tv };

const RoomCard = ({ room, onBook }) => (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
            <img src={room.image} alt={room.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                <span className="bg-primary text-secondary text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">Luxury</span>
                <div className="flex items-center gap-1 bg-secondary/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <Star size={9} className="text-amber-400" fill="currentColor" />
                    <span className="text-white text-[9px] font-black">4.9</span>
                </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                    <h3 className="text-white font-serif text-xl leading-tight">{room.type}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        {[
                            { icon: Maximize2, label: room.size },
                            { icon: BedDouble, label: room.bed },
                        ].map(({ icon: Icon, label }) => (
                            <div key={label} className="flex items-center gap-1">
                                <Icon size={9} className="text-white/60" />
                                <span className="text-white/70 text-[9px] font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-primary font-black text-xl">₹{room.price.toLocaleString()}</p>
                    <p className="text-white/50 text-[8px] uppercase tracking-widest">/ Night</p>
                </div>
            </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
            {/* Capacity */}
            <div className="flex items-center gap-2 text-slate-400">
                <Users size={13} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{room.capacity}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{room.count} rooms available</span>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 4).map(amenity => {
                    const Icon = amenityIcons[amenity] || ChevronRight;
                    return (
                        <div key={amenity} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                            <Icon size={10} className="text-primary" />
                            <span className="text-[9px] font-bold text-secondary">{amenity}</span>
                        </div>
                    );
                })}
                {room.amenities.length > 4 && (
                    <div className="flex items-center bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
                        <span className="text-[9px] font-bold text-slate-400">+{room.amenities.length - 4} more</span>
                    </div>
                )}
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-light">
                Experience the perfect blend of coastal serenity and modern luxury. Designed with an eye for every detail.
            </p>

            <button onClick={() => onBook(room)}
                className="w-full bg-secondary text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2">
                Check Availability <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

const Rooms = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (location.state?.initialSearch) {
            setSearch(location.state.initialSearch);
            // Clear state so it doesn't persist on refresh if needed
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filtered = roomCategories.filter(r =>
        r.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10">
            {/* Page Header */}
            <div className="bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #c9a84c 0%, transparent 40%), radial-gradient(circle at 80% 10%, #c9a84c 0%, transparent 40%)' }} />
                <div className="relative z-10 px-6 pt-8 pb-1">
                    <span className="text-primary text-[8px] font-black uppercase tracking-[0.5em]">Exclusive Living</span>
                    <h1 className="text-3xl font-serif text-white mt-2 lowercase leading-tight">
                        Our <span className="text-primary italic">Sanctuaries.</span>
                    </h1>
                    <p className="text-white/50 text-xs mt-3 font-medium leading-relaxed max-w-sm">
                        46 boutique rooms where coastal charm meets modern comfort. Crafted for those who seek the sublime.
                    </p>
                </div>
            </div>

            <div className="px-4 max-w-3xl mx-auto">
                {/* Search bar - overlaps header */}
                <div className="-mt-1 mb-6 flex gap-3">
                    <div className="flex-1 relative bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex items-center px-4 gap-3">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search room type..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 py-4 text-sm text-secondary font-medium outline-none bg-transparent placeholder:text-slate-300"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="text-slate-300 hover:text-secondary transition-colors">✕</button>
                        )}
                    </div>
                    <button className="w-14 h-14 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all active:scale-90">
                        <SlidersHorizontal size={18} />
                    </button>
                </div>

                {/* Count */}
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-5">
                    {filtered.length} Room Type{filtered.length !== 1 ? 's' : ''} Available
                </p>

                {/* Cards */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        {filtered.map(room => (
                            <RoomCard key={room.type} room={room} onBook={r => navigate('/book', { state: { room: r } })} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-3">
                        <Search size={36} className="text-slate-200 mx-auto" />
                        <p className="text-secondary font-serif text-lg">No rooms found</p>
                        <p className="text-slate-400 text-xs">Try a different search term</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rooms;

