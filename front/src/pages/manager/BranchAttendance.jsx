import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Clock, UserCheck, UserX, AlertTriangle, MoreHorizontal, 
  Calendar, Filter, CheckCircle2, MapPin, Download, XCircle,
  Edit, User, MessageSquare, Trash2, X, Save
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
        type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
        'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : type === 'error' ? <XCircle size={18} /> : <Clock size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. EDIT STATUS MODAL (NEW) ---
const StatusModal = ({ isOpen, onClose, onSave, employee }) => {
  const [formData, setFormData] = useState({ status: '', checkIn: '' });

  useEffect(() => {
    if (employee) {
      setFormData({ status: employee.status, checkIn: employee.checkIn });
    }
  }, [employee]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(employee.id, formData);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0b0f19] border border-white/10 w-full max-w-sm rounded-3xl p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-1">Update Status</h2>
        <p className="text-slate-500 text-sm mb-6">Modify attendance for <span className="text-indigo-400">{employee?.name}</span>.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Current Status</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer" 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option className="bg-slate-900" value="Present">Present</option>
              <option className="bg-slate-900" value="Late">Late</option>
              <option className="bg-slate-900" value="Absent">Absent</option>
              <option className="bg-slate-900" value="On Leave">On Leave</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Check-In Time</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50" 
              value={formData.checkIn} 
              onChange={e => setFormData({...formData, checkIn: e.target.value})}
              placeholder="e.g. 09:00 AM or --:--"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
            <Save size={18} /> Save Changes
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 3. STAT CARD COMPONENT ---
const AttendanceStat = ({ label, count, total, color, icon: Icon }) => (
  <div className={`relative overflow-hidden bg-white/[0.03] border border-white/5 p-4 rounded-2xl group hover:bg-white/[0.05] transition-all`}>
    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity ${color.replace('text', 'bg')}`} />
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}><Icon size={20} /></div>
      <span className="text-2xl font-bold text-white">{count}</span>
    </div>
    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
    <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
        transition={{ duration: 1 }}
        className={`h-full rounded-full ${color.replace('text', 'bg')}`} 
      />
    </div>
  </div>
);

// --- 4. MAIN COMPONENT ---
export default function BranchAttendance() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Senior Dev', dept: 'Engineering', checkIn: '08:55 AM', status: 'Present', avatarColor: 'from-pink-500 to-rose-500' },
    { id: 2, name: 'Bob Smith', role: 'UI Designer', dept: 'Design', checkIn: '--:--', status: 'Absent', avatarColor: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Charlie Brown', role: 'QA Tester', dept: 'Engineering', checkIn: '09:45 AM', status: 'Late', avatarColor: 'from-amber-500 to-orange-500' },
    { id: 4, name: 'Diana Prince', role: 'DevOps Eng', dept: 'Ops', checkIn: '09:00 AM', status: 'Present', avatarColor: 'from-purple-500 to-indigo-500' },
    { id: 5, name: 'Evan Wright', role: 'Backend Dev', dept: 'Engineering', checkIn: '--:--', status: 'On Leave', avatarColor: 'from-emerald-500 to-teal-500' },
    { id: 6, name: 'Frank Castle', role: 'Security', dept: 'Admin', checkIn: '07:30 AM', status: 'Present', avatarColor: 'from-slate-500 to-gray-500' },
  ]);

  // Actions
  const showToast = (message, type = 'success') => setNotification({ message, type });

  const handleExport = () => {
    showToast('Generating CSV report...', 'info');
    setTimeout(() => showToast('Attendance_Log_2026.csv downloaded!', 'success'), 1500);
  };

  const handleMenuAction = (action, employee) => {
    setActiveMenu(null);
    
    if (action === 'delete') {
        setEmployees(prev => prev.filter(e => e.id !== employee.id));
        showToast(`${employee.name} removed from list.`, 'error');
    } else if (action === 'edit') {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    } else if (action === 'message') {
        showToast(`Message sent to ${employee.name}.`, 'success');
    } else if (action === 'profile') {
        showToast(`Opening profile: ${employee.name}`, 'info');
    }
  };

  const handleSaveStatus = (id, updatedData) => {
    setEmployees(prev => prev.map(emp => 
        emp.id === id ? { ...emp, ...updatedData } : emp
    ));
    setIsModalOpen(false);
    showToast('Attendance status updated!', 'success');
  };

  // Logic: Filtering & Stats
  const filteredData = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || e.status.toLowerCase().replace(' ', '') === filterStatus.replace(' ', '');
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus, employees]);

  const stats = {
    present: employees.filter(e => e.status === 'Present').length,
    late: employees.filter(e => e.status === 'Late').length,
    absent: employees.filter(e => e.status === 'Absent').length,
    leave: employees.filter(e => e.status === 'On Leave').length,
    total: employees.length
  };

  // Visual Helpers
  const getStatusStyles = (status) => {
    switch(status) {
      case 'Present': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
      case 'Late': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock };
      case 'Absent': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: UserX };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Calendar };
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden" onClick={() => setActiveMenu(null)}>
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        {isModalOpen && (
            <StatusModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveStatus} 
                employee={selectedEmployee} 
            />
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Daily Attendance</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <MapPin size={16} className="text-indigo-400" />
              <span>New York Branch • {new Date().toLocaleDateString()}</span>
            </p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleExport(); }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 hover:text-white transition-all"
          >
            <Download size={16} /> Export Log
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AttendanceStat label="Present" count={stats.present} total={stats.total} color="text-emerald-400" icon={UserCheck} />
          <AttendanceStat label="Late Arrival" count={stats.late} total={stats.total} color="text-amber-400" icon={Clock} />
          <AttendanceStat label="Absent" count={stats.absent} total={stats.total} color="text-rose-400" icon={UserX} />
          <AttendanceStat label="On Leave" count={stats.leave} total={stats.total} color="text-purple-400" icon={Calendar} />
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white/[0.02] border border-white/5 p-2 rounded-2xl backdrop-blur-xl">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search employee..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 py-3 rounded-xl focus:bg-white/5 focus:outline-none placeholder:text-slate-600 transition-all font-medium"
            />
          </div>

          <div className="flex bg-black/20 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
            {['all', 'present', 'late', 'absent'].map((f) => (
              <button
                key={f}
                onClick={(e) => { e.stopPropagation(); setFilterStatus(f); }}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterStatus === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ATTENDANCE LIST */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md min-h-[400px]">
          
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-white/5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4 pl-2">Employee</div>
            <div className="col-span-3">Check-In</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/5">
            <AnimatePresence mode='popLayout'>
              {filteredData.map((emp, index) => {
                const style = getStatusStyles(emp.status);
                const StatusIcon = style.icon;

                return (
                  <motion.div
                    key={emp.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.04] transition-colors group relative"
                  >
                    {/* Name & Role */}
                    <div className="col-span-4 flex items-center gap-4 pl-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${emp.avatarColor} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{emp.name}</h4>
                        <p className="text-xs text-slate-500">{emp.role}</p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                        <Clock size={14} />
                      </div>
                      <span className={`text-sm font-mono font-medium ${emp.checkIn === '--:--' ? 'text-slate-600' : 'text-indigo-300'}`}>
                        {emp.checkIn}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${style.bg} ${style.color} ${style.border}`}>
                        <StatusIcon size={12} />
                        {emp.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 text-right relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === emp.id ? null : emp.id);
                        }}
                        className={`p-2 rounded-lg transition-colors ${activeMenu === emp.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeMenu === emp.id && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-10 w-40 bg-[#0b0f19] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                          >
                            <div className="p-1 flex flex-col gap-0.5">
                              <button onClick={(e) => { e.stopPropagation(); handleMenuAction('edit', emp); }} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                <Edit size={14} /> Edit Status
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleMenuAction('profile', emp); }} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                <User size={14} /> View Profile
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); handleMenuAction('message', emp); }} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-left">
                                <MessageSquare size={14} /> Message
                              </button>
                              <div className="h-px bg-white/5 my-1" />
                              <button onClick={(e) => { e.stopPropagation(); handleMenuAction('delete', emp); }} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left">
                                <Trash2 size={14} /> Remove
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {filteredData.length === 0 && (
              <div className="py-12 text-center">
                <div className="inline-block p-4 rounded-full bg-white/5 mb-3 text-slate-600"><Filter size={24} /></div>
                <p className="text-slate-500 font-medium">No records found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}