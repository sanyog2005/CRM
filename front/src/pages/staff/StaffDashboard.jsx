import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, Coffee, Clock, Calendar, CheckCircle2, 
  AlertCircle, Briefcase, MoreHorizontal, ArrowRight, 
  Megaphone, XCircle, Trash2, Download, Bell
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

// --- 2. STAT WIDGET ---
const StatWidget = ({ label, value, subtext, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-3xl group hover:bg-white/[0.05] transition-all"
  >
    <div className="flex justify-between items-start mb-3">
      <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 ${color}`}>
        <Icon size={20} />
      </div>
      {subtext && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border border-white/5 bg-white/5 ${color}`}>
          {subtext}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{label}</div>
  </motion.div>
);

// --- 3. TIMELINE ITEM ---
const TimelineItem = ({ time, action, type }) => {
  const getStyle = () => {
    switch (type) {
      case 'check-in': return 'bg-emerald-500 text-emerald-400 border-emerald-500/20';
      case 'check-out': return 'bg-rose-500 text-rose-400 border-rose-500/20';
      case 'break': return 'bg-amber-500 text-amber-400 border-amber-500/20';
      default: return 'bg-indigo-500 text-indigo-400 border-indigo-500/20';
    }
  };
  const style = getStyle();

  return (
    <div className="flex gap-4 items-center group">
      <div className="w-16 text-right text-xs font-mono text-slate-500 group-hover:text-slate-300 transition-colors">
        {time}
      </div>
      <div className="relative flex-1 pl-4 border-l border-white/10 group-hover:border-white/20 transition-colors py-2">
        <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border ${style.replace('text', 'bg').split(' ')[0]} ${style.split(' ')[2]}`} />
        <p className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{action}</p>
      </div>
    </div>
  );
};

// --- 4. ANNOUNCEMENT CARD (NEW) ---
const AnnouncementCard = () => {
  const notices = [
    { id: 1, title: "Office Closure", msg: "Office closed this Friday for maintenance.", date: "Today", important: true },
    { id: 2, title: "New Policy", msg: "Updated leave policy is now in effect.", date: "Yesterday", important: false },
    { id: 3, title: "Team Lunch", msg: "Join us for pizza at 1 PM!", date: "2 days ago", important: false },
  ];

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500"><Megaphone size={80} /></div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 border border-amber-500/30">
          <Bell size={18} />
        </div>
        <h3 className="font-bold text-white text-lg">Announcements</h3>
      </div>

      <div className="space-y-3 relative z-10 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
        {notices.map(notice => (
          <div key={notice.id} className="bg-black/20 p-3 rounded-xl border border-white/5 hover:bg-black/40 transition-colors group cursor-default">
            <div className="flex justify-between items-start mb-1">
              <h4 className={`text-sm font-bold ${notice.important ? 'text-rose-400' : 'text-slate-200'}`}>
                {notice.important && <AlertCircle size={12} className="inline mr-1 -mt-0.5" />}
                {notice.title}
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">{notice.date}</span>
            </div>
            <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
              {notice.msg}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 5. MAIN COMPONENT ---
export default function StaffDashboard() {
  const [status, setStatus] = useState('idle'); // idle | active | break | completed
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLogMenuOpen, setIsLogMenuOpen] = useState(false);
  
  // Timer Logic
  useEffect(() => {
    let interval;
    if (status === 'active') {
      interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Actions
  const showToast = (message, type = 'success') => setNotification({ message, type });

  const addLog = (action, type) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [{ id: Date.now(), time, action, type }, ...prev]);
  };

  const handleStart = () => {
    setStatus('active');
    addLog('Clocked In', 'check-in');
    showToast('Shift started successfully!');
  };

  const handleBreak = () => {
    if (status === 'break') {
      setStatus('active');
      addLog('Resumed Work', 'check-in');
      showToast('Welcome back to work!');
    } else {
      setStatus('break');
      addLog('Started Break', 'break');
      showToast('Break timer started.', 'info');
    }
  };

  const handleStop = () => {
    setStatus('completed');
    addLog('Clocked Out', 'check-out');
    showToast('Shift ended. Have a great evening!');
  };

  const handleLogAction = (action) => {
    setIsLogMenuOpen(false);
    if (action === 'clear') {
        setLogs([]);
        showToast('Activity history cleared.', 'error');
    } else if (action === 'export') {
        showToast('Daily log downloaded.', 'success');
    }
  };

  // Formatting
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return { h, m, s };
  };
  const timeDisplay = formatTime(elapsed);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden" onClick={() => setIsLogMenuOpen(false)}>
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[30%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">My Workstation</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-400" />
              <span>Full Stack Developer • Shift: 09:00 - 18:00</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
             <Calendar size={18} className="text-slate-400" />
             <span className="text-sm font-bold text-white">
               {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
             </span>
          </div>
        </div>

        {/* MAIN HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Timer Card */}
          <div className="lg:col-span-2">
            <motion.div 
              layout
              className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 overflow-hidden flex flex-col items-center justify-center text-center h-full min-h-[400px]"
            >
              <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000 ${
                status === 'active' ? 'bg-indigo-500/20' : 
                status === 'break' ? 'bg-amber-500/20' : 'bg-slate-500/10'
              }`} />

              <div className={`relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-8 transition-colors ${
                status === 'active' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' :
                status === 'break' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                'bg-white/5 border-white/10 text-slate-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-indigo-400 animate-pulse' : status === 'break' ? 'bg-amber-400' : 'bg-slate-400'}`} />
                {status === 'idle' ? 'Ready to Start' : status === 'active' ? 'Currently Working' : status === 'break' ? 'On Break' : 'Shift Completed'}
              </div>

              <div className="relative z-10 font-mono text-7xl md:text-9xl font-bold text-white tracking-tighter tabular-nums flex items-baseline gap-2 md:gap-4 mb-10">
                <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">{timeDisplay.h}</span>
                <span className="text-slate-600 animate-pulse">:</span>
                <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">{timeDisplay.m}</span>
                <span className="text-slate-600 animate-pulse">:</span>
                <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">{timeDisplay.s}</span>
              </div>

              <div className="relative z-10 flex flex-wrap justify-center gap-4 w-full max-w-md">
                {status === 'idle' && (
                  <button 
                    onClick={handleStart}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-900/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                  >
                    <Play fill="currentColor" /> Check In
                  </button>
                )}

                {(status === 'active' || status === 'break') && (
                  <>
                    <button 
                      onClick={handleBreak}
                      className={`flex-1 py-4 rounded-2xl font-bold text-lg border transition-all flex items-center justify-center gap-2 ${
                        status === 'break' 
                          ? 'bg-indigo-600 border-transparent text-white shadow-lg hover:bg-indigo-500' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {status === 'break' ? <Play fill="currentColor" size={20} /> : <Coffee size={20} />}
                      {status === 'break' ? 'Resume' : 'Break'}
                    </button>
                    
                    <button 
                      onClick={handleStop}
                      className="flex-1 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Square fill="currentColor" size={20} /> Check Out
                    </button>
                  </>
                )}

                {status === 'completed' && (
                  <div className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 size={24} /> See you tomorrow!
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Stats & Announcement */}
          <div className="space-y-6 flex flex-col">
            
            <div className="grid grid-cols-2 gap-4">
              <StatWidget label="Weekly Hrs" value="32.5" subtext="+2.5" icon={Clock} color="text-indigo-400" delay={0.1} />
              <StatWidget label="On Time" value="95%" subtext="Excellent" icon={CheckCircle2} color="text-emerald-400" delay={0.2} />
            </div>

            {/* Replaced Meeting Card with Announcement Card */}
            <div className="flex-1">
               <AnnouncementCard />
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: ACTIVITY LOG --- */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8 relative">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              Activity Log <span className="text-xs font-normal text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">Today</span>
            </h3>
            
            <div className="relative">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsLogMenuOpen(!isLogMenuOpen); }}
                    className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                >
                    <MoreHorizontal />
                </button>
                <AnimatePresence>
                    {isLogMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-10 w-40 bg-[#0b0f19] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                            <button onClick={() => handleLogAction('export')} className="flex items-center w-full px-4 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 text-left gap-2">
                                <Download size={14} /> Export Logs
                            </button>
                            <button onClick={() => handleLogAction('clear')} className="flex items-center w-full px-4 py-3 text-xs font-bold text-rose-400 hover:bg-rose-500/10 text-left gap-2 border-t border-white/5">
                                <Trash2 size={14} /> Clear Logs
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  className="overflow-hidden"
                >
                  <TimelineItem time={log.time} action={log.action} type={log.type} />
                </motion.div>
              ))}
            </AnimatePresence>

            {logs.length === 0 && (
              <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <div className="inline-block p-3 rounded-full bg-white/5 mb-3 text-slate-500">
                  <Play size={24} className="ml-1" />
                </div>
                <p className="text-slate-500 font-medium">Start your shift to see activity.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}