import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Info, 
  Clock, 
  Activity,
  ChevronRight,
  Command
} from 'lucide-react';

export default function ActivityLogs() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  const logs = [
    { id: 1, action: 'Mainframe Backup', user: 'System Bot', time: '10:42 AM', type: 'success', meta: '2.4GB • Encrypted' },
    { id: 2, action: 'Unauthorized Access', user: 'IP: 192.168.1.X', time: '09:15 AM', type: 'error', meta: 'Firewall Triggered' },
    { id: 3, action: 'Deployment Rollback', user: 'Sarah Connor', time: '08:30 AM', type: 'warning', meta: 'v2.4.0 -> v2.3.9' },
    { id: 4, action: 'Config Update', user: 'Admin Console', time: 'Yesterday', type: 'info', meta: 'Policy #8821' },
    { id: 5, action: 'Staff Onboarding', user: 'John Doe', time: 'Yesterday', type: 'success', meta: 'New User: Alice' },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || log.type === filter;
      return matchSearch && matchFilter;
    });
  }, [filter, search]);

  const getStyles = (type) => {
    switch (type) {
      case 'success': return { 
        glow: 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]', 
        border: 'group-hover:border-emerald-500/50', 
        text: 'text-emerald-400', 
        bg: 'bg-emerald-500/10',
        icon: <CheckCircle2 /> 
      };
      case 'error': return { 
        glow: 'shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]', 
        border: 'group-hover:border-red-500/50', 
        text: 'text-red-400', 
        bg: 'bg-red-500/10',
        icon: <XCircle /> 
      };
      case 'warning': return { 
        glow: 'shadow-[0_0_20px_-5px_rgba(245,158,11,0.4)]', 
        border: 'group-hover:border-amber-500/50', 
        text: 'text-amber-400', 
        bg: 'bg-amber-500/10',
        icon: <AlertOctagon /> 
      };
      default: return { 
        glow: 'shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]', 
        border: 'group-hover:border-blue-500/50', 
        text: 'text-blue-400', 
        bg: 'bg-blue-500/10',
        icon: <Info /> 
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      
      {/* --- AMBIENT BACKGROUND GLOW --- */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
                <Activity size={24} />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">System Logs</h1>
            </div>
            <p className="text-slate-500 font-medium ml-1">Real-time surveillance & activity tracking</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-end gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  System Online
                </p>
                <p className="text-slate-600 text-xs mt-1 font-mono">v4.2.0-stable</p>
             </div>
          </div>
        </div>

        {/* --- CONTROLS BAR --- */}
        <div className="sticky top-6 z-50 mb-10">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
            
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs..." 
                className="w-full bg-transparent border-none text-white pl-12 pr-4 py-3 focus:ring-0 placeholder:text-slate-600 font-medium"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Command size={10} /> K
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-black/20 p-1 rounded-xl">
              {['all', 'success', 'warning', 'error'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    filter === tab 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- TIMELINE GRID --- */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-slate-800 to-transparent z-0" />

          <div className="space-y-6">
            <AnimatePresence mode='popLayout'>
              {filteredLogs.map((log, index) => {
                const style = getStyles(log.type);
                const isHovered = hoveredId === log.id;

                return (
                  <motion.div
                    key={log.id}
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredId(log.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group relative pl-16 md:pl-20"
                  >
                    {/* Timeline Node */}
                    <div className={`absolute left-0 top-6 w-[54px] h-[54px] rounded-2xl border border-white/5 bg-[#0a0a0a] flex items-center justify-center z-10 transition-all duration-300 ${isHovered ? style.glow + ' border-white/20 scale-110' : 'shadow-black/50'}`}>
                      <div className={`${style.text} transform transition-transform duration-500 ${isHovered ? 'rotate-12 scale-110' : ''}`}>
                        {style.icon}
                      </div>
                    </div>

                    {/* Connector */}
                    <div className={`absolute left-[54px] top-[33px] w-6 h-px bg-white/10 transition-all duration-300 ${isHovered ? 'w-10 bg-indigo-500/50' : ''}`} />

                    {/* Card */}
                    <div className={`relative bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.04] ${style.border}`}>
                      
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-white/5 ${style.bg} ${style.text}`}>
                              {log.type}
                            </span>
                            <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                              <Clock size={12} /> {log.time}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {log.action}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                             <div className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-[10px] font-bold text-white border border-white/10">
                                {log.user.charAt(0)}
                             </div>
                             <span className="font-medium text-slate-300">{log.user}</span>
                          </div>
                        </div>

                        {/* Right side Metadata */}
                        <div className="hidden sm:block text-right">
                          <div className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-xs font-mono text-slate-500">
                            {log.meta}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Chevron */}
                      <div className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : ''}`}>
                         <ChevronRight className="text-white/20" />
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredLogs.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="inline-block p-6 rounded-full bg-white/5 border border-white/5 mb-4 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]">
                  <Filter className="text-slate-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">No signals found</h3>
                <p className="text-slate-500 mt-2">The system is quiet for these parameters.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}