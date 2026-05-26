import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, Phone, Mail, Globe, MapPin, 
  Users, Activity, DollarSign, FileText, Save, 
  X, CheckCircle2, ArrowLeft, Loader2, Lock, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- REUSABLE TOAST COMPONENT ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- FORM INPUT COMPONENT ---
const InputGroup = ({ label, icon: Icon, type = "text", placeholder, value, onChange, required, options, disabled }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} />} {label} {required && <span className="text-rose-500">*</span>}
      {disabled && <span className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded ml-auto flex items-center gap-1"><Lock size={8}/> Locked</span>}
    </label>
    <div className="relative group">
      {type === 'select' ? (
        <div className="relative">
          <select 
            value={value} onChange={onChange} disabled={disabled}
            className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer bg-[#030712] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="" disabled className="text-slate-500">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt} className="text-white">{opt}</option>)}
          </select>
          {!disabled && <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"><svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
        </div>
      ) : (
        <input 
          type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600 ${disabled ? 'opacity-50 cursor-not-allowed text-slate-400' : ''}`} 
        />
      )}
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function StAddLeadPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Dynamic Data
  const [staffMembers, setStaffMembers] = useState([]);

  // ✅ GET LOGGED IN STAFF INFO
  const user = JSON.parse(localStorage.getItem('user')) || { branch: 'Headquarters', name: 'Me' };

  // Form State
  const [formData, setFormData] = useState({
    name: '', company: '', phone: '', email: '',
    source: 'Website', 
    branch: user.branch, // 🔒 Locked to Staff's Branch
    staff: user.name,    // 🔒 Default to Themselves (can change to teammates if allowed)
    status: 'New', value: '', notes: ''
  });

  const sources = ['Website', 'Call', 'WhatsApp', 'Referral', 'Ads', 'Event'];
  const statuses = ['New', 'Contacted', 'Follow-up', 'Negotiation', 'Qualified'];

  // ✅ FETCH TEAMMATES (Only from same branch)
  useEffect(() => {
    const fetchTeam = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/staff');
            
            // Filter: Only show staff in THIS branch
            const branchStaff = res.data
                .filter(s => s.branch === user.branch)
                .map(s => s.name);
            
            setStaffMembers(branchStaff);
        } catch (err) {
            console.error("Error loading team:", err);
        }
    };
    fetchTeam();
  }, [user.branch]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare Payload
    const payload = {
        ...formData,
        value: formData.value === '' ? 0 : formData.value, // Safety check
        name: formData.name || 'Unnamed Lead'
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/leads', payload);
      setNotification({ message: `Lead added to your branch successfully!`, type: 'success' });
      setTimeout(() => navigate('/staff/leads'), 1500); // Redirect to Staff Lead List
    } catch (err) {
      setNotification({ message: "Failed to save lead.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-4 md:p-8 flex items-center justify-center">
      <AnimatePresence>{notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}</AnimatePresence>
      
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/staff/leads')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-2 text-sm font-bold"><ArrowLeft size={16} /> Back to Dashboard</button>
            <h1 className="text-3xl font-bold text-white tracking-tight">Add New Lead</h1>
            <p className="text-slate-500">Adding to <span className="text-emerald-400 font-bold">{user.branch}</span> Branch pipeline.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><User size={18} className="text-indigo-400" /> Info</h3>
              <InputGroup label="Lead Name" placeholder="e.g. Jane Doe" value={formData.name} onChange={e => handleChange('name', e.target.value)} required />
              <InputGroup label="Company" icon={Building2} placeholder="e.g. Acme Corp" value={formData.company} onChange={e => handleChange('company', e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Phone" icon={Phone} placeholder="+1 555..." value={formData.phone} onChange={e => handleChange('phone', e.target.value)} required />
                <InputGroup label="Email" icon={Mail} type="email" placeholder="jane@example.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Source" icon={Globe} type="select" options={sources} value={formData.source} onChange={e => handleChange('source', e.target.value)} />
                
                {/* 🔒 LOCKED BRANCH FIELD */}
                <InputGroup 
                    label="Branch" 
                    icon={MapPin} 
                    type="text" 
                    value={formData.branch} 
                    disabled={true} 
                    onChange={() => {}} 
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4"><Activity size={18} className="text-emerald-400" /> Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DYNAMIC STAFF SELECT (Filtered) */}
                <InputGroup 
                    label="Assigned Staff" 
                    icon={Users} 
                    type="select" 
                    options={staffMembers} 
                    value={formData.staff} 
                    onChange={e => handleChange('staff', e.target.value)} 
                    required 
                />
                
                <InputGroup label="Status" icon={Activity} type="select" options={statuses} value={formData.status} onChange={e => handleChange('status', e.target.value)} />
              </div>
              <InputGroup label="Expected Value ($)" icon={DollarSign} type="number" placeholder="0.00" value={formData.value} onChange={e => handleChange('value', e.target.value)} />
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1.5"><FileText size={12} /> Notes</label>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none resize-none" placeholder="Enter notes..." value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/staff/leads')} className="px-8 py-3.5 rounded-xl font-bold text-slate-400 hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="relative px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Lead</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}