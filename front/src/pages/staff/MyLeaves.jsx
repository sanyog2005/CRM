import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Clock, CheckCircle2, XCircle, 
  FileText, Thermometer, Palmtree, Briefcase, 
  ChevronRight, MoreHorizontal, X, Save
} from 'lucide-react';

// --- 1. REUSABLE TOAST ---
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
      {type === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. LEAVE BALANCE CARD ---
const BalanceCard = ({ type, used, total, color, icon: Icon, delay }) => {
  const percentage = (used / total) * 100;
  const remaining = total - used;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/[0.05] transition-all"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${color.replace('text', 'bg')}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${color}`}>
          <Icon size={24} />
        </div>
        <span className="text-2xl font-bold text-white">{remaining}</span>
      </div>
      
      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{type}</p>
        <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono">
          <span>Used: {used}</span>
          <span>Total: {total}</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: delay + 0.2 }}
            className={`h-full rounded-full ${color.replace('text', 'bg')}`} 
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. APPLY LEAVE MODAL ---
const ApplyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ type: 'Vacation', startDate: '', endDate: '', reason: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple duration calc
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1; 

    onSubmit({ ...formData, days });
  };

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
        
        <h2 className="text-2xl font-bold text-white mb-1">Request Leave</h2>
        <p className="text-slate-500 text-sm mb-6">Submit your time-off request for approval.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Leave Type</label>
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option className="bg-slate-900" value="Vacation">🌴 Vacation</option>
              <option className="bg-slate-900" value="Sick Leave">🌡️ Sick Leave</option>
              <option className="bg-slate-900" value="Casual">💼 Casual Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Start Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">End Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block">Reason</label>
            <textarea 
              required
              rows="3"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 resize-none"
              placeholder="Brief description..."
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
            <Save size={18} /> Submit Request
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- 4. MAIN COMPONENT ---
export default function MyLeaves() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Mock Data
  const [history, setHistory] = useState([
    { id: 1, type: 'Sick Leave', dates: 'Jan 10 - Jan 11', days: 2, status: 'Approved', reason: 'Flu' },
    { id: 2, type: 'Vacation', dates: 'Dec 24 - Dec 30', days: 7, status: 'Approved', reason: 'Family Trip' },
    { id: 3, type: 'Casual', dates: 'Nov 15', days: 1, status: 'Rejected', reason: 'Personal' },
  ]);

  const showToast = (msg, type = 'success') => setNotification({ message: msg, type });

  const handleApply = (data) => {
    const newRequest = {
      id: Date.now(),
      type: data.type,
      dates: `${new Date(data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      days: data.days,
      status: 'Pending',
      reason: data.reason
    };
    
    setHistory([newRequest, ...history]);
    setIsModalOpen(false);
    showToast('Leave request submitted successfully!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Rejected': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden">
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        {isModalOpen && <ApplyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleApply} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">My Leaves</h1>
            <p className="text-slate-500 font-medium">Manage your time off and view balance.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg hover:scale-105"
          >
            <Plus size={18} /> Apply for Leave
          </button>
        </div>

        {/* BALANCES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BalanceCard type="Vacation" used={7} total={20} color="text-emerald-400" icon={Palmtree} delay={0.1} />
          <BalanceCard type="Sick Leave" used={3} total={10} color="text-rose-400" icon={Thermometer} delay={0.2} />
          <BalanceCard type="Casual" used={2} total={8} color="text-indigo-400" icon={Briefcase} delay={0.3} />
        </div>

        {/* HISTORY LIST */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText size={20} className="text-slate-400" /> Request History
          </h3>

          <div className="space-y-4">
            <AnimatePresence>
              {history.map((req, index) => (
                <motion.div 
                  key={req.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      req.type === 'Vacation' ? 'bg-emerald-500/10 text-emerald-400' : 
                      req.type === 'Sick Leave' ? 'bg-rose-500/10 text-rose-400' : 
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {req.type === 'Vacation' ? <Palmtree size={20} /> : req.type === 'Sick Leave' ? <Thermometer size={20} /> : <Briefcase size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{req.type}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar size={12} /> {req.dates}
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span>{req.days} Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                    <button className="p-2 text-slate-500 hover:text-white transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}