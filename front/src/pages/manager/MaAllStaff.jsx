import { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, MoreHorizontal, Mail, Phone, MapPin, 
  Grid, List, User, Shield, Briefcase, CheckCircle2, XCircle, 
  Trash2, Edit, X, Save, Building2, ChevronDown, Check, Lock
} from 'lucide-react';

// --- 1. REUSABLE TOAST COMPONENT ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${
        type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. FILTER DROPDOWN ---
const FilterDropdown = ({ label, icon: Icon, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${value !== 'all' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>
        <Icon size={14} /> <span>{value === 'all' ? label : value}</span> <ChevronDown size={14} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl z-[60] overflow-hidden">
            <button onClick={() => { onChange('all'); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-xs text-slate-400 hover:bg-white/5 hover:text-white">All {label}s</button>
            {options.map(opt => (
                <button key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className="w-full text-left px-4 py-3 text-xs text-slate-400 hover:bg-white/5 hover:text-white">{opt}</button>
            ))}
        </div>
      )}
    </div>
  );
};

// --- 3. STAFF MODAL (Manager Version - Synced Branch) ---
const StaffModal = ({ isOpen, onClose, onSave, initialData, branch }) => {
  const [formData, setFormData] = useState({ 
    name: '', role: 'staff', dept: 'Engineering', email: '', phone: '', branch: branch, status: 'Active', password: '' 
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' });
    } else {
      // ✅ Auto-assign Manager's Branch
      setFormData({ name: '', role: 'staff', dept: 'Engineering', email: '', phone: '', branch: branch, status: 'Active', password: '' });
    }
  }, [initialData, isOpen, branch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-white mb-1">{initialData ? 'Edit Profile' : 'Add Team Member'}</h2>
        <p className="text-slate-500 text-sm mb-6">Create access for <span className="text-indigo-400 font-bold">{branch}</span> branch.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div><label className="text-xs font-bold text-slate-400 ml-1">Full Name</label><input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-xs font-bold text-slate-400 ml-1">Role</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0b0f19]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  {/* Manager cannot create admins */}
                </select>
             </div>
             <div><label className="text-xs font-bold text-slate-400 ml-1">Dept</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} /></div>
          </div>

          <div><label className="text-xs font-bold text-slate-400 ml-1">Email</label><input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>

          {!initialData && (
             <div>
                <label className="text-xs font-bold text-emerald-400 ml-1 flex items-center gap-1"><Lock size={12}/> Password</label>
                <input required type="text" placeholder="Default Password" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-100 placeholder:text-emerald-500/50 focus:outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             {/* 🔒 LOCKED BRANCH FIELD (Synced with Manager) */}
             <div>
                <label className="text-xs font-bold text-slate-400 ml-1 flex items-center gap-1">Branch <Lock size={10}/></label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" value={formData.branch} disabled />
             </div>
             <div><label className="text-xs font-bold text-slate-400 ml-1">Phone</label><input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2"><Save size={18} /> Save Member</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
export default function MaAllStaff() {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // ✅ DYNAMIC STATE
  const [staffList, setStaffList] = useState([]);
  
  // ✅ GET MANAGER INFO (Ensures sync with their branch)
  const user = JSON.parse(localStorage.getItem('user')) || { branch: 'Headquarters' };

  // ✅ FETCH ONLY BRANCH STAFF (Synced with API)
  const fetchStaff = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/staff');
        
        // Filter Logic: Only show users in Manager's branch
        const branchStaff = res.data.filter(u => u.branch === user.branch);
        
        setStaffList(branchStaff);
    } catch (err) {
        console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => { fetchStaff(); }, [user.branch]);

  const uniqueRoles = useMemo(() => [...new Set(staffList.map(i => i.role))].sort(), [staffList]);

  const handleSaveMember = async (data) => {
    try {
        if (editingMember) {
            await axios.put(`http://127.0.0.1:5000/api/staff/${editingMember.id}`, data);
            setNotification({ message: 'Profile updated', type: 'success' });
        } else {
            // New user automatically gets assigned the manager's branch
            await axios.post('http://127.0.0.1:5000/api/staff', data);
            setNotification({ message: 'Team member added', type: 'success' });
        }
        fetchStaff();
        setIsModalOpen(false);
    } catch (err) {
        setNotification({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Remove this user?")) return;
    try {
        await axios.delete(`http://127.0.0.1:5000/api/staff/${id}`);
        setStaffList(staffList.filter(p => p.id !== id));
        setNotification({ message: 'User removed', type: 'error' });
    } catch (err) {
        setNotification({ message: 'Delete failed', type: 'error' });
    }
  };

  // Filtering
  const filteredStaff = useMemo(() => {
    return staffList.filter(person => {
      const matchSearch = person.name.toLowerCase().includes(search.toLowerCase()) || person.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === 'all' || person.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [search, filterRole, staffList]);

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield size={14} />;
      case 'manager': return <Briefcase size={14} />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden" onClick={() => setActiveMenu(null)}>
      <AnimatePresence>{notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}</AnimatePresence>
      {isModalOpen && <StaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveMember} initialData={editingMember} branch={user.branch} />}

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 border-b border-white/5 pb-8">
          <div><h1 className="text-4xl font-bold text-white tracking-tight mb-2">Team Management</h1><p className="text-slate-500 font-medium">Manage staff for <span className="text-indigo-400 font-bold">{user.branch}</span> Branch.</p></div>
          <button onClick={() => { setEditingMember(null); setIsModalOpen(true); }} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-500 transition-all"><Plus size={18} /> Add Member</button>
        </div>

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8 bg-white/[0.02] border border-white/5 p-2 rounded-2xl backdrop-blur-xl">
          <div className="relative w-full xl:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" placeholder="Search team..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-white pl-12 pr-4 py-3 rounded-xl focus:bg-white/5 focus:outline-none" /></div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <FilterDropdown label="Role" icon={Shield} options={uniqueRoles} value={filterRole} onChange={setFilterRole} />
            <div className="flex bg-black/20 p-1 rounded-xl"><button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500'}`}><Grid size={18} /></button><button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500'}`}><List size={18} /></button></div>
          </div>
        </div>

        <AnimatePresence mode='wait'>
          {viewMode === 'grid' && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((person, i) => (
                <motion.div key={person.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="group relative bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg">{person.name.charAt(0)}</div>
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setActiveMenu(activeMenu === person.id ? null : person.id)} className="text-slate-500 hover:text-white p-2 hover:bg-white/10 rounded-full"><MoreHorizontal size={20} /></button>
                        {activeMenu === person.id && (
                          <div className="absolute right-0 top-10 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl p-2 w-32 z-50">
                            <button onClick={() => handleSaveMember(person) || setEditingMember(person) || setIsModalOpen(true)} className="flex items-center w-full px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg gap-2"><Edit size={12} /> Edit</button>
                            <button onClick={() => handleDelete(person.id)} className="flex items-center w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg gap-2"><Trash2 size={12} /> Remove</button>
                          </div>
                        )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{person.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-4"><span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">{getRoleIcon(person.role)} {person.role}</span></div>
                  <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-3 text-sm text-slate-400"><Mail size={14} className="text-indigo-400" /> {person.email}</div>
                      <div className="flex items-center gap-3 text-sm text-slate-400"><Phone size={14} className="text-purple-400" /> {person.phone || 'N/A'}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}