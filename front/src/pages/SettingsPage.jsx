import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Save, Mail, Phone, Building2, Shield, 
  CheckCircle2, AlertCircle, Loader2, KeyRound 
} from 'lucide-react';

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // User Data State
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', role: '', branch: '', dept: ''
  });

  // Password State
  const [passwords, setPasswords] = useState({
    oldPassword: '', newPassword: '', confirmPassword: ''
  });

  // Get Logged In User ID
  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ FETCH USER PROFILE
  useEffect(() => {
    if (user?.id) {
        axios.get(`http://127.0.0.1:5000/api/profile/${user.id}`)
            .then(res => setProfile(res.data))
            .catch(err => console.error(err));
    }
  }, []);

  // ✅ HANDLE PROFILE UPDATE
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await axios.put(`http://127.0.0.1:5000/api/profile/${user.id}`, {
            name: profile.name,
            phone: profile.phone
        });
        
        // Update local storage to reflect new name immediately
        const updatedUser = { ...user, name: profile.name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setNotification({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
        setNotification({ message: 'Failed to update profile.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  // ✅ HANDLE PASSWORD CHANGE
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
        setNotification({ message: "New passwords do not match!", type: "error" });
        return;
    }

    setLoading(true);
    try {
        await axios.put(`http://127.0.0.1:5000/api/profile/password/${user.id}`, {
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        });
        setNotification({ message: 'Password changed successfully!', type: 'success' });
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Reset form
    } catch (err) {
        setNotification({ message: err.response?.data || 'Failed to change password.', type: 'error' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 flex justify-center">
      <AnimatePresence>{notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}</AnimatePresence>

      <div className="w-full max-w-4xl space-y-8">
        <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
            <p className="text-slate-500">Manage your personal details and security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* SIDEBAR TABS */}
            <div className="md:col-span-1 space-y-2">
                <button onClick={() => setActiveTab('general')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'general' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-white/5 text-slate-400'}`}>
                    <User size={18} /> General
                </button>
                <button onClick={() => setActiveTab('security')} className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'hover:bg-white/5 text-slate-400'}`}>
                    <Lock size={18} /> Security
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="md:col-span-3">
                <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.2 }}
                    className="bg-white/[0.03] border border-white/10 rounded-3xl p-8"
                >
                    {activeTab === 'general' ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                    {profile.name.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">{profile.role}</span>
                                        <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">{profile.branch}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label><input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label><input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email (Read Only)</label><div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-slate-500 flex items-center gap-2 cursor-not-allowed"><Mail size={16}/> {profile.email}</div></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Department (Read Only)</label><div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-slate-500 flex items-center gap-2 cursor-not-allowed"><Building2 size={16}/> {profile.dept}</div></div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all disabled:opacity-50">
                                    {loading ? <Loader2 size={18} className="animate-spin"/> : <Save size={18} />} Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                            
                            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Password</label><input type="password" required value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label><input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm Password</label><input type="password" required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all disabled:opacity-50">
                                    {loading ? <Loader2 size={18} className="animate-spin"/> : <KeyRound size={18} />} Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}