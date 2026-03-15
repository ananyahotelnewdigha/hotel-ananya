import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronLeft, Tag, CheckCircle2, Clock, BedDouble, Phone, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const STATUS_CONFIG = {
    Confirmed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircle2 },
    Completed: { color: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400', icon: CheckCircle2 },
    Cancelled: { color: 'bg-red-100 text-red-600 border-red-200', dot: 'bg-red-500', icon: X },
    Pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500', icon: Clock },
};

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const SAMPLE_BOOKINGS = [
    {
        id: 'BK-7892', roomName: 'Double Bed A/C Deluxe',
        checkIn: 'Mar 15, 2026', checkOut: 'Mar 18, 2026', nights: 3,
        status: 'Confirmed', totalPrice: 7500,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'BK-4521', roomName: 'Deluxe Triple Bed',
        checkIn: 'Jan 10, 2026', checkOut: 'Jan 12, 2026', nights: 2,
        status: 'Completed', totalPrice: 7000,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
    },
];

const BookingCard = ({ booking }) => {
    const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.Confirmed;
    const Icon = cfg.icon;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Image Strip */}
            <div className="relative h-36 overflow-hidden">
                <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent" />
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest backdrop-blur-sm ${cfg.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {booking.status}
                </div>
                <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-serif text-base">{booking.roomName}</h3>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Booking ID */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary">
                        <Tag size={11} />
                        <span className="text-[9px] font-black uppercase tracking-widest">ID: {booking.id}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                        <MapPin size={10} />
                        <span className="text-[9px] font-medium">Ananya, Digha</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Check-In', value: booking.checkIn },
                        { label: 'Check-Out', value: booking.checkOut },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                            <div className="flex items-center gap-1 mb-1">
                                <Calendar size={10} className="text-primary" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
                            </div>
                            <p className="text-secondary text-xs font-bold">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{booking.nights} Night{booking.nights > 1 ? 's' : ''} · Total</p>
                        <p className="text-secondary font-black text-lg">₹{booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        <button className="px-4 py-2 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-xl active:scale-90 transition-all shadow-sm hover:bg-primary">
                            View Invoice
                        </button>
                        {booking.status === 'Confirmed' && (
                            <button className="text-[9px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-1">
                                <AlertTriangle size={10} /> Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [bookings] = useState(SAMPLE_BOOKINGS);

    if (!user) { navigate('/login'); return null; }

    const filtered = activeTab === 'All' ? bookings : bookings.filter(b => {
        if (activeTab === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Pending';
        return b.status === activeTab;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3">
                <button onClick={() => navigate('/profile')}
                    className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-secondary active:scale-90 transition-all">
                    <ChevronLeft size={18} />
                </button>
                <div>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Your History</p>
                    <h1 className="text-sm font-bold text-secondary">My Bookings</h1>
                </div>
                <div className="ml-auto bg-primary/10 text-primary px-3 py-1.5 rounded-lg">
                    <span className="text-[9px] font-black uppercase tracking-widest">{bookings.length} Total</span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                        { label: 'Completed', count: bookings.filter(b => b.status === 'Completed').length, color: 'text-slate-500 bg-slate-50 border-slate-100' },
                        { label: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length, color: 'text-red-500 bg-red-50 border-red-100' },
                    ].map(({ label, count, color }) => (
                        <div key={label} className={`p-3 rounded-xl border text-center ${color}`}>
                            <p className="text-xl font-black">{count}</p>
                            <p className="text-[8px] font-black uppercase tracking-wider mt-0.5 opacity-70">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95
                                ${activeTab === tab ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-white border border-slate-200 text-slate-400 hover:border-primary/30'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Booking Cards */}
                {filtered.length > 0 ? (
                    <div className="space-y-4">
                        {filtered.map(b => <BookingCard key={b.id} booking={b} />)}
                    </div>
                ) : (
                    <div className="py-16 text-center space-y-3">
                        <BedDouble size={40} className="text-slate-200 mx-auto" />
                        <p className="text-secondary font-serif text-lg">No bookings here</p>
                        <p className="text-slate-400 text-xs font-medium">Start exploring our luxurious rooms</p>
                        <button onClick={() => navigate('/rooms')}
                            className="mt-4 px-6 py-3 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-primary transition-all active:scale-95">
                            Browse Rooms
                        </button>
                    </div>
                )}

                {/* Support banner */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Phone size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-secondary font-bold text-sm">Need Help?</p>
                        <p className="text-slate-400 text-xs mt-0.5">24/7 guest support for all booking queries</p>
                    </div>
                    <button onClick={() => navigate('/contact')}
                        className="px-4 py-2 bg-secondary text-white text-[9px] font-black uppercase tracking-widest rounded-xl active:scale-90 transition-all">
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyBookings;

