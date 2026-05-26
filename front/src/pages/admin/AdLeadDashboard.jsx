import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Target, TrendingUp, Phone, Mail, 
  Calendar, CheckCircle2, XCircle, Clock, 
  Filter, BarChart3, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const handleWhatsAppCall = (phoneNumber) => {
  // 1. Remove all non-numeric characters (spaces, dashes, +, brackets)
  const cleanNumber = phoneNumber.replace(/\D/g, '');

  // 2. Open the WhatsApp link
  // Note: 'https://wa.me/' is the standard web link. 
  // If you strictly want to attempt a direct audio call on mobile, use 'whatsapp://call?phone='
  window.open(`https://wa.me/${cleanNumber}`, '_blank');
};
// --- 1. REUSABLE TOAST ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />} <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. STAT CARD ---
const StatCard = ({ title, value, subtext, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    className="relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:bg-white/[0.05] transition-all"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity ${color.replace('text', 'bg')}`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${color}`}><Icon size={24} /></div>
      {subtext && <div className={`px-2 py-1 rounded-lg border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400`}>{subtext}</div>}
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-1">{title}</p>
    </div>
  </motion.div>
);

// --- 3. PIPELINE CHART (Dynamic) ---
const PipelineChart = ({ stats }) => {
  const data = [
    { label: 'New', count: stats.new || 0, color: 'bg-blue-500' },
    { label: 'In-Progress', count: stats.inprogress || 0, color: 'bg-amber-500' },
    { label: 'Converted', count: stats.converted || 0, color: 'bg-emerald-500' },
    { label: 'Lost', count: stats.lost || 0, color: 'bg-rose-500' },
  ];

  // Calculate Max for Scaling (prevent divide by zero)
  const max = Math.max(...data.map(d => d.count)) || 1;

  return (
    <div className="h-64 flex items-end justify-between gap-4 px-4 pb-2 border-b border-white/5">
      {data.map((item, i) => (
        <div key={item.label} className="w-full flex flex-col items-center gap-2 group h-full justify-end">
          <div className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors mb-1">{item.count}</div>
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: `${(item.count / max) * 80}%` }} // Scale to 80% of container max
            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
            className={`w-full rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity ${item.color} relative overflow-hidden min-h-[4px]`}
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center h-4">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- 4. MAIN DASHBOARD ---
export default function AdLeadDashboard() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  
  // ✅ DYNAMIC STATES
  const [stats, setStats] = useState({ total: 0, today: 0, new: 0, converted: 0, lost: 0, inprogress: 0 });
  const [tasks, setTasks] = useState([]);

  // ✅ FETCH DATA ON LOAD
  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            // 1. Fetch Stats
            const statsRes = await axios.get('http://127.0.0.1:5000/api/dashboard/stats');
            setStats(statsRes.data);

            // 2. Fetch Tasks (Follow ups)
            const tasksRes = await axios.get('http://127.0.0.1:5000/api/dashboard/tasks');
            setTasks(tasksRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        }
    };
    fetchDashboardData();
  }, []);

  const showToast = (message, type = 'success') => setNotification({ message, type });
  const handleAction = (type, name) => showToast(type === 'call' ? `Calling ${name}...` : `Email draft opened for ${name}`);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-8 relative overflow-hidden">
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Lead Command Center</h1>
            <p className="text-slate-500 font-medium">Track, manage, and convert your prospects.</p>
          </div>
        </div>

        {/* METRICS GRID (Dynamic Values) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 grid grid-cols-2 gap-6">
             <StatCard title="Total Leads" value={stats.total} subtext="Live Database" icon={Users} color="text-indigo-400" delay={0.1} />
             <StatCard title="Today's Tasks" value={stats.today} subtext="Action Required" icon={Clock} color="text-amber-400" delay={0.2} />
          </div>
          <StatCard title="Pipeline Active" value={stats.inprogress} icon={TrendingUp} color="text-blue-400" delay={0.3} />
          <StatCard title="Converted" value={stats.converted} icon={CheckCircle2} color="text-emerald-400" delay={0.4} />
        </div>

        {/* SPLIT VIEW: CHART & LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PIPELINE CHART */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><BarChart3 size={20} className="text-indigo-400" /> Pipeline Overview</h3>
                <p className="text-sm text-slate-500 mt-1">Lead distribution by status</p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><Filter size={20} /></button>
            </div>
            {/* Pass dynamic stats to chart */}
            <PipelineChart stats={stats} />
          </motion.div>

          {/* RIGHT: TODAY'S TASKS (Dynamic) */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Follow-ups</h3>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">Today + Overdue</span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                {tasks.length > 0 ? (
                    tasks.map((lead, i) => {
                      const isOverdue = new Date(lead.follow_up_date) < new Date().setHours(0,0,0,0);
                      return (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-white text-sm">
                                {lead.name}
                              </h4>
                              <p className="text-xs text-slate-500">
                                {lead.company || "N/A"}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-[10px] font-bold block ${isOverdue ? "text-rose-400" : "text-emerald-400"}`}
                              >
                                {isOverdue ? "Overdue" : "Today"}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                {new Date(
                                  lead.follow_up_date,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 columns-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents clicking the parent row/card if applicable
                                handleWhatsAppCall(lead.phone);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <Phone size={12} />
                              {lead.phone}
                            </button>
                            <button
                              onClick={() => handleAction("email", lead.name)}
                              className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all"
                            >
                              <Mail size={12} />
                              {lead.email}
                            </button>
                          </div>
                        </div>
                      );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                        <CheckCircle2 size={32} className="text-emerald-500/30 mb-2" />
                        <p className="text-slate-500 text-sm">All caught up!</p>
                        <p className="text-slate-600 text-xs">No pending tasks found.</p>
                    </div>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/admin/ad-leads')}
                className="w-full mt-4 py-3 rounded-xl border border-white/10 text-slate-400 text-xs font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View All Leads <ArrowRight size={14} />
              </button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}