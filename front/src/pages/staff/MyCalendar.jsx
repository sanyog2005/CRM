import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Clock, MapPin, 
  CheckCircle2, XCircle, AlertCircle, Coffee,
  Calendar as CalendarIcon
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
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. DAY CELL COMPONENT ---
const DayCell = ({ day, status, isWeekend, isSelected, onClick, index }) => {
  if (!day) return <div className="h-24 md:h-32 bg-transparent" />;

  const getStyle = () => {
    if (isSelected) return 'ring-2 ring-indigo-500 bg-white/[0.08] z-10 shadow-[0_0_20px_rgba(99,102,241,0.3)]';
    if (isWeekend) return 'bg-white/[0.01] text-slate-700 hover:bg-white/[0.03]';
    
    switch (status) {
      case 'present': return 'bg-emerald-500/[0.05] border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]';
      case 'absent': return 'bg-rose-500/[0.05] border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'late': return 'bg-amber-500/[0.05] border-amber-500/20 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]';
      case 'leave': return 'bg-purple-500/[0.05] border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/40';
      default: return 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]';
    }
  };

  return (
    <motion.div
      layoutId={`day-${day}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.01 }}
      onClick={() => onClick(day, status)}
      className={`relative h-24 md:h-32 rounded-2xl border border-transparent p-3 cursor-pointer transition-all duration-300 group flex flex-col justify-between overflow-hidden ${getStyle()}`}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm font-bold ${isWeekend ? 'text-slate-700' : 'text-slate-300'}`}>{day}</span>
        {status && !isWeekend && (
          <div className={`w-2 h-2 rounded-full ${
            status === 'present' ? 'bg-emerald-500' : 
            status === 'late' ? 'bg-amber-500' : 
            status === 'absent' ? 'bg-rose-500' : 'bg-purple-500'
          } shadow-[0_0_8px_currentColor]`} />
        )}
      </div>

      {!isWeekend && status && (
        <div className="mt-auto">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">{status}</p>
          {status === 'present' && <p className="text-[10px] opacity-60 font-mono mt-1">09:00 - 18:00</p>}
          {status === 'late' && <p className="text-[10px] opacity-60 font-mono mt-1">09:45 - 18:30</p>}
        </div>
      )}
    </motion.div>
  );
};

// --- 3. DETAIL SIDEBAR ---
const DayDetails = ({ date, status, onClose, onRequestCorrection }) => {
  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white">Date: {date}</h3>
          <p className="text-slate-500 text-sm">Daily Activity Log</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition">
          <XCircle size={24} />
        </button>
      </div>

      <div className={`p-6 rounded-2xl mb-8 flex items-center gap-4 border ${
        status === 'present' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
        status === 'late' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
        status === 'absent' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
        'bg-purple-500/10 border-purple-500/20 text-purple-400'
      }`}>
        <div className="p-3 bg-white/10 rounded-xl">
          {status === 'present' ? <CheckCircle2 size={24} /> :
           status === 'late' ? <Clock size={24} /> :
           status === 'absent' ? <AlertCircle size={24} /> : <Coffee size={24} />}
        </div>
        <div>
          <h4 className="font-bold text-lg capitalize">{status || 'Weekend'}</h4>
          <p className="text-xs opacity-70">
            {status === 'present' ? 'Regular Shift Completed' :
             status === 'late' ? 'Checked in late' :
             status === 'absent' ? 'No check-in recorded' : 'Off duty'}
          </p>
        </div>
      </div>

      {(status === 'present' || status === 'late') && (
        <div className="space-y-6 relative flex-1">
          <div className="absolute left-[19px] top-2 bottom-0 w-[2px] bg-white/5" />
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400"><MapPin size={16} /></div>
            <h5 className="text-white font-bold">Checked In</h5>
            <p className="text-slate-500 text-xs mt-1">Front Desk Biometric</p>
            <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-xs font-mono text-indigo-300">{status === 'late' ? '09:45 AM' : '09:00 AM'}</span>
          </div>
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400"><CheckCircle2 size={16} /></div>
            <h5 className="text-white font-bold">Tasks Completed</h5>
            <p className="text-slate-500 text-xs mt-1">Daily Standup, Code Review</p>
            <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-xs font-mono text-emerald-300">5 Tasks</span>
          </div>
          <div className="relative pl-12">
            <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center text-slate-400"><Clock size={16} /></div>
            <h5 className="text-white font-bold">Checked Out</h5>
            <p className="text-slate-500 text-xs mt-1">System Auto-log</p>
            <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-xs font-mono text-slate-400">06:00 PM</span>
          </div>
        </div>
      )}

      {status === 'absent' && (
        <div className="text-center py-10">
          <p className="text-slate-500 text-sm">No activity logs found for this date.</p>
          <button 
            onClick={() => onRequestCorrection(date)}
            className="mt-4 text-indigo-400 text-sm hover:underline font-bold"
          >
            Request Correction?
          </button>
        </div>
      )}
    </motion.div>
  );
};

