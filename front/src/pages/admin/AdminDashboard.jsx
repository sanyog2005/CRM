import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  MoreHorizontal,
  Plus,
  Download,
  FileText,
  UserPlus,
  ShieldAlert,
  Calendar,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';

// --- TOAST NOTIFICATION COMPONENT ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  const icons = {
    success: <CheckCircle2 size={18} />,
    info: <Info size={18} />,
    error: <XCircle size={18} />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${styles[type] || styles.info}`}
    >
      {icons[type] || icons.info}
      <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, subtext, trend, color, glowColor, icon: Icon, link, delay }) => (
  <Link to={link} className="block h-full group">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.3 }}
      className={`relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.05] ${glowColor} hover:shadow-2xl`}
    >
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500 ${color.replace('text', 'bg')}`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl border border-white/10 bg-white/5 ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full border border-white/5 ${trend > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
            <TrendingUp size={12} className="mr-1" />
            {trend}%
          </span>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mt-1">{title}</p>
      </div>
      
      <div className="mt-4 text-xs font-medium text-slate-500 relative z-10 flex items-center gap-1 group-hover:text-slate-300 transition-colors">
        {subtext} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  </Link>
);

const ActivityItem = ({ icon: Icon, color, title, time, user }) => (
  <div className="flex gap-4 items-start group p-3 hover:bg-white/5 rounded-xl transition-colors cursor-default border border-transparent hover:border-white/5">
    <div className={`mt-1 min-w-[36px] h-9 rounded-lg flex items-center justify-center border border-white/10 bg-black/40 ${color}`}>
      <Icon size={16} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{title}</p>
      <p className="text-xs text-slate-500 mt-1">
        by <span className="font-medium text-slate-400">{user}</span> • {time}
      </p>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="text-slate-500 hover:text-indigo-400 transition-colors">
        <MoreHorizontal size={16} />
      </button>
    </div>
  </div>
);

