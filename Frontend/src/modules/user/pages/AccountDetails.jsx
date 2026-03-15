import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, ChevronLeft, Shield, CheckCircle2, Save, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const Field = ({ icon: Icon, label, value, editing, field, formData, onChange, verified, disabled }) => (
    <div className="space-y-1.5">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Icon size={10} className="text-primary" /> {label}
        </label>
        {editing && !disabled ? (
            <input
                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3 rounded-xl outline-none transition-all font-medium text-secondary"
                value={formData[field]}
                onChange={e => onChange(field, e.target.value)}
            />
        ) : (
            <div className="flex items-center justify-between">
                <p className={`font-bold text-sm ${disabled ? 'text-secondary/50' : 'text-secondary'}`}>{value || formData[field]}</p>
                {verified && (
                    <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black">
                        <CheckCircle2 size={11} /> Verified
                    </span>
                )}
            </div>
        )}
    </div>
);

const AccountDetails = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+91 98765 43210',
        address: 'Kolkata, West Bengal',
    });

    if (!user) { navigate('/login'); return null; }

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleSave = () => {
        setSaved(true);
        setIsEditing(false);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3">
                <button onClick={() => navigate('/profile')}
                    className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-secondary active:scale-90 transition-all">
                    <ChevronLeft size={18} />
                </button>
                <div>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Settings</p>
                    <h1 className="text-sm font-bold text-secondary">Account Details</h1>
                </div>
                <div className="ml-auto">
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)}
                                className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors active:scale-90">
                                <X size={16} />
                            </button>
                            <button onClick={handleSave}
                                className="flex items-center gap-1.5 bg-primary text-secondary px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-90 transition-all">
                                <Save size={13} /> Save
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)}
                            className="bg-secondary text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-90 transition-all shadow-sm">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {saved && (
                <div className="mx-4 mt-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={14} /> Profile updated successfully!
                </div>
            )}

            <div className="max-w-xl mx-auto px-4 pt-5 space-y-4">
                {/* Avatar Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="h-24 bg-secondary relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #c9a84c 0%, transparent 50%)' }} />
                    </div>
                    <div className="px-6 pb-6 -mt-10">
                        <div className="flex items-end justify-between">
                            <div className="relative">
                                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border-2 border-slate-100 flex items-center justify-center text-primary font-serif text-3xl font-black">
                                    {user.name[0]}
                                </div>
                                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90">
                                    <Camera size={13} />
                                </button>
                            </div>
                            <div className="mb-2 text-right">
                                <h2 className="text-secondary font-bold text-base">{formData.name}</h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">
                                    <Shield size={9} /> Verified {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                    <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                        Personal Information
                    </h2>
                    <Field icon={User} label="Full Name" field="name" formData={formData} editing={isEditing} onChange={handleChange} />
                    <Field icon={Mail} label="Email Address" field="email" value={user.email} formData={formData} editing={isEditing} onChange={handleChange} verified disabled />
                    <Field icon={Phone} label="Phone Number" field="phone" formData={formData} editing={isEditing} onChange={handleChange} />
                    <Field icon={MapPin} label="Home Address" field="address" formData={formData} editing={isEditing} onChange={handleChange} />
                </div>

                {/* Preferences */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">
                        Preferences
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-secondary font-bold text-sm">Notifications</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">WhatsApp & Email updates</p>
                        </div>
                        <button onClick={() => setNotifications(!notifications)}
                            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${notifications ? 'bg-primary' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${notifications ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Privacy notice */}
                <div className="bg-secondary/5 border border-primary/10 rounded-2xl p-5 flex gap-3">
                    <Shield size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Privacy & Security</p>
                        <p className="text-slate-500 text-xs leading-relaxed">Your data is encrypted and managed under our premium hospitality privacy standards. We never share your stay details with third parties.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;

