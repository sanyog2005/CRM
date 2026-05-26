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

// --- 2. REUSABLE FILTER DROPDOWN ---
const FilterDropdown = ({ label, icon: Icon, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-xs font-bold ${
          value !== 'all' 
            ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
        }`}
      >
        <Icon size={14} />
        <span>{value === 'all' ? label : value}</span>
        <ChevronDown size={14} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-[60] overflow-hidden"
          >
            <div className="p-3 border-b border-white/5 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                autoFocus
                type="text" 
                placeholder={`Search ${label}...`} 
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
              <button
                onClick={() => { onChange('all'); setIsOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between group transition-colors ${
                  value === 'all' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>All {label}s</span>
                {value === 'all' && <Check size={14} />}
              </button>
              <div className="h-px bg-white/5 my-1 mx-2" />
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onChange(opt); setIsOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between group transition-colors ${
                      value === opt ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    {value === opt && <Check size={14} />}
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-600">No results found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. STAFF MODAL (ADD & EDIT) ---
const StaffModal = ({ isOpen, onClose, onSave, initialData, availableBranches }) => {
  // Use first available branch as default if adding new user
  const defaultBranch = availableBranches.length > 0 ? availableBranches[0] : '';

  const [formData, setFormData] = useState({ 
    name: '', role: 'staff', dept: 'Engineering', email: '', phone: '', branch: defaultBranch, status: 'Active', password: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' });
    } else {
      setFormData({ name: '', role: 'staff', dept: 'Engineering', email: '', phone: '', branch: defaultBranch, status: 'Active', password: '' });
    }
  }, [initialData, isOpen, defaultBranch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0b0f19] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-1">{initialData ? 'Edit Profile' : 'New User Access'}</h2>
        <p className="text-slate-500 text-sm mb-6">
          {initialData ? 'Update employee details below.' : 'Create login credentials and profile.'}
        </p>
        
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1">Full Name</label>
            <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1">Role</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none bg-[#0b0f19]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1">Department</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} />
              </div>
          </div>

          {/* Email / Login ID */}
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1">Email (Login ID)</label>
            <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* PASSWORD FIELD - Only required for NEW users */}
          {!initialData && (
             <div>
                <label className="text-xs font-bold text-emerald-400 ml-1 flex items-center gap-1"><Lock size={12}/> Set Default Password</label>
                <input required type="text" placeholder="e.g. Welcome@123" className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-100 placeholder:text-emerald-500/50 focus:outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                <p className="text-[10px] text-slate-500 mt-1 ml-1">User can change this later.</p>
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
              {/* ✅ DYNAMIC BRANCH SELECTION */}
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1">Branch</label>
                <div className="relative">
                    <select 
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none appearance-none bg-[#0b0f19] cursor-pointer" 
                        value={formData.branch} 
                        onChange={e => setFormData({...formData, branch: e.target.value})}
                    >
                        <option value="" disabled>Select Branch</option>
                        {availableBranches.map(branch => (
                            <option key={branch} value={branch} className="bg-[#0b0f19] text-white">
                                {branch}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={14} />
                    </div>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1">Phone</label>
                <input type="text" placeholder="+1..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
          </div>

          {/* Status Selection (Only for Edit) */}
          {initialData && (
              <div>
                <label className="text-xs font-bold text-slate-400 ml-1">Account Status</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none bg-[#0b0f19]" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Offline</option>
                </select>
             </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mt-4">
            <Save size={18} /> {initialData ? 'Update Profile' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
export default function AllStaff() {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // ✅ DYNAMIC STATES
  const [staffList, setStaffList] = useState([]);
  const [branches, setBranches] = useState([]);

  // ✅ FETCH DATA ON LOAD
  useEffect(() => {
    const fetchAllData = async () => {
        try {
            // 1. Fetch Staff
            const staffRes = await axios.get('http://127.0.0.1:5000/api/staff');
            setStaffList(staffRes.data);

            // 2. Fetch Branches from API
            const branchRes = await axios.get('http://127.0.0.1:5000/api/branches');
            // Assuming API returns [{id:1, name:'London'}, {id:2, name:'NY'}]
            // Extract just the names for the simple dropdown
            const branchNames = branchRes.data.map(b => b.name);
            setBranches(branchNames);

        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };
    fetchAllData();
  }, []);

  const uniqueRoles = useMemo(() => [...new Set(staffList.map(i => i.role))].sort(), [staffList]);

  // ACTIONS
  const showToast = (message, type = 'success') => setNotification({ message, type });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (data) => {
    try {
        if (editingMember) {
            await axios.put(`http://127.0.0.1:5000/api/staff/${editingMember.id}`, data);
            showToast(`Updated profile for ${data.name}`);
        } else {
            await axios.post('http://127.0.0.1:5000/api/staff', data);
            showToast(`Account created for ${data.name}`);
        }
        
        // Refresh Staff List
        const res = await axios.get('http://127.0.0.1:5000/api/staff');
        setStaffList(res.data);
        setIsModalOpen(false);
    } catch (err) {
        const errorMsg = err.response?.data || 'Operation failed. Check server.';
        showToast(errorMsg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("This will revoke their login access. Continue?")) return;
    
    try {
        await axios.delete(`http://127.0.0.1:5000/api/staff/${id}`);
        setStaffList(staffList.filter(p => p.id !== id)); 
        setActiveMenu(null);
        showToast('Access revoked & user removed.', 'error');
    } catch (err) {
        showToast('Delete failed.', 'error');
    }
  };

  const handleCopy = (text, type) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    showToast(`${type} copied to clipboard!`);
  };

  // FILTERING LOGIC
  const filteredStaff = useMemo(() => {
    return staffList.filter(person => {
      const matchSearch = person.name.toLowerCase().includes(search.toLowerCase()) || 
                          person.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = filterRole === 'all' || person.role === filterRole;
      const matchBranch = filterBranch === 'all' || person.branch === filterBranch;
      return matchSearch && matchRole && matchBranch;
    });
  }, [search, filterRole, filterBranch, staffList]);

  // STYLES
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'On Leave': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield size={14} />;
      case 'manager': return <Briefcase size={14} />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden" onClick={() => setActiveMenu(null)}>
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        {isModalOpen && (
          <StaffModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveMember} 
            initialData={editingMember}
            availableBranches={branches} // ✅ PASSING BRANCHES FROM API
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Access Management</h1>
            <p className="text-slate-500 font-medium">Create users, set permissions, and manage staff profiles.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 hover:scale-105"
          >
            <Plus size={18} /> New User
          </button>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8 bg-white/[0.02] border border-white/5 p-2 rounded-2xl backdrop-blur-xl relative z-50">
          
          <div className="relative w-full xl:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full bg-transparent text-white pl-12 pr-4 py-3 rounded-xl focus:bg-white/5 focus:outline-none transition-all placeholder:text-slate-600" 
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Role Filter */}
            <FilterDropdown 
              label="Role" 
              icon={Shield} 
              options={uniqueRoles} 
              value={filterRole} 
              onChange={setFilterRole} 
            />

            {/* Branch Filter (Dynamic) */}
            <FilterDropdown 
              label="Branch" 
              icon={Building2} 
              options={branches} // ✅ USING API DATA
              value={filterBranch} 
              onChange={setFilterBranch} 
            />
            
            {/* Clear Filters */}
            {(filterRole !== 'all' || filterBranch !== 'all') && (
              <button 
                onClick={() => { setFilterRole('all'); setFilterBranch('all'); }}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 px-2"
              >
                Clear
              </button>
            )}

            <div className="h-8 w-px bg-white/10 hidden md:block mx-1" />

            {/* View Toggle */}
            <div className="flex bg-black/20 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <AnimatePresence mode='wait'>
          {viewMode === 'grid' && (
            <motion.div key="grid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0">
              {filteredStaff.map((person, i) => (
                <motion.div
                  key={person.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6 relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">
                        {person.name.charAt(0)}
                      </div>
                      
                      {/* Action Menu */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setActiveMenu(activeMenu === person.id ? null : person.id)} 
                          className="text-slate-500 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                        {activeMenu === person.id && (
                          <div className="absolute right-0 top-10 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl p-2 w-32 z-50">
                            <button 
                              onClick={() => handleOpenEdit(person)} 
                              className="flex items-center w-full px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-left gap-2"
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(person.id)} 
                              className="flex items-center w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg text-left gap-2"
                            >
                              <Trash2 size={12} /> Revoke
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white">{person.name}</h3>
                    <div className="flex items-center gap-2 mt-1 mb-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                        {getRoleIcon(person.role)} {person.role}
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getStatusColor(person.status)}`}>{person.status}</span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <button onClick={() => handleCopy(person.email, 'Email')} className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors w-full hover:bg-white/5 p-1 rounded-lg">
                        <Mail size={14} className="text-indigo-400" /> {person.email}
                      </button>
                      <button onClick={() => handleCopy(person.phone, 'Phone')} className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors w-full hover:bg-white/5 p-1 rounded-lg">
                        <Phone size={14} className="text-purple-400" /> {person.phone || 'N/A'}
                      </button>
                      <div className="flex items-center gap-3 text-sm text-slate-400 group-hover:text-slate-300 p-1">
                        <MapPin size={14} className="text-emerald-400" /> {person.branch}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {viewMode === 'list' && (
             <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden relative z-0">
               {filteredStaff.map((person, i) => (
                 <div key={person.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.04] border-b border-white/5">
                    <div className="col-span-4 flex items-center gap-4 pl-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">{person.name.charAt(0)}</div>
                      <span className="font-bold text-white">{person.name}</span>
                    </div>
                    <div className="col-span-3 text-sm text-slate-400">{person.email}</div>
                    <div className="col-span-2 text-sm text-slate-400">{person.branch}</div>
                    <div className="col-span-2"><span className={`text-[10px] px-2 py-1 rounded border ${getStatusColor(person.status)}`}>{person.status}</span></div>
                    <div className="col-span-1 flex justify-end pr-4">
                        <button onClick={() => handleDelete(person.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded">
                          <Trash2 size={16}/>
                        </button>
                    </div>
                 </div>
               ))}
             </motion.div>
          )}
        </AnimatePresence>

        {filteredStaff.length === 0 && (
          <div className="text-center py-20">
              <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/5 mb-4 text-slate-600"><Search size={32} /></div>
              <h3 className="text-xl font-bold text-white">No users found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}