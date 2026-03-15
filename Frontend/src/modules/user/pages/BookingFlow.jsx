import { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useWallet } from '../../../context/WalletContext';
import {
    Calendar, Users, ShieldCheck, ArrowRight, CreditCard,
    Wifi, Coffee, Wind, Tv, ChevronLeft, Star, MapPin,
    BedDouble, Maximize2, CheckCircle2, Sparkles, Phone
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─── helpers ─────────────────────────────────────── */
const iconMap = {
    'Free WiFi': Wifi, 'Electric Kettle': Coffee,
    'Split AC': Wind, 'Flat TV': Tv,
    default: Sparkles,
};

const nights = (ci, co) => {
    if (!ci || !co) return 1;
    const diff = (new Date(co) - new Date(ci)) / 86400000;
    return diff > 0 ? diff : 1;
};

/* ─── Sub-components ──────────────────────────────── */

const StepBar = ({ step }) => {
    const labels = ['Stay Details', 'Payment', 'Confirmed'];
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {labels.map((label, i) => {
                const idx = i + 1;
                const active = step === idx;
                const done = step > idx;
                return (
                    <div key={idx} className="flex items-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500 shadow-md
                                ${done ? 'bg-primary text-white scale-100' : ''}
                                ${active ? 'bg-secondary text-white scale-110 shadow-lg shadow-secondary/30' : ''}
                                ${!active && !done ? 'bg-slate-100 text-slate-400 scale-90' : ''}`}>
                                {done ? <CheckCircle2 size={18} /> : idx}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest hidden sm:block ${active ? 'text-secondary' : done ? 'text-primary' : 'text-slate-300'}`}>{label}</span>
                        </div>
                        {idx < 3 && (
                            <div className={`w-16 sm:w-24 h-[2px] mx-2 rounded-full transition-all duration-700 ${step > idx ? 'bg-primary' : 'bg-slate-100'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const RoomCard = ({ room, bookingData }) => {
    const n = nights(bookingData.checkIn, bookingData.checkOut);
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 sticky top-4">
            {/* Room Image */}
            <div className="relative h-48 overflow-hidden">
                <img src={room.image} className="w-full h-full object-cover" alt={room.type} />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-serif text-lg leading-tight">{room.type}</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <Star size={10} className="text-amber-400" fill="currentColor" />
                        <span className="text-white text-[9px] font-bold">4.9 (120 reviews)</span>
                    </div>
                </div>
                <div className="absolute top-3 right-3 bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                    Luxury
                </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
                {/* Quick specs */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { icon: Maximize2, label: room.size || '—' },
                        { icon: BedDouble, label: room.bed || '—' },
                        { icon: Users, label: room.capacity || '—' },
                    ].map(({ icon: Icon, label }, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-2 flex flex-col items-center gap-1">
                            <Icon size={13} className="text-primary" />
                            <span className="text-[8px] font-bold text-secondary uppercase text-center leading-tight">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Amenities */}
                <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                        {(room.amenities || []).map((a, i) => {
                            const Icon = iconMap[a] || iconMap.default;
                            return (
                                <div key={i} className="flex items-center gap-1 bg-primary/8 text-primary px-2 py-1 rounded-full border border-primary/10">
                                    <Icon size={9} />
                                    <span className="text-[8px] font-bold">{a}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rate / Night</span>
                        <span className="text-primary font-black text-base">₹{room.price.toLocaleString()}</span>
                    </div>
                    {n > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{n} Night{n > 1 ? 's' : ''} Total</span>
                            <span className="text-secondary font-black text-lg">₹{(room.price * n).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Step 1: Stay Details ────────────────────────── */
const StepOne = ({ bookingData, setBookingData, onNext }) => {
    const today = new Date().toISOString().split('T')[0];
    const n = nights(bookingData.checkIn, bookingData.checkOut);

    const canProceed = bookingData.checkIn && bookingData.checkOut && n > 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 space-y-7">
            <div>
                <span className="text-primary text-[8px] font-black uppercase tracking-[0.4em]">Step 1 of 2</span>
                <h2 className="text-2xl font-serif text-secondary mt-1">Stay <span className="text-primary italic">Details</span></h2>
                <p className="text-slate-400 text-xs mt-1">Choose your check-in and check-out dates</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Check In */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={11} className="text-primary" /> Check-In Date
                    </label>
                    <input
                        type="date"
                        min={today}
                        value={bookingData.checkIn}
                        onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value, checkOut: '' })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm font-medium p-4 rounded-xl outline-none transition-all text-secondary"
                    />
                </div>
                {/* Check Out */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={11} className="text-primary" /> Check-Out Date
                    </label>
                    <input
                        type="date"
                        min={bookingData.checkIn || today}
                        value={bookingData.checkOut}
                        onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm font-medium p-4 rounded-xl outline-none transition-all text-secondary"
                    />
                </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={11} className="text-primary" /> Number of Guests
                </label>
                <div className="flex gap-3">
                    {[1, 2, 3, 4].map(g => (
                        <button
                            key={g}
                            onClick={() => setBookingData({ ...bookingData, guests: g })}
                            className={`flex-1 py-3 rounded-xl text-sm font-black border transition-all active:scale-90
                                ${bookingData.guests === g
                                    ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20'
                                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-primary/40'}`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stay summary pill */}
            {canProceed && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">Stay Duration</p>
                        <p className="text-secondary font-black text-lg">{n} Night{n > 1 ? 's' : ''}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">Est. Total</p>
                        <p className="text-secondary font-black text-lg">₹{(bookingData.checkIn && bookingData.price ? bookingData.price * n : 0).toLocaleString()}</p>
                    </div>
                </div>
            )}

            <button
                onClick={onNext}
                disabled={!canProceed}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all
                    ${canProceed
                        ? 'bg-secondary text-white shadow-xl shadow-secondary/20 active:scale-95 hover:bg-primary'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
                Continue to Payment <ArrowRight size={18} />
            </button>
        </div>
    );
};

/* ─── Step 2: Payment ─────────────────────────────── */
const StepTwo = ({ room, bookingData, onConfirm, onBack, balance }) => {
    const navigate = useNavigate();
    const n = nights(bookingData.checkIn, bookingData.checkOut);
    const total = room.price * n;
    const hasBalance = balance >= total;

    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-8 space-y-7">
            <div>
                <span className="text-primary text-[8px] font-black uppercase tracking-[0.4em]">Step 2 of 2</span>
                <h2 className="text-2xl font-serif text-secondary mt-1">Wallet <span className="text-primary italic">Payment</span></h2>
                <p className="text-slate-400 text-xs mt-1">Review your booking and confirm payment</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room Type</span>
                    <span className="text-secondary text-sm font-bold">{room.type}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-In</span>
                    <span className="text-secondary text-sm font-bold">{fmt(bookingData.checkIn)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-Out</span>
                    <span className="text-secondary text-sm font-bold">{fmt(bookingData.checkOut)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guests</span>
                    <span className="text-secondary text-sm font-bold">{bookingData.guests} Guest{bookingData.guests > 1 ? 's' : ''}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</span>
                    <span className="text-secondary text-sm font-bold">{n} Night{n > 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Wallet Balance Card */}
            <div className={`p-5 rounded-xl border-2 flex items-center justify-between transition-all ${hasBalance ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasBalance ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                        <CreditCard size={22} />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Wallet Balance</p>
                        <p className={`text-xl font-black ${hasBalance ? 'text-emerald-700' : 'text-red-600'}`}>₹{balance.toLocaleString()}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/wallet')}
                    className="text-[9px] font-black text-primary border-b-2 border-primary uppercase tracking-widest pb-0.5"
                >
                    Add Funds
                </button>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">₹{room.price.toLocaleString()} × {n} night{n > 1 ? 's' : ''}</span>
                    <span className="font-bold text-secondary">₹{(room.price * n).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">Taxes & Fees</span>
                    <span className="font-black text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-slate-100">
                    <span className="font-black text-secondary uppercase tracking-wider">Total</span>
                    <span className="font-black text-primary text-xl">₹{total.toLocaleString()}</span>
                </div>
            </div>

            {!hasBalance && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    <Phone size={16} className="mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-medium">Insufficient balance. Please add ₹{(total - balance).toLocaleString()} more to your wallet to proceed.</p>
                </div>
            )}

            <div className="space-y-3">
                <button
                    onClick={onConfirm}
                    disabled={!hasBalance}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all
                        ${hasBalance
                            ? 'bg-secondary text-white shadow-xl shadow-secondary/20 active:scale-95 hover:bg-primary'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                >
                    Confirm & Pay via Wallet <ShieldCheck size={18} />
                </button>
                <button
                    onClick={onBack}
                    className="w-full py-3 text-slate-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-secondary transition-colors"
                >
                    <ChevronLeft size={14} /> Back to Dates
                </button>
            </div>
        </div>
    );
};

/* ─── Step 3: Confirmation ────────────────────────── */
const StepThree = ({ room, bookingData, confirmId }) => {
    const navigate = useNavigate();
    const n = nights(bookingData.checkIn, bookingData.checkOut);
    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center">
            {/* Hero */}
            <div className="relative h-40 overflow-hidden">
                <img src={room.image} className="w-full h-full object-cover opacity-70" alt={room.type} />
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 to-secondary/90" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-secondary/20">
                        <CheckCircle2 size={42} className="text-emerald-500" />
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div>
                    <span className="text-emerald-500 text-[8px] font-black uppercase tracking-[0.5em]">Booking Confirmed</span>
                    <h2 className="text-3xl font-serif text-secondary mt-1">You're all <span className="text-primary italic">set!</span></h2>
                    <p className="text-slate-400 text-sm mt-2">Your sanctuary at Hotel Ananya is reserved. We look forward to welcoming you.</p>
                </div>

                {/* Confirmation ID */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Booking ID</p>
                    <p className="text-secondary font-black text-xl tracking-widest font-mono">#{confirmId}</p>
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-2 gap-3 text-left">
                    {[
                        { label: 'Room', value: room.type },
                        { label: 'Duration', value: `${n} Night${n > 1 ? 's' : ''}` },
                        { label: 'Check-In', value: fmt(bookingData.checkIn) },
                        { label: 'Check-Out', value: fmt(bookingData.checkOut) },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                            <p className="text-secondary text-sm font-bold mt-0.5">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Amount paid */}
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">Amount Paid</span>
                    <span className="text-secondary font-black text-xl">₹{(room.price * n).toLocaleString()}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => navigate('/profile/bookings')}
                        className="flex-1 py-4 border-2 border-secondary text-secondary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95"
                    >
                        My Bookings
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 py-4 bg-secondary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-secondary/20 hover:bg-primary transition-all active:scale-95"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ───────────────────────────────────── */
const BookingFlow = () => {
    const { user } = useAuth();
    const { balance, addTransaction } = useWallet();
    const navigate = useNavigate();
    const location = useLocation();
    const room = location.state?.room;

    const [step, setStep] = useState(1);
    const [bookingData, setBookingData] = useState({ checkIn: '', checkOut: '', guests: 1 });
    const [confirmId] = useState(`AN-${Math.floor(Math.random() * 90000) + 10000}`);

    /* No room guard */
    if (!room) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center space-y-4 max-w-sm w-full">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                        <BedDouble size={28} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-serif text-secondary">No room selected</h2>
                    <p className="text-slate-400 text-sm">Please choose a room first to start your booking.</p>
                    <button
                        onClick={() => navigate('/rooms')}
                        className="w-full bg-secondary text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                        Browse Rooms
                    </button>
                </div>
            </div>
        );
    }

    const handleConfirm = () => {
        const n = nights(bookingData.checkIn, bookingData.checkOut);
        const total = room.price * n;
        if (balance < total) {
            navigate('/wallet');
            return;
        }
        addTransaction({
            id: confirmId,
            type: 'debit',
            amount: total,
            description: `Room Booking: ${room.type} (${n} nights)`,
            date: new Date().toLocaleString()
        });
        setStep(3);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10">
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3">
                <button
                    onClick={() => step > 1 && step < 3 ? setStep(s => s - 1) : navigate(-1)}
                    className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-secondary active:scale-90 transition-all"
                >
                    <ChevronLeft size={18} />
                </button>
                <div>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Hotel Ananya</p>
                    <p className="text-sm font-bold text-secondary">Luxury Booking</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                    <MapPin size={10} className="text-primary" />
                    <span className="text-[9px] font-bold text-secondary">Digha, WB</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-6">
                <StepBar step={step} />

                {step < 3 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Left: Room details */}
                        <div className="lg:col-span-2">
                            <RoomCard room={room} bookingData={bookingData} />
                        </div>

                        {/* Right: Step content */}
                        <div className="lg:col-span-3">
                            {step === 1 && (
                                <StepOne
                                    bookingData={bookingData}
                                    setBookingData={setBookingData}
                                    onNext={() => setStep(2)}
                                />
                            )}
                            {step === 2 && (
                                <StepTwo
                                    room={room}
                                    bookingData={bookingData}
                                    onConfirm={handleConfirm}
                                    onBack={() => setStep(1)}
                                    balance={balance}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-md mx-auto">
                        <StepThree
                            room={room}
                            bookingData={bookingData}
                            confirmId={confirmId}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingFlow;

