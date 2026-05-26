import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  AlertCircle,
  BarChart2,
  PieChart,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// --- REUSABLE TOAST COMPONENT ---
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

// --- SUB-COMPONENTS ---

const SummaryCard = ({ title, value, percentage, trend, color, icon: Icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.05] transition-all duration-300 hover:border-white/20`}
  >
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500 ${color.replace('text', 'bg')}`} />
    
    <div className="relative z-10 flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${color}`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border border-white/5 ${trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {Math.abs(trend)}%
      </div>
    </div>
    
    <div className="relative z-10">
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      <p className="text-slate-400 text-sm font-medium mt-1">{title}</p>
      
      <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.3, duration: 1 }}
          className={`h-full rounded-full ${color.replace('text', 'bg')}`} 
        />
      </div>
    </div>
  </motion.div>
);

const DepartmentRow = ({ name, count, percentage, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group cursor-default"
  >
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm font-medium text-slate-300 group-hover:text-white">{name}</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div style={{ width: `${percentage}%` }} className={`h-full rounded-full ${color}`} />
      </div>
      <span className="text-xs font-bold text-slate-400 w-8 text-right">{percentage}%</span>
    </div>
  </motion.div>
);

// --- MAIN COMPONENT ---

export default function AttendanceReports() {
  const [timeRange, setTimeRange] = useState('Week');
  const [notification, setNotification] = useState(null);

  // Actions
  const showToast = (message, type = 'success') => setNotification({ message, type });

  const handleExport = () => {
    showToast('Exporting attendance report...', 'success');
    // Simulate delay for realism
    setTimeout(() => {
        // Here you would trigger actual download logic
    }, 1500);
  };

  const handleRangeChange = (range) => {
    setTimeRange(range);
    showToast(`Showing data for: ${range}`, 'success');
  };

  // Mock Data (Could be dynamic based on timeRange)
  const weeklyStats = [
    { day: 'Mon', present: 85, absent: 5, late: 10 },
    { day: 'Tue', present: 88, absent: 2, late: 10 },
    { day: 'Wed', present: 82, absent: 8, late: 10 },
    { day: 'Thu', present: 90, absent: 5, late: 5 },
    { day: 'Fri', present: 85, absent: 10, late: 5 },
    { day: 'Sat', present: 40, absent: 5, late: 0 },
    { day: 'Sun', present: 0, absent: 0, late: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden">
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Attendance Analytics</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Calendar size={16} />
              <span>Report for: Jan 15 - Jan 22, 2026</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="bg-white/5 p-1 rounded-xl flex border border-white/10">
               {['Week', 'Month', 'Year'].map((range) => (
                 <button
                   key={range}
                   onClick={() => handleRangeChange(range)}
                   className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                     timeRange === range ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'
                   }`}
                 >
                   {range}
                 </button>
               ))}
             </div>

             <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 hover:text-white transition-all"
             >
               <Download size={16} /> Export
             </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard title="Avg. Present" value="86%" percentage={86} trend={2.4} color="text-emerald-400" icon={Users} delay={0.1} />
          <SummaryCard title="Avg. Absent" value="6%" percentage={6} trend={-0.8} color="text-rose-400" icon={AlertCircle} delay={0.2} />
          <SummaryCard title="Avg. Late" value="8%" percentage={8} trend={1.2} color="text-amber-400" icon={Clock} delay={0.3} />
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BarChart2 size={20} className="text-indigo-400" /> 
                  Weekly Overview
                </h3>
                <p className="text-sm text-slate-500 mt-1">Breakdown of attendance status per day</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> Present</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div> Late</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div> Absent</div>
              </div>
            </div>

            <div className="h-72 flex items-end justify-between gap-4 px-2">
              {weeklyStats.map((stat, i) => (
                <div key={stat.day} className="w-full flex flex-col justify-end group relative">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none">
                     <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl text-xs whitespace-nowrap">
                       <div className="font-bold text-white mb-1">{stat.day} Stats</div>
                       <div className="text-emerald-400">Present: {stat.present}%</div>
                       <div className="text-amber-400">Late: {stat.late}%</div>
                       <div className="text-rose-400">Absent: {stat.absent}%</div>
                     </div>
                  </div>
                  <div className="w-full h-full flex flex-col-reverse rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/5">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${stat.present}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="w-full bg-emerald-500 relative group-hover:bg-emerald-400 transition-colors"><div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div></motion.div>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${stat.late}%` }} transition={{ duration: 1, delay: 0.2 + (i * 0.1) }} className="w-full bg-amber-500 relative group-hover:bg-amber-400 transition-colors" />
                    <motion.div initial={{ height: 0 }} animate={{ height: `${stat.absent}%` }} transition={{ duration: 1, delay: 0.4 + (i * 0.1) }} className="w-full bg-rose-500 relative group-hover:bg-rose-400 transition-colors" />
                  </div>
                  <p className="text-center mt-4 text-xs font-bold text-slate-500 group-hover:text-white transition-colors uppercase tracking-wider">{stat.day}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Breakdown */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl h-fit"
          >
            <div className="flex items-center gap-2 mb-6">
              <PieChart size={20} className="text-purple-400" />
              <h3 className="font-bold text-white">Dept. Performance</h3>
            </div>

            <div className="space-y-2">
              <DepartmentRow name="Engineering" count={45} percentage={92} color="bg-indigo-500" delay={0.6} />
              <DepartmentRow name="Operations" count={30} percentage={88} color="bg-blue-500" delay={0.7} />
              <DepartmentRow name="Sales" count={25} percentage={84} color="bg-emerald-500" delay={0.8} />
              <DepartmentRow name="Marketing" count={15} percentage={95} color="bg-purple-500" delay={0.9} />
              <DepartmentRow name="Support" count={20} percentage={78} color="bg-rose-500" delay={1.0} />
            </div>

            <div className="mt-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 p-5 rounded-2xl">
              <h4 className="text-white font-bold text-sm mb-1">Detailed Analysis</h4>
              <p className="text-xs text-slate-400 mb-3">Download the full PDF report for detailed logs per employee.</p>
              <button 
                onClick={handleExport}
                className="text-xs font-bold text-indigo-300 flex items-center gap-1 hover:gap-2 transition-all"
              >
                Download Now <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}