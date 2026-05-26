import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Users, Globe } from 'lucide-react';

// --- SUB-COMPONENT: FLOATING FEATURE CARD ---
const FeatureCard = ({ icon: Icon, title, subtext, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-full max-w-sm"
  >
    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-white font-bold text-sm">{title}</h4>
      <p className="text-slate-400 text-xs">{subtext}</p>
    </div>
  </motion.div>
);

// --- MAIN LAYOUT ---
export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#030712] font-sans flex overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* --- BACKGROUND AMBIENCE (Global) --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* --- LEFT PANEL (Visuals & Branding) - Hidden on Mobile --- */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative z-10 p-12 border-r border-white/5 bg-white/[0.01]">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
            <Activity size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">EMS Portal</span>
        </div>

        {/* Center Content */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Manage your workforce <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                with confidence.
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Streamline attendance, track productivity, and manage branch operations in one unified secure platform.
            </p>
          </div>

          {/* Floating Feature Cards */}
          <div className="space-y-4">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Enterprise Security" 
              subtext="256-bit encryption & role-based access" 
              color="from-emerald-500 to-teal-500"
              delay={0.2} 
            />
            <FeatureCard 
              icon={Users} 
              title="Real-time Tracking" 
              subtext="Monitor 120+ staff across 8 branches" 
              color="from-indigo-500 to-blue-500"
              delay={0.4} 
            />
            <FeatureCard 
              icon={Globe} 
              title="Global Connectivity" 
              subtext="Synchronized data from anywhere" 
              color="from-purple-500 to-pink-500"
              delay={0.6} 
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
          <span>© 2026 EMS Corp</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>Privacy Policy</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>Terms of Service</span>
        </div>
      </div>

      {/* --- RIGHT PANEL (Form Container) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10 p-4">
        
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="absolute top-8 left-0 w-full flex justify-center lg:hidden">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="text-xl font-bold text-white">EMS Portal</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* This Outlet renders the Login Page */}
          <Outlet /> 

          {/* System Status Footer */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400">All Systems Operational</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}