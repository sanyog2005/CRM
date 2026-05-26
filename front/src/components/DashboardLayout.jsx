import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  BarChart3, 
  FileText, 
  Calendar, 
  Clock, 
  LogOut, 
  ChevronLeft, 
  Bell, 
  Search, 
  Settings, 
  Menu,
  X,
  Shield,
  Briefcase,
  User,
  PhoneCall,
  PlusCircle
} from 'lucide-react';

export default function DashboardLayout({ role }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Icon Mapping based on previous requirements
  const navLinks = {
    admin: [
      { name: 'Overview', path: '/admin', icon: LayoutDashboard },
            { name: 'DashBoard', path: '/admin/adleads', icon: Briefcase },

      { name: 'All Staff', path: '/admin/staff', icon: Users },
      { name: 'Branches', path: '/admin/branches', icon: Building2 },
      { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
      { name: 'Activity Logs', path: '/admin/logs', icon: FileText },
        { name: 'Add Lead', path: '/admin/ad-addlead', icon: PhoneCall },
        { name: 'Leads', path: '/admin/ad-leads', icon: PlusCircle },
        { name: 'Settings', path: '/admin/settings', icon: Settings },

    ],
    manager: [
      { name: 'Dashboard', path: '/manager', icon: LayoutDashboard },
      { name: 'Attendance', path: '/manager/attendance', icon: Clock },
      { name: 'Leaves', path: '/manager/leaves', icon: Calendar },

        { name: 'Dashboard', path: '/manager/maleads', icon: Briefcase },
              { name: 'All Staff', path: '/manager/staff', icon: Users },

        { name: 'Add Lead', path: '/manager/ma-addlead', icon: PhoneCall },
        { name: 'Leads', path: '/manager/leads', icon: PlusCircle },
        { name: 'Settings', path: '/manager/settings', icon: Settings },

    ],
    staff: [
      { name: 'My Dashboard', path: '/staff', icon: LayoutDashboard },
      { name: 'Calendar', path: '/staff/calendar', icon: Calendar },
        { name: 'My Leaves', path: '/staff/leaves', icon: Clock },
        { name: 'DashBoard', path: '/staff/stleads', icon: Briefcase },
        { name: 'Add Lead', path: '/staff/st-addlead', icon: PhoneCall },
        { name: 'Leads', path: '/staff/leads', icon: PlusCircle },
        { name: 'Settings', path: '/staff/settings', icon: Settings },

    ]
  };

  const currentLinks = navLinks[role] || [];

  // Helper for Role badge color
  const getRoleBadgeColor = () => {
    switch(role) {
      case 'admin': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'manager': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const RoleIcon = role === 'admin' ? Shield : role === 'manager' ? Briefcase : User;

  return (
    <div className="flex h-screen bg-[#030712] text-slate-300 font-sans overflow-hidden relative selection:bg-indigo-500/30">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* --- SIDEBAR (Desktop) --- */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-[#0b0f19] border-r border-white/5 relative z-20 h-full"
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 relative">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-900/20">
            <RoleIcon size={20} />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 overflow-hidden whitespace-nowrap"
              >
                <h1 className="font-bold text-white text-lg tracking-tight">EMS Portal</h1>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRoleBadgeColor()}`}>
                  {role} Panel
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Collapse Toggle */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#0b0f19] border border-white/10 rounded-full p-1 text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-50"
          >
            <ChevronLeft size={14} className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {currentLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 border border-indigo-500/20 rounded-xl" 
                  />
                )}
                
                <Icon size={22} className={`shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`} />
                
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-3 font-medium whitespace-nowrap"
                  >
                    {link.name}
                  </motion.span>
                )}
                
                {!isSidebarOpen && (
                   <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-white/10">
                     {link.name}
                   </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors group ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={22} className="shrink-0" />
            {isSidebarOpen && <span className="ml-3 font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-20 border-b border-white/5 bg-[#030712]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <span className="font-bold text-white text-lg">EMS</span>
          </div>

          {/* Page Title (Desktop) */}
          <div className="hidden md:block">
            <h2 className="text-white font-bold text-lg capitalize tracking-tight">
              {location.pathname.split('/').pop().replace('-', ' ') || 'Dashboard'}
            </h2>
            <p className="text-slate-500 text-xs">Manage your organization efficiently</p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
          

          

            <div className="h-8 w-px bg-white/10 mx-1"></div>

            {/* Profile Dropdown Trigger */}
            {/* <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{role === 'admin' ? 'Administrator' : role === 'manager' ? 'Branch Manager' : 'Employee'}</p>
                <p className="text-xs text-slate-500">{role}@company.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0b0f19] flex items-center justify-center text-white font-bold">
                  {role.charAt(0).toUpperCase()}
                </div>
              </div>
            </div> */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>

      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#0b0f19] border-r border-white/10 z-50 md:hidden flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-white/5">
                <span className="font-bold text-white text-xl">EMS Mobile</span>
                <button onClick={() => setMobileMenuOpen(false)}><X className="text-slate-400" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {currentLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center p-3 rounded-lg ${
                        location.pathname === link.path 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={20} className="mr-3" />
                      {link.name}
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button onClick={handleLogout} className="flex items-center w-full p-2 text-rose-400">
                  <LogOut className="mr-2" size={20} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}