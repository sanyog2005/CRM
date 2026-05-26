import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle2, AlertCircle, Clock, FileText, Megaphone, 
  Calendar, MoreHorizontal, ArrowRight, TrendingUp, Activity,
  X, Send, RefreshCw, Trash2, Filter
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
        type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
      }`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <Activity size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. POST NOTICE MODAL ---
const NoticeModal = ({ isOpen, onClose, onPost }) => {
  const [text, setText] = useState('');

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
        
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Megaphone size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Post Announcement</h2>
            <p className="text-slate-500 text-xs">Notify all staff in this branch.</p>
          </div>
        </div>
        
        <textarea 
          autoFocus
          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500/50 min-h-[120px] resize-none mb-4 placeholder:text-slate-600"
          placeholder="Type your message here... (e.g. Office closes early today)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5">Cancel</button>
          <button 
            onClick={() => { onPost(text); setText(''); }}
            disabled={!text.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-amber-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} /> Post Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- 3. STAT CARD ---
const StatCard = ({ title, value, subtext, icon: Icon, color, delay }) => (
  <Link to="/manager/attendance" className="block h-full">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl overflow-hidden group hover:bg-white/[0.05] transition-all hover:-translate-y-1"
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${color.replace('text', 'bg')}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${color}`}>
          <Icon size={24} />
        </div>
        <div className={`px-2 py-1 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-white transition-colors`}>
          View
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-1 group-hover:text-slate-400 transition-colors">{title}</p>
        <p className="text-xs text-slate-600 mt-2 font-mono">{subtext}</p>
      </div>
    </motion.div>
  </Link>
);

