import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Calendar, Clock, FileText, Filter, ChevronRight,
  AlertCircle, Briefcase, Palmtree, Thermometer, CheckCircle2,
  XCircle, RotateCcw
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
      {type === 'success' ? <CheckCircle2 size={18} /> : type === 'error' ? <XCircle size={18} /> : <RotateCcw size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. REQUEST CARD COMPONENT ---
const RequestCard = ({ req, onAction }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case 'Sick Leave': return { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Thermometer };
      case 'Vacation': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Palmtree };
      default: return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Briefcase };
    }
  };

  const style = getTypeStyles(req.type);
  const TypeIcon = style.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300"
    >
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${style.bg} opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none blur-xl`} />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${req.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {req.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{req.name}</h3>
            <p className="text-xs text-slate-500">{req.role}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${style.bg} ${style.color} ${style.border}`}>
          <TypeIcon size={12} />
          {req.type}
        </span>
      </div>

      {/* Date & Reason Block */}
      <div className="relative z-10 bg-black/20 rounded-2xl p-4 border border-white/5 mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 text-slate-400">
            <Calendar size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Duration</p>
            <p className="text-sm font-medium text-slate-200">{req.dates} <span className="text-slate-600">•</span> {req.days} Days</p>
          </div>
        </div>
        <div className="h-px bg-white/5 w-full" />
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/5 text-slate-400">
            <FileText size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Reason</p>
            <p className="text-sm text-slate-300 italic">"{req.reason}"</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {req.status === 'Pending' ? (
        <div className="relative z-10 flex gap-3">
          <button 
            onClick={() => onAction(req.id, 'Approved')}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-3 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all group/btn"
          >
            <Check size={16} className="group-hover/btn:scale-110 transition-transform" /> Approve
          </button>
          <button 
            onClick={() => onAction(req.id, 'Rejected')}
            className="flex-1 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 py-3 rounded-xl text-sm font-bold hover:bg-rose-500 hover:text-white transition-all group/btn"
          >
            <X size={16} className="group-hover/btn:scale-110 transition-transform" /> Reject
          </button>
        </div>
      ) : (
        <div className="relative z-10 flex items-center gap-3">
            <div className={`flex-1 py-3 rounded-xl text-center text-sm font-bold border ${
                req.status === 'Approved' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
                {req.status === 'Approved' ? 'Request Approved' : 'Request Rejected'}
            </div>
            {/* Added Revert Button for History Tab */}
            <button 
                onClick={() => onAction(req.id, 'Pending')}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Revert to Pending"
            >
                <RotateCcw size={18} />
            </button>
        </div>
      )}
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function LeaveRequests() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [notification, setNotification] = useState(null);
  
  // Enhanced Mock Data
  const [requests, setRequests] = useState([
    { id: 1, name: 'John Doe', role: 'Frontend Dev', type: 'Sick Leave', dates: 'Jan 24 - Jan 25', days: 2, reason: 'Flu and high fever', status: 'Pending', avatarColor: 'from-indigo-500 to-purple-500' },
    { id: 2, name: 'Sarah Connor', role: 'Project Manager', type: 'Casual Leave', dates: 'Feb 10', days: 1, reason: 'Personal family matter', status: 'Pending', avatarColor: 'from-rose-500 to-orange-500' },
    { id: 3, name: 'Kyle Reese', role: 'Security Ops', type: 'Vacation', dates: 'Mar 1 - Mar 5', days: 5, reason: 'Planned trip to mountains', status: 'Pending', avatarColor: 'from-emerald-500 to-teal-500' },
    { id: 4, name: 'Ellen Ripley', role: 'Ops Lead', type: 'Sick Leave', dates: 'Jan 10', days: 1, reason: 'Migraine', status: 'Approved', avatarColor: 'from-blue-500 to-cyan-500' },
    { id: 5, name: 'Rick Deckard', role: 'Investigator', type: 'Vacation', dates: 'Dec 20 - Jan 01', days: 12, reason: 'Retirement plans', status: 'Rejected', avatarColor: 'from-amber-500 to-yellow-500' },
  ]);

  const showToast = (message, type = 'success') => setNotification({ message, type });

  const handleAction = (id, action) => {
    // Update State
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));

    // Show Notification
    if (action === 'Approved') showToast('Leave request approved!', 'success');
    else if (action === 'Rejected') showToast('Leave request rejected.', 'error');
    else if (action === 'Pending') showToast('Request reverted to pending.', 'info');
  };

  const filteredRequests = useMemo(() => {
    if (activeTab === 'Pending') {
      return requests.filter(r => r.status === 'Pending');
    }
    return requests.filter(r => r.status !== 'Pending');
  }, [requests, activeTab]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden">
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Leave Management</h1>
            <p className="text-slate-500 font-medium">Review and manage employee time-off requests.</p>
          </div>
          
          {/* Tabs */}
          <div className="bg-white/5 p-1 rounded-xl flex border border-white/10">
            {['Pending', 'History'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab ? 'text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-600 rounded-lg shadow-lg"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab}
                  {tab === 'Pending' && requests.filter(r => r.status === 'Pending').length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {requests.filter(r => r.status === 'Pending').length}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT GRID */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode='popLayout'>
            {filteredRequests.map((req) => (
              <RequestCard key={req.id} req={req} onAction={handleAction} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredRequests.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
             <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/5 mb-4 text-slate-600">
               {activeTab === 'Pending' ? <Check size={32} /> : <Clock size={32} />}
             </div>
             <h3 className="text-xl font-bold text-white">
               {activeTab === 'Pending' ? 'All caught up!' : 'No history found'}
             </h3>
             <p className="text-slate-500 mt-2">
               {activeTab === 'Pending' 
                 ? 'There are no pending leave requests to review.' 
                 : 'Past leave requests will appear here.'}
             </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}