// --- 4. MAIN COMPONENT ---
export default function MyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Jan 2026
  const [selectedDay, setSelectedDay] = useState(null); // { day: 1, status: 'present' }
  const [direction, setDirection] = useState(0);
  const [notification, setNotification] = useState(null);

  // Helper Functions
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Mon start
  };

  // Generate Data (Wrapped in useMemo to prevent re-generation on clicks)
  const gridData = useMemo(() => {
    const days = getDaysInMonth(currentDate);
    const offset = getFirstDayOfMonth(currentDate);
    const grid = Array(offset).fill(null);
    
    for (let i = 1; i <= days; i++) {
      const isWeekend = (offset + i) % 7 === 6 || (offset + i) % 7 === 0;
      let status = null;
      if (!isWeekend) {
        const rand = Math.random();
        if (rand > 0.9) status = 'absent';
        else if (rand > 0.8) status = 'late';
        else if (rand > 0.75) status = 'leave';
        else status = 'present';
      }
      grid.push({ day: i, status, isWeekend });
    }
    return grid;
  }, [currentDate]);

  const stats = {
    present: gridData.filter(d => d?.status === 'present').length,
    late: gridData.filter(d => d?.status === 'late').length,
    absent: gridData.filter(d => d?.status === 'absent').length,
  };

  // Handlers
  const changeMonth = (dir) => {
    setDirection(dir);
    setSelectedDay(null);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + dir, 1));
  };

  const handleRequestCorrection = (date) => {
    setNotification({ message: `Correction request sent for Date: ${date}`, type: 'success' });
    setSelectedDay(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden">
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Attendance History</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white">
                  <ChevronLeft size={20} />
                </button>
                <span className="w-40 text-center font-bold text-white">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide flex flex-col items-center">
               <span className="text-xl">{stats.present}</span> Present
             </div>
             <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wide flex flex-col items-center">
               <span className="text-xl">{stats.late}</span> Late
             </div>
             <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wide flex flex-col items-center">
               <span className="text-xl">{stats.absent}</span> Absent
             </div>
          </div>
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CALENDAR GRID */}
          <div className={`lg:col-span-2 ${selectedDay ? 'lg:col-span-2' : 'lg:col-span-3'} transition-all duration-500`}>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
              
              <div className="grid grid-cols-7 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest py-2">
                    {day}
                  </div>
                ))}
              </div>

              <AnimatePresence mode='wait' custom={direction}>
                <motion.div
                  key={currentDate.toString()}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -50 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-7 gap-2 md:gap-4"
                >
                  {gridData.map((data, i) => (
                    <DayCell 
                      key={i} 
                      index={i}
                      day={data?.day} 
                      status={data?.status} 
                      isWeekend={data?.isWeekend}
                      isSelected={selectedDay?.day === data?.day}
                      onClick={(d, s) => setSelectedDay({ day: d, status: s })}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DETAIL SIDEBAR (Slides in) */}
          <AnimatePresence>
            {selectedDay && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1 h-full"
              >
                <DayDetails 
                  date={selectedDay.day} 
                  status={selectedDay.status} 
                  onClose={() => setSelectedDay(null)}
                  onRequestCorrection={handleRequestCorrection} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}