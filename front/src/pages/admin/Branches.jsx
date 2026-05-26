import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Search, Plus, Users, MoreVertical, TrendingUp, 
  Phone, Globe, Building2, CheckCircle2, XCircle, X, Save, 
  Edit, Trash2, Mail 
} from 'lucide-react';

// --- TOAST ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />} <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- BRANCH MODAL ---
const BranchModal = ({ isOpen, onClose, onSave, initialData, allStaff }) => {
  const [formData, setFormData] = useState({ 
    name: '', location: '', manager_id: '', capacity: '', status: 'Active', color: 'from-indigo-500 to-blue-600' 
  });

  // Filter only managers from the full staff list
  const managers = allStaff.filter(s => s.role === 'manager');

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({ name: '', location: '', manager_id: '', capacity: '', status: 'Active', color: 'from-indigo-500 to-blue-600' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-white mb-1">{initialData ? 'Edit Branch' : 'New Branch'}</h2>
        <p className="text-slate-500 text-sm mb-6">Enter location details below.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required type="text" placeholder="Branch Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input required type="text" placeholder="Location" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-slate-400 ml-1 block mb-1">Manager</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0b0f19] focus:outline-none" value={formData.manager_id} onChange={e => setFormData({...formData, manager_id: e.target.value})}>
                    <option value="">Select Manager</option>
                    {managers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-slate-400 ml-1 block mb-1">Capacity</label>
                <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs font-bold text-slate-400 ml-1 block mb-1">Status</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0b0f19] focus:outline-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Setup">Setup</option>
                </select>
             </div>
             <div>
                <label className="text-xs font-bold text-slate-400 ml-1 block mb-1">Theme</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white bg-[#0b0f19] focus:outline-none" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                  <option value="from-indigo-500 to-blue-600">Blue</option>
                  <option value="from-emerald-500 to-teal-600">Emerald</option>
                  <option value="from-purple-500 to-pink-600">Purple</option>
                  <option value="from-amber-500 to-orange-600">Amber</option>
                </select>
             </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2">
            <Save size={18} /> {initialData ? 'Update Branch' : 'Create Branch'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- BRANCH CARD ---
const BranchCard = ({ branch, manager, index, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300">
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${branch.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${branch.color} flex items-center justify-center text-white shadow-lg`}><Building2 size={24} /></div>
        <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-500 hover:text-white p-1 rounded-full hover:bg-white/10"><MoreVertical size={20} /></button>
              {menuOpen && (
                  <div className="absolute top-8 right-0 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl p-2 w-32 z-20">
                      <button onClick={() => { onEdit(branch); setMenuOpen(false); }} className="flex items-center w-full px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-left gap-2"><Edit size={12}/> Edit</button>
                      <button onClick={() => { onDelete(branch.id); setMenuOpen(false); }} className="flex items-center w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg text-left gap-2"><Trash2 size={12}/> Delete</button>
                  </div>
              )}
        </div>
      </div>

      <div className="relative z-10 space-y-1 mb-6">
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{branch.name}</h3>
        <div className="flex items-center gap-2 text-slate-400 text-sm"><MapPin size={14} className="text-slate-500" /> {branch.location}</div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 mb-6 p-4 bg-black/20 rounded-2xl border border-white/5">
        <div>
            <p className="text-xs text-slate-500 mb-1">Manager</p>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                    {/* Fallback to '?' if manager name is missing */}
                    {(manager?.name || branch.manager_name || '?').charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-slate-300 truncate">
                    {manager?.name || branch.manager_name || 'Unassigned'}
                </span>
            </div>
        </div>
        <div>
            <p className="text-xs text-slate-500 mb-1">Capacity</p>
            <div className="flex items-center gap-2"><Users size={14} className="text-indigo-400" /><span className="text-xs font-bold text-white">{branch.capacity}</span></div>
        </div>
      </div>

      {/* ✅ MANAGER CONTACT ACTIONS */}
      <div className="relative z-10 flex gap-2 pt-4 border-t border-white/5">
        <a 
            href={manager?.phone ? `tel:${manager.phone}` : '#'} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                manager?.phone 
                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' 
                : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title={manager?.phone ? `Call ${manager.phone}` : "No phone number available"}
            onClick={e => !manager?.phone && e.preventDefault()}
        >
            <Phone size={14} /> Call
        </a>
        <a 
            href={manager?.email ? `mailto:${manager.email}` : '#'} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                manager?.email 
                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white' 
                : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title={manager?.email ? `Email ${manager.email}` : "No email available"}
            onClick={e => !manager?.email && e.preventDefault()}
        >
            <Mail size={14} /> Email
        </a>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [staff, setStaff] = useState([]); 
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [notification, setNotification] = useState(null);

  // ✅ Fetch Branches AND Staff (Managers)
  const fetchAllData = async () => {
    try {
        const [branchRes, staffRes] = await Promise.all([
            axios.get('http://127.0.0.1:5000/api/branches'),
            axios.get('http://127.0.0.1:5000/api/staff')
        ]);
        
        console.log("Branches Loaded:", branchRes.data);
        console.log("Staff Loaded:", staffRes.data);

        setBranches(branchRes.data);
        setStaff(staffRes.data);
    } catch (err) { console.error("Error fetching data:", err); }
  };

  useEffect(() => { fetchAllData(); }, []);

  const handleSaveBranch = async (data) => {
    try {
        if (editingBranch) {
            // Update Branch
            await axios.put(`http://127.0.0.1:5000/api/branches/${editingBranch.id}`, data);
            setNotification({ message: 'Branch updated successfully', type: 'success' });
        } else {
            // Create New Branch
            await axios.post('http://127.0.0.1:5000/api/branches', data);
            setNotification({ message: 'New branch created', type: 'success' });
        }

        // ⚡ SYNC: Update the assigned Manager's profile to this branch
        if (data.manager_id) {
            const selectedManager = staff.find(s => String(s.id) === String(data.manager_id));
            if (selectedManager) {
                console.log(`Syncing Manager: ${selectedManager.name} -> ${data.name}`);
                await axios.put(`http://127.0.0.1:5000/api/staff/${selectedManager.id}`, {
                    ...selectedManager,
                    branch: data.name // 🔥 Critical: This updates the User's branch too
                });
            }
        }

        fetchAllData();
        setIsModalOpen(false);
    } catch (err) {
        console.error(err);
        setNotification({ message: 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this branch?")) return;
    try {
        await axios.delete(`http://127.0.0.1:5000/api/branches/${id}`);
        setBranches(branches.filter(b => b.id !== id));
        setNotification({ message: 'Branch deleted', type: 'error' });
    } catch (err) { console.error(err); }
  };

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden">
      <AnimatePresence>{notification && <Toast {...notification} onClose={() => setNotification(null)} />}</AnimatePresence>
      {isModalOpen && <BranchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveBranch} initialData={editingBranch} allStaff={staff} />}
      
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        <div className="flex justify-between items-end border-b border-white/5 pb-8">
            <div><h1 className="text-4xl font-bold text-white">Branch Network</h1><p className="text-slate-500">Manage locations and assign managers.</p></div>
            <button onClick={() => { setEditingBranch(null); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-500"><Plus size={18} /> Add Branch</button>
        </div>

        <div className="relative w-full md:w-96"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} /><input type="text" placeholder="Search branches..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/[0.03] text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:outline-none" /></div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <AnimatePresence>
             {filteredBranches.map((branch, index) => {
               // ✅ ROBUST LOOKUP: Match by ID first, then Name
               const managerDetails = staff.find(s => 
                   (branch.manager_id && String(s.id) === String(branch.manager_id)) || 
                   (s.name === branch.manager_name)
               ) || {};
               
               // Debug log to console to help troubleshooting
               // console.log(`Branch: ${branch.name}, ManagerID: ${branch.manager_id}, Found: ${managerDetails.name}`);

               return (
                 <BranchCard 
                    key={branch.id} 
                    branch={branch} 
                    manager={managerDetails} 
                    index={index} 
                    onEdit={(b) => { setEditingBranch(b); setIsModalOpen(true); }} 
                    onDelete={handleDelete} 
                 />
               );
             })}
           </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}