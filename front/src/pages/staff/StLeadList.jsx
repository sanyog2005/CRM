import { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // ✅ Import XLSX
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, MoreHorizontal, Eye, Edit, Trash2, 
  ChevronDown, ChevronLeft, ChevronRight, Calendar, User, MapPin, Phone, CheckCircle2,
  AlertCircle, X, ArrowUpDown, Download, Upload, FileSpreadsheet,
  Loader2, Save, Building2, DollarSign, Clock, Mail, Bell
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
        type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
        'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. REMINDER DETAILS MODAL ---
const ReminderDetailsModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0b0f19] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute right-5 top-5 text-slate-500 hover:text-white transition-colors"><X size={18} /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><Bell size={20} /></div>
          <div><h3 className="text-lg font-bold text-white">Reminder Details</h3><p className="text-xs text-slate-500">Scheduled Follow-up</p></div>
        </div>
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Reason</p><p className="text-sm font-bold text-white">{lead.followUpReason || 'General Follow-up'}</p></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Date</p><div className="flex items-center gap-2 text-sm text-indigo-300 font-mono"><Calendar size={12} /> {new Date(lead.followUpDate).toLocaleDateString()}</div></div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Time</p><div className="flex items-center gap-2 text-sm text-indigo-300 font-mono"><Clock size={12} /> {new Date(lead.followUpDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div></div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Note</p><p className="text-sm text-slate-300 italic">"{lead.followUpNote || 'No additional notes provided.'}"</p></div>
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all text-sm">Dismiss</button>
      </motion.div>
    </div>
  );
};