// --- 4. ACTIVITY ITEM ---
const ActivityItem = ({ user, action, time, type }) => {
  const getColor = () => {
    switch(type) {
      case 'checkin': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'late': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'leave': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group cursor-default">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border text-xs font-bold ${getColor()}`}>
        {user.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-200 font-medium group-hover:text-white transition-colors">
          <span className="font-bold">{user}</span> {action}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

// --- 5. DONUT CHART ---
const DonutChart = ({ present, late, absent }) => {
  const total = present + late + absent;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  
  const presentOffset = circumference - (present / total) * circumference;
  const lateOffset = circumference - (late / total) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="50%" cy="50%" r={radius} stroke="#1e293b" strokeWidth="8" fill="transparent" />
        <circle cx="50%" cy="50%" r={radius} stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={presentOffset} className="transition-all duration-1000 ease-out" />
        <circle cx="50%" cy="50%" r={radius} stroke="#f59e0b" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={presentOffset + lateOffset} className="opacity-0" /> 
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{(present/total*100).toFixed(0)}%</span>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Attendance</span>
      </div>
    </div>
  );
}

// --- 6. MAIN COMPONENT ---
export default function ManagerDashboard() {
  const [notification, setNotification] = useState(null);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [feedMenuOpen, setFeedMenuOpen] = useState(false);

  const showToast = (msg, type = 'success') => setNotification({ message: msg, type });

  const handlePostNotice = (text) => {
    setIsNoticeOpen(false);
    showToast('Announcement broadcasted successfully!', 'success');
  };

  const handleFeedAction = (action) => {
    setFeedMenuOpen(false);
    if (action === 'refresh') showToast('Feed synced with server.', 'info');
    if (action === 'clear') showToast('Activity log cleared.', 'success');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden" onClick={() => setFeedMenuOpen(false)}>
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        {isNoticeOpen && <NoticeModal isOpen={isNoticeOpen} onClose={() => setIsNoticeOpen(false)} onPost={handlePostNotice} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-emerald-400">
                 <Activity size={24} />
               </div>
               <h1 className="text-4xl font-bold text-white tracking-tight">New York Branch</h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Daily Operations & Staff Overview</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-xl flex items-center gap-3">
             <Calendar size={18} className="text-indigo-400" />
             <span className="text-sm font-bold text-slate-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Staff" value="45" subtext="3 New this month" icon={Users} color="text-indigo-400" delay={0.1} />
          <StatCard title="Present Now" value="38" subtext="84% of workforce" icon={CheckCircle2} color="text-emerald-400" delay={0.2} />
          <StatCard title="Absent/Late" value="7" subtext="Requires attention" icon={AlertCircle} color="text-rose-400" delay={0.3} />
          <StatCard title="Leave Requests" value="5" subtext="Pending Review" icon={FileText} color="text-amber-400" delay={0.4} />
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Attendance Breakdown & Health */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-6">Today's Attendance</h3>
              <div className="flex items-center justify-between">
                <DonutChart present={38} late={4} absent={3} />
                <div className="space-y-3 flex-1 pl-6">
                   <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 text-slate-400"><div className="w-2 h-2 rounded-full bg-emerald-500" /> On Time</span><span className="font-bold text-white">38</span></div>
                   <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 text-slate-400"><div className="w-2 h-2 rounded-full bg-amber-500" /> Late</span><span className="font-bold text-white">4</span></div>
                   <div className="flex justify-between items-center text-sm"><span className="flex items-center gap-2 text-slate-400"><div className="w-2 h-2 rounded-full bg-rose-500" /> Absent</span><span className="font-bold text-white">3</span></div>
                   <Link to="/manager/attendance" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 mt-2 hover:gap-2 transition-all">Full Report <ArrowRight size={12} /></Link>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/manager/leaves" className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 rounded-2xl shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-transform group">
                <FileText size={24} className="text-white mb-3 opacity-80" />
                <h4 className="font-bold text-white">Review Leaves</h4>
                <p className="text-xs text-indigo-200 mt-1 opacity-70 group-hover:opacity-100">5 items pending</p>
              </Link>
              <button onClick={() => setIsNoticeOpen(true)} className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 transition-all group text-left">
                <Megaphone size={24} className="text-slate-400 mb-3 group-hover:text-amber-400 transition-colors" />
                <h4 className="font-bold text-slate-200 group-hover:text-white">Post Notice</h4>
                <p className="text-xs text-slate-500 mt-1">Notify staff</p>
              </button>
            </div>
          </div>

          {/* RIGHT: Live Branch Activity Feed */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col">
             <div className="flex justify-between items-center mb-6 relative">
               <div><h3 className="text-lg font-bold text-white">Live Branch Feed</h3><p className="text-xs text-slate-500">Real-time updates from your team</p></div>
               <div className="relative">
                 <button onClick={(e) => { e.stopPropagation(); setFeedMenuOpen(!feedMenuOpen); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
                 <AnimatePresence>
                   {feedMenuOpen && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-10 w-36 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl z-50 p-1">
                       <button onClick={() => handleFeedAction('refresh')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-left"><RefreshCw size={12} /> Refresh</button>
                       <button onClick={() => handleFeedAction('filter')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-left"><Filter size={12} /> Filter</button>
                       <button onClick={() => handleFeedAction('clear')} className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg text-left"><Trash2 size={12} /> Clear</button>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
             </div>

             <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
               <ActivityItem user="Alice Johnson" action="checked in on time" time="Just now" type="checkin" />
               <ActivityItem user="Bob Smith" action="is running late (traffic)" time="5 mins ago" type="late" />
               <ActivityItem user="Charlie Brown" action="submitted a sick leave request" time="15 mins ago" type="leave" />
               <ActivityItem user="Diana Prince" action="checked in" time="08:58 AM" type="checkin" />
               <ActivityItem user="Evan Wright" action="updated their profile" time="08:45 AM" type="update" />
               <ActivityItem user="System" action="Branch unlocked by Security" time="07:30 AM" type="system" />
             </div>

             <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
               <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                 <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                 System Online
               </div>
               <span className="text-xs text-slate-600 font-mono">Last sync: 2s ago</span>
             </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}