// --- MAIN DASHBOARD ---

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null); // { message, type }

  // Action Handlers
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const handleExport = () => {
    showNotification("Preparing system data export...", "info");
    setTimeout(() => {
      showNotification("Data exported to CSV successfully!", "success");
    }, 2000);
  };

  const handleNewWidget = () => {
    showNotification("Widget customization panel opening...", "info");
  };

  const handleGenerateReport = () => {
    showNotification("Generating PDF report...", "info");
    setTimeout(() => {
      showNotification("Report downloaded successfully.", "success");
    }, 1500);
  };

  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 45 },
    { day: 'Thu', value: 95 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 30 },
    { day: 'Sun', value: 20 },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative p-8">
      
      {/* --- TOAST NOTIFICATION CONTAINER --- */}
      <AnimatePresence>
        {notification && (
          <Toast 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
      </AnimatePresence>

      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                 <Activity size={24} />
               </div>
               <h1 className="text-4xl font-bold text-white tracking-tight">Command Center</h1>
            </div>
            <p className="text-slate-500 font-medium ml-1 flex items-center gap-2">
              <Calendar size={14} />
              <span>System Status: Optimal • Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 hover:text-white transition-all hover:border-white/20"
            >
              <Download size={16} /> Export Data
            </button>
            <button 
              onClick={handleNewWidget}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60"
            >
              <Plus size={16} /> New Widget
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Staff" 
            value="124" 
            subtext="+4 hired this month"
            trend={12}
            color="text-indigo-400"
            glowColor="hover:shadow-indigo-500/20 hover:border-indigo-500/30"
            icon={Users}
            link="/admin/staff" 
            delay={0.1}
          />
          <StatCard 
            title="Active Branches" 
            value="8" 
            subtext="2 launching soon"
            trend={5}
            color="text-purple-400" 
            glowColor="hover:shadow-purple-500/20 hover:border-purple-500/30"
            icon={MapPin}
            link="/admin/branches" 
            delay={0.2}
          />
          <StatCard 
            title="Present Today" 
            value="112" 
            subtext="90% attendance rate"
            trend={8}
            color="text-emerald-400" 
            glowColor="hover:shadow-emerald-500/20 hover:border-emerald-500/30"
            icon={UserCheck}
            link="/admin/reports" 
            delay={0.3}
          />
          <StatCard 
            title="Late / Absent" 
            value="12" 
            subtext="Attention required"
            trend={-2}
            color="text-rose-400" 
            glowColor="hover:shadow-rose-500/20 hover:border-rose-500/30"
            icon={AlertTriangle}
            link="/admin/reports" 
            delay={0.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Chart & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Attendance Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-bold text-xl text-white">Weekly Attendance</h3>
                  <p className="text-sm text-slate-500 mt-1">Average check-in metrics</p>
                </div>
                <Link to="/admin/reports" className="text-indigo-400 text-sm font-bold bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-lg hover:bg-indigo-500/20 transition">
                  Full Report
                </Link>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {chartData.map((d, i) => (
                  <div key={i} className="w-full flex flex-col items-center group relative">
                    <div className="mb-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 absolute bottom-full bg-slate-800 border border-white/10 text-white text-xs font-bold py-1.5 px-3 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-20">
                      {d.value} Staff
                    </div>
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${d.value}%` }}
                      transition={{ duration: 0.8, delay: 0.6 + (i * 0.1), ease: "circOut" }}
                      className={`w-full max-w-[48px] rounded-t-xl relative overflow-hidden transition-all duration-300 ${
                        d.value > 90 ? 'bg-emerald-500' : d.value < 50 ? 'bg-amber-500' : 'bg-indigo-500'
                      } opacity-80 group-hover:opacity-100 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </motion.div>
                    
                    <span className="text-xs text-slate-500 font-mono font-medium mt-4 group-hover:text-white transition-colors">{d.day}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {/* 1. Add Staff */}
               <button 
                 onClick={() => navigate('/admin/staff')}
                 className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 rounded-2xl shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 hover:scale-[1.02] transition-all text-left border border-indigo-500/20 group relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <UserPlus className="mb-4 opacity-80" size={28} />
                 <div className="font-bold text-lg">Add Staff</div>
                 <div className="text-xs text-indigo-200 mt-1 opacity-80">Onboard employee</div>
               </button>
               
               {/* 2. Generate Reports */}
               <button 
                 onClick={handleGenerateReport}
                 className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.02] transition-all text-left group"
               >
                 <FileText className="mb-4 text-slate-500 group-hover:text-indigo-400 transition-colors" size={28} />
                 <div className="font-bold text-slate-200 group-hover:text-white">Reports</div>
                 <div className="text-xs text-slate-500 mt-1">Export as PDF/CSV</div>
               </button>
               
               {/* 3. Manage Branches */}
               <button 
                 onClick={() => navigate('/admin/branches')}
                 className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl hover:bg-white/[0.06] hover:border-white/20 hover:scale-[1.02] transition-all text-left group"
               >
                 <MapPin className="mb-4 text-slate-500 group-hover:text-purple-400 transition-colors" size={28} />
                 <div className="font-bold text-slate-200 group-hover:text-white">Branches</div>
                 <div className="text-xs text-slate-500 mt-1">Manage locations</div>
               </button>
            </div>
          </div>

          {/* Right Column: Recent Activity Widget */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.6 }}
             className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl h-fit"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-white">Live Feed</h3>
              <Link to="/admin/logs" className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                <MoreHorizontal size={20} />
              </Link>
            </div>

            <div className="space-y-1 relative">
              {/* Connector Line */}
              <div className="absolute left-[26px] top-4 bottom-4 w-[2px] bg-white/5 z-0" />
              
              <div className="relative z-10 space-y-3">
                <ActivityItem 
                  icon={UserPlus} 
                  color="text-indigo-400" 
                  title="New staff registered" 
                  user="HR Admin" 
                  time="2m ago" 
                />
                <ActivityItem 
                  icon={ShieldAlert} 
                  color="text-amber-400" 
                  title="Failed login attempt" 
                  user="System" 
                  time="15m ago" 
                />
                <ActivityItem 
                  icon={FileText} 
                  color="text-emerald-400" 
                  title="Report generated" 
                  user="Manager Doe" 
                  time="1h ago" 
                />
                <ActivityItem 
                  icon={MapPin} 
                  color="text-purple-400" 
                  title="Branch 'West' added" 
                  user="Super Admin" 
                  time="2h ago" 
                />
                <ActivityItem 
                  icon={AlertTriangle} 
                  color="text-rose-400" 
                  title="Absence spike detected" 
                  user="AI Bot" 
                  time="Yesterday" 
                />
              </div>
            </div>
            
            <Link to="/admin/logs" className="block mt-8 text-center text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-indigo-400 transition border-t border-white/5 pt-4">
              View All History
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}