// --- 3. FOLLOW UP MODAL ---
const FollowUpModal = ({ isOpen, onClose, onSave, lead }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('General Follow-up');
  const [note, setNote] = useState('');

  if (!isOpen || !lead) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = `${date} ${time}:00`; 
    onSave(lead.id, formattedDate, note, reason);
  };

  const reasons = [ "General Follow-up", "No Answer", "Requested Call Back", "Send Quotation", "Negotiation", "Payment" ];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 w-full max-w-sm rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white"><X size={20} /></button>
        <h2 className="text-xl font-bold text-white mb-1">Schedule Follow-up</h2>
        <p className="text-slate-500 text-xs mb-6">For lead: <span className="text-indigo-400">{lead.name || 'Unknown'}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-400 block mb-1">Date</label><input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-indigo-500/50" /></div>
            <div><label className="text-xs font-bold text-slate-400 block mb-1">Time</label><input required type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-indigo-500/50" /></div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Reason</label>
            <div className="relative">
              <select value={reason} onChange={e => setReason(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer bg-[#0b0f19]">
                {reasons.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
            </div>
          </div>
          <div><label className="text-xs font-bold text-slate-400 block mb-1">Note</label><textarea rows="3" value={note} onChange={e => setNote(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none resize-none" placeholder="Add details..." /></div>
          <button type="submit" className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"><Clock size={18} /> Save Reminder</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 4. VIEW DETAILS MODAL ---
const ViewLeadModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 w-full max-w-lg rounded-3xl p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white"><X size={20} /></button>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {(lead.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div><h2 className="text-2xl font-bold text-white">{lead.name || 'Unknown Lead'}</h2><div className="flex items-center gap-2 text-slate-400 text-sm mt-1"><span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono">{lead.status}</span><span>•</span><span className="flex items-center gap-1"><Building2 size={12}/> {lead.company || 'N/A'}</span></div></div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-xs text-slate-500 font-bold uppercase mb-1">Contact Info</p><div className="flex flex-col gap-1 text-sm text-white font-mono"><div className="flex items-center gap-2"><Phone size={14} className="text-emerald-400" /> {lead.phone || 'N/A'}</div><div className="flex items-center gap-2"><Mail size={14} className="text-blue-400" /> {lead.email || 'N/A'}</div></div></div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-xs text-slate-500 font-bold uppercase mb-1">Value & Activity</p><div className="flex flex-col gap-1 text-sm text-white font-mono"><div className="flex items-center gap-2"><DollarSign size={14} className="text-amber-400" /> {lead.value || 0}</div><div className="flex items-center gap-2 text-xs text-slate-400"><Calendar size={12}/> Created: {new Date(lead.created_at || Date.now()).toLocaleDateString()}</div></div></div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5"><p className="text-xs text-slate-500 font-bold uppercase mb-1">Notes</p><p className="text-sm text-slate-300 italic">"{lead.notes || 'No notes available'}"</p></div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end"><button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all">Close</button></div>
      </motion.div>
    </div>
  );
};

// --- 5. EDIT LEAD MODAL ---
const EditLeadModal = ({ isOpen, onClose, onSave, lead }) => {
  const [formData, setFormData] = useState(lead || {});
  useEffect(() => { if (lead) setFormData(lead); }, [lead]);
  if (!isOpen) return null;
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0b0f19] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white"><X size={20} /></button>
        <h2 className="text-2xl font-bold text-white mb-6">Edit Lead</h2>
        <form onSubmit={(e)=>{e.preventDefault(); onSave(formData)}} className="space-y-4">
          <div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Full Name</label><input type="text" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
          <div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Company Name</label><input type="text" value={formData.company || ''} onChange={e => handleChange('company', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Phone</label><input type="text" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div><div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Value ($)</label><input type="text" value={formData.value || ''} onChange={e => handleChange('value', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div></div>
          <div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Email</label><input type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Status</label>
                <select value={formData.status || 'New'} onChange={e => handleChange('status', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none cursor-pointer bg-[#0b0f19]">
                    {['New', 'Contacted', 'Qualified', 'Negotiation', 'Lost'].map(s => <option key={s} className="bg-slate-900">{s}</option>)}
                </select>
            </div>
            {/* 🔒 BRANCH READ ONLY FOR MANAGER */}
            <div>
                <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Branch</label>
                <input type="text" value={formData.branch} disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" />
            </div>
          </div>
          <div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Assigned Staff</label><input type="text" value={formData.staff || ''} onChange={e => handleChange('staff', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" /></div>
          <div><label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Notes</label><textarea rows="3" value={formData.notes || ''} onChange={e => handleChange('notes', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 resize-none" /></div>
          <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"><Save size={18} /> Save Changes</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 6. IMPORT MODAL (NEW) ---
const ImportModal = ({ isOpen, onClose, onImport }) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                
                // Process keys to lowercase for compatibility
                const processedData = data.map(row => {
                    const newRow = {};
                    Object.keys(row).forEach(key => {
                        newRow[key.toLowerCase()] = row[key];
                    });
                    return newRow;
                });

                onImport(processedData);
                setIsUploading(false);
                onClose();
            };
            reader.readAsBinaryString(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0b0f19] border border-white/10 w-full max-w-md rounded-3xl p-8">
                <h2 className="text-white font-bold mb-4">Import Leads</h2>
                <p className="text-slate-500 text-sm mb-6">Select an .xlsx or .csv file to import leads automatically.</p>
                
                <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                />

                <div className="flex gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-400 text-sm font-bold">Cancel</button>
                    <button 
                        onClick={() => fileInputRef.current.click()} 
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                        {isUploading ? 'Processing...' : 'Select File'}
                    </button>
                </div>
            </div>
        </div>
    )
};

// --- 7. UI HELPER COMPONENTS ---
const StatusBadge = ({ status }) => {
  const styles = { 'New': 'bg-blue-500/10 text-blue-400 border-blue-500/20', 'Contacted': 'bg-amber-500/10 text-amber-400 border-amber-500/20', 'Qualified': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', 'Negotiation': 'bg-purple-500/10 text-purple-400 border-purple-500/20', 'Lost': 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  const normalized = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'New';
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[normalized] || 'bg-slate-500/10 text-slate-400'}`}>{normalized}</span>;
};
const FilterDropdown = ({ icon: Icon, label, options, value, onChange }) => (
  <div className="relative group"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Icon size={14} /></div><select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 focus:outline-none focus:border-indigo-500/50 cursor-pointer min-w-[140px]"><option value="All">All {label}s</option>{options.map(opt => <option key={opt} value={opt} className="bg-[#0b0f19]">{opt}</option>)}</select><div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500"><ChevronDown size={14} /></div></div>
);

// --- 8. MAIN COMPONENT ---
export default function StLeadList() {
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  // ✅ PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // Modal States
  const [viewModal, setViewModal] = useState({ isOpen: false, lead: null });
  const [editModal, setEditModal] = useState({ isOpen: false, lead: null });
  const [followUpModal, setFollowUpModal] = useState({ isOpen: false, lead: null });
  const [reminderDetailsModal, setReminderDetailsModal] = useState({ isOpen: false, lead: null });

  const [filters, setFilters] = useState({ status: 'All', staff: 'All' });
  const [sortOrder, setSortOrder] = useState('latest'); 

  // ✅ DYNAMIC STATE
  const [leads, setLeads] = useState([]);
  
  // ✅ GET MANAGER INFO
  const user = JSON.parse(localStorage.getItem('user')) || { branch: 'Headquarters' };

  // ✅ FETCH LEADS (Filtered by Branch)
  const fetchLeads = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/leads');
        const formatted = res.data
            .filter(l => l.branch === user.branch) // 🔒 Branch Filter
            .map(l => ({
                ...l,
                followUpDate: l.follow_up_date,
                followUpReason: l.follow_up_reason,
                followUpNote: l.follow_up_note,
                lastFollowUp: l.follow_up_date || l.created_at
            }));
        setLeads(formatted);
    } catch (err) {
        console.error(err);
    }
  };

  useEffect(() => { fetchLeads(); }, [user.branch]);

  // ✅ Reset Page when Filters Change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, itemsPerPage]);

  const staffMembers = [...new Set(leads.map(l => l.staff || 'Unassigned'))];
  const statuses = ['New', 'Contacted', 'Qualified', 'Negotiation', 'Lost'];

  const showToast = (msg, type = 'success') => setNotification({ message: msg, type });

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
        await axios.delete(`http://127.0.0.1:5000/api/leads/${id}`);
        setLeads(leads.filter(l => l.id !== id));
        setActiveMenu(null);
        showToast('Lead removed successfully', 'error');
    } catch(err) { showToast('Failed to delete', 'error'); }
  };

  const handleUpdate = async (updatedLead) => {
    try {
        await axios.put(`http://127.0.0.1:5000/api/leads/${updatedLead.id}`, updatedLead);
        fetchLeads();
        setEditModal({ isOpen: false, lead: null });
        showToast(`Lead updated successfully!`);
    } catch (err) { showToast('Update failed', 'error'); }
  };

  const handleFollowUpSave = async (id, date, note, reason) => {
    try {
        await axios.put(`http://127.0.0.1:5000/api/leads/followup/${id}`, { date, note, reason });
        fetchLeads();
        setFollowUpModal({ isOpen: false, lead: null });
        showToast('Reminder set successfully!');
    } catch (err) { showToast('Failed to set reminder', 'error'); }
  };

  const handleAction = (action, lead) => {
    setActiveMenu(null);
    if(action === 'View') setViewModal({ isOpen: true, lead });
    else if(action === 'Edit') setEditModal({ isOpen: true, lead });
    else if (action === 'FollowUp') setFollowUpModal({ isOpen: true, lead });
  };

  const handleViewReminder = (e, lead) => {
    e.stopPropagation();
    if (lead.followUpDate) {
        setReminderDetailsModal({ isOpen: true, lead });
    } else {
        handleAction('FollowUp', lead); 
    }
  };

  // ✅ BULK IMPORT
  const handleBulkImport = async (importedData) => {
    if (!importedData || importedData.length === 0) return;

    // Enhance data with Branch Info
    const enrichedData = importedData.map(lead => ({
        ...lead,
        branch: user.branch, // 🔒 Force assign to Manager's Branch
        staff: lead.staff || 'Unassigned',
        status: lead.status || 'New',
        source: lead.source || 'Import'
    }));

    try {
        await axios.post('http://127.0.0.1:5000/api/leads/bulk', enrichedData);
        fetchLeads(); 
        showToast(`${enrichedData.length} leads imported successfully!`);
    } catch (err) {
        console.error("Import failed", err);
        showToast("Failed to import leads.", "error");
    }
  };

  // ✅ EXPORT CSV
  const handleExportCSV = () => {
    showToast('Preparing CSV file...', 'info');
    
    const headers = ["Name", "Company", "Phone", "Email", "Source", "Branch", "Assigned Staff", "Status", "Value", "Created Date", "Last Follow Up"];
    
    const rows = leads.map(lead => [
        `"${(lead.name || '').replace(/"/g, '""')}"`,
        `"${(lead.company || '').replace(/"/g, '""')}"`,
        `"${(lead.phone || '').replace(/"/g, '""')}"`,
        `"${(lead.email || '').replace(/"/g, '""')}"`,
        `"${(lead.source || '').replace(/"/g, '""')}"`,
        `"${(lead.branch || '').replace(/"/g, '""')}"`,
        `"${(lead.staff || '').replace(/"/g, '""')}"`,
        `"${(lead.status || '').replace(/"/g, '""')}"`,
        lead.value || 0,
        `"${new Date(lead.created_at).toLocaleDateString()}"`,
        `"${lead.lastFollowUp ? new Date(lead.lastFollowUp).toLocaleDateString() : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => showToast('Leads_Export.csv downloaded!', 'success'), 1500);
    }
  };

  // ✅ FILTER LOGIC
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const searchLower = search.toLowerCase();
      const nameMatch = (lead.name?.toLowerCase() || '').includes(searchLower);
      const emailMatch = (lead.email?.toLowerCase() || '').includes(searchLower);
      const phoneMatch = (lead.phone || '').toString().includes(search);
      const matchSearch = nameMatch || emailMatch || phoneMatch;

      const matchStatus = filters.status === 'All' || (lead.status || 'New') === filters.status;
      const matchStaff = filters.staff === 'All' || (lead.staff || 'Unassigned') === filters.staff;

      return matchSearch && matchStatus && matchStaff;
    }).sort((a, b) => {
      const dateA = new Date(a.lastFollowUp || a.created_at || 0);
      const dateB = new Date(b.lastFollowUp || b.created_at || 0);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  }, [leads, search, filters, sortOrder]);

  // ✅ PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden" onClick={() => setActiveMenu(null)}>
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        {viewModal.isOpen && <ViewLeadModal isOpen={viewModal.isOpen} onClose={() => setViewModal({ isOpen: false, lead: null })} lead={viewModal.lead} />}
        {editModal.isOpen && <EditLeadModal isOpen={editModal.isOpen} onClose={() => setEditModal({ isOpen: false, lead: null })} onSave={handleUpdate} lead={editModal.lead} />}
        {isImportOpen && <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={handleBulkImport} />}
        {followUpModal.isOpen && <FollowUpModal isOpen={followUpModal.isOpen} onClose={() => setFollowUpModal({ isOpen: false, lead: null })} onSave={handleFollowUpSave} lead={followUpModal.lead} />}
        {reminderDetailsModal.isOpen && <ReminderDetailsModal isOpen={reminderDetailsModal.isOpen} onClose={() => setReminderDetailsModal({ isOpen: false, lead: null })} lead={reminderDetailsModal.lead} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10 space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Branch Leads</h1>
            <p className="text-slate-500 font-medium">Viewing leads for: <span className="text-indigo-400 font-bold">{user.branch}</span></p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:scale-105"><Upload size={16} /> Import Excel</button>
             <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 hover:text-white transition-all"><Download size={16} /> Export CSV</button>
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          <div className="relative w-full xl:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-black/20 text-white pl-12 pr-4 py-2.5 rounded-xl border border-white/5 focus:border-indigo-500/50 focus:outline-none" />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <FilterDropdown icon={CheckCircle2} label="Status" options={statuses} value={filters.status} onChange={(val) => setFilters({...filters, status: val})} />
            <FilterDropdown icon={User} label="Staff" options={staffMembers} value={filters.staff} onChange={(val) => setFilters({...filters, staff: val})} />
            <div className="h-8 w-px bg-white/10 hidden md:block mx-2" />
            <button onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-all"><ArrowUpDown size={14} /> {sortOrder === 'latest' ? 'Latest' : 'Oldest'}</button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Staff</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Exp. Value</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Reminder</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode='popLayout'>
                  {/* ✅ MAP OVER CURRENT LEADS (Paginated) */}
                  {currentLeads.map((lead, index) => (
                    <motion.tr key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: index * 0.05 }} className="group hover:bg-white/[0.04] transition-colors cursor-pointer" onClick={() => handleAction('View', lead)}>
                      
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                            {String(lead.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div><div className="font-bold text-slate-200 text-sm group-hover:text-white">{lead.name || 'Unnamed Lead'}</div><div className="text-xs text-slate-500 flex items-center gap-1"><Building2 size={10}/> {lead.company || 'N/A'}</div></div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1">
                           <div className="text-xs text-slate-300 font-mono flex items-center gap-2"><Phone size={12} className="text-emerald-400" /> {lead.phone || 'N/A'}</div>
                           <div className="text-xs text-slate-400 font-mono flex items-center gap-2"><Mail size={12} className="text-blue-400" /> {lead.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="p-5"><span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">{lead.source || 'Unknown'}</span></td>
                      <td className="p-5"><div className="text-sm text-slate-300 flex items-center gap-2"><MapPin size={14} className="text-slate-500" /> {lead.branch || 'Unknown'}</div></td>
                      <td className="p-5"><div className="text-sm text-slate-300 flex items-center gap-2"><User size={14} className="text-slate-500" /> {lead.staff || 'Unassigned'}</div></td>
                      <td className="p-5"><StatusBadge status={lead.status || 'New'} /></td>
                      <td className="p-5"><div className="text-sm font-bold text-emerald-400 flex items-center gap-1"><DollarSign size={12}/> {lead.value || 0}</div></td>

                      <td className="p-5" onClick={(e) => handleViewReminder(e, lead)}>
                        {lead.followUpDate ? (
                            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit cursor-pointer hover:bg-amber-500/20 transition-colors group/rem">
                                <Bell size={14} className="text-amber-400" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-amber-200">{new Date(lead.followUpDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                    <span className="text-[9px] text-amber-400/70">{new Date(lead.followUpDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit cursor-pointer hover:bg-white/5 transition-colors opacity-40 hover:opacity-100 group/add">
                                <Clock size={14} /> <span className="text-[10px] font-bold hidden group-hover/add:block">Set</span>
                            </div>
                        )}
                      </td>

                      <td className="p-5 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === lead.id ? null : lead.id); }} className={`p-2 rounded-lg transition-all ${activeMenu === lead.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}><MoreHorizontal size={18} /></button>
                        <AnimatePresence>
                          {activeMenu === lead.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="absolute right-12 top-2 z-50 w-36 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                              <div className="p-1 flex flex-col gap-0.5">
                                <button onClick={() => handleAction('View', lead)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-left"><Eye size={12} /> View</button>
                                <button onClick={() => handleAction('Edit', lead)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-left"><Edit size={12} /> Edit</button>
                                <button onClick={() => handleAction('FollowUp', lead)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-left"><Clock size={12} /> Follow Up</button>
                                <div className="h-px bg-white/5 my-1" />
                                <button onClick={() => handleDelete(lead.id)} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg text-left"><Trash2 size={12} /> Delete</button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredLeads.length === 0 && <div className="py-20 text-center"><div className="inline-block p-4 rounded-full bg-white/5 mb-4 text-slate-600"><Search size={32} /></div><h3 className="text-lg font-bold text-white">No leads found</h3></div>}
          
          {/* ✅ PAGINATION CONTROLS */}
          {filteredLeads.length > 0 && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-white/5">
                <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>
                        Showing <span className="font-bold text-white">{indexOfFirstItem + 1}</span> to <span className="font-bold text-white">{Math.min(indexOfLastItem, filteredLeads.length)}</span> of <span className="font-bold text-white">{filteredLeads.length}</span> entries
                    </span>
                    {/* Rows Per Page Selector */}
                    <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-slate-600">Rows:</span>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                            className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                        >
                            <option value={5} className="bg-[#0b0f19]">5</option>
                            <option value={10} className="bg-[#0b0f19]">10</option>
                            <option value={20} className="bg-[#0b0f19]">20</option>
                            <option value={50} className="bg-[#0b0f19]">50</option>
                            <option value={100} className="bg-[#0b0f19]">100</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}