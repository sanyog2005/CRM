import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, Mail, MapPin, Calendar, Building2, 
  CheckCircle2, Clock, FileText, Send, Save, User, 
  Globe, Briefcase, Activity, MessageSquare
} from 'lucide-react';

// --- 1. REUSABLE TOAST ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }} className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />} <span className="font-semibold text-sm">{message}</span>
    </motion.div>
  );
};

// --- 2. TIMELINE ITEM COMPONENT ---
const TimelineItem = ({ log }) => {
  const getIcon = () => {
    switch (log.type) {
      case 'call': return <Phone size={14} />;
      case 'email': return <Mail size={14} />;
      case 'status': return <Activity size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getColor = () => {
    switch (log.type) {
      case 'call': return 'bg-blue-500 text-blue-100';
      case 'email': return 'bg-purple-500 text-purple-100';
      case 'status': return 'bg-emerald-500 text-emerald-100';
      default: return 'bg-slate-500 text-slate-100';
    }
  };

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${getColor()}`}>
          {getIcon()}
        </div>
        <div className="w-px h-full bg-white/10 my-2 group-last:hidden" />
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/[0.08] transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-bold text-white">{log.title}</h4>
            <span className="text-[10px] text-slate-500 font-mono">{log.date}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{log.note}</p>
          {log.by && <p className="text-[10px] text-slate-600 mt-2">By: {log.by}</p>}
        </div>
      </div>
    </div>
  );
};

// --- 3. MAIN PAGE COMPONENT ---
export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('timeline');
  const [notification, setNotification] = useState(null);
  
  // Status Update State
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Mock Lead Data (Simulating Fetch)
  const [lead, setLead] = useState({
    id: 1,
    name: 'Alice Freeman',
    company: 'TechFlow Solutions',
    role: 'CTO',
    email: 'alice@techflow.io',
    phone: '+1 (555) 010-9988',
    source: 'Website',
    branch: 'New York',
    status: 'In-Progress',
    value: '$12,500',
    staff: 'Sarah Connor',
    timeline: [
      { id: 1, type: 'email', title: 'Sent Proposal', date: 'Jan 20, 2:30 PM', note: 'Sent the revised pricing proposal as requested.', by: 'Sarah Connor' },
      { id: 2, type: 'call', title: 'Discovery Call', date: 'Jan 18, 10:00 AM', note: 'Discussed requirements. Client needs a custom dashboard.', by: 'Sarah Connor' },
      { id: 3, type: 'status', title: 'Lead Created', date: 'Jan 15, 9:00 AM', note: 'Lead captured via Website Contact Form.', by: 'System' },
    ]
  });

  useEffect(() => {
    setNewStatus(lead.status);
  }, [lead]);

  // Actions
  const showToast = (msg, type = 'success') => setNotification({ message: msg, type });

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API Call
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        type: 'status',
        title: `Status changed to ${newStatus}`,
        date: 'Just now',
        note: remarks || 'No remarks added.',
        by: 'You'
      };

      setLead(prev => ({
        ...prev,
        status: newStatus,
        timeline: [newLog, ...prev.timeline]
      }));

      setIsSaving(false);
      setRemarks('');
      setActiveTab('timeline'); // Switch back to timeline to show update
      showToast('Status updated successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 font-sans p-4 md:p-8 relative overflow-hidden flex justify-center">
      
      <AnimatePresence>
        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[20%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">{lead.name}</h1>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  lead.status === 'New' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  lead.status === 'In-Progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {lead.status}
                </span>
              </div>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Building2 size={14} /> {lead.company} 
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <MapPin size={14} /> {lead.branch}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => window.open(`tel:${lead.phone}`)} className="flex items-center gap-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 hover:text-white transition-all">
              <Phone size={16} /> Call
            </button>
            <button onClick={() => window.open(`mailto:${lead.email}`)} className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all">
              <Mail size={16} /> Email
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDEBAR: INFO */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-indigo-400" /> Deal Info
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-500 text-sm">Value</span>
                  <span className="text-emerald-400 font-bold font-mono">{lead.value}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-500 text-sm">Source</span>
                  <span className="text-white text-sm">{lead.source}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-slate-500 text-sm">Assigned To</span>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">S</div>
                    <span className="text-white text-sm">{lead.staff}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-purple-400" /> Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-slate-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Email</p>
                    <p className="text-white text-sm">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-slate-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Phone</p>
                    <p className="text-white text-sm">{lead.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe size={16} className="text-slate-500 mt-1" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold">Website</p>
                    <p className="text-white text-sm">www.techflow.io</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: TABS */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden min-h-[600px] flex flex-col">
              
              {/* Tabs Header */}
              <div className="flex border-b border-white/10">
                {['info', 'timeline', 'update'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
                      activeTab === tab ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    {tab === 'info' && 'Lead Details'}
                    {tab === 'timeline' && 'Activity Log'}
                    {tab === 'update' && 'Update Status'}
                    
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8 flex-1">
                <AnimatePresence mode='wait'>
                  
                  {/* TAB 1: DETAILS (Read Only) */}
                  {activeTab === 'info' && (
                    <motion.div 
                      key="info"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-slate-500 font-bold uppercase">First Name</label>
                          <p className="text-white text-lg border-b border-white/10 pb-2 mt-1">Alice</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 font-bold uppercase">Last Name</label>
                          <p className="text-white text-lg border-b border-white/10 pb-2 mt-1">Freeman</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 font-bold uppercase">Job Title</label>
                          <p className="text-white text-lg border-b border-white/10 pb-2 mt-1">CTO</p>
                        </div>
                        <div>
                          <label className="text-xs text-slate-500 font-bold uppercase">Industry</label>
                          <p className="text-white text-lg border-b border-white/10 pb-2 mt-1">Software</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 font-bold uppercase">Notes</label>
                        <p className="text-slate-300 text-sm leading-relaxed mt-2 bg-black/20 p-4 rounded-xl border border-white/5">
                          Met at the Tech Summit. Interested in our enterprise plan for 50+ users. Requires SSO integration.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: TIMELINE */}
                  {activeTab === 'timeline' && (
                    <motion.div 
                      key="timeline"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    >
                      {lead.timeline.length > 0 ? (
                        <div className="space-y-0">
                          {lead.timeline.map((log) => <TimelineItem key={log.id} log={log} />)}
                        </div>
                      ) : (
                        <div className="text-center py-20 text-slate-500">No activity recorded yet.</div>
                      )}
                    </motion.div>
                  )}

                  {/* TAB 3: UPDATE STATUS */}
                  {activeTab === 'update' && (
                    <motion.div 
                      key="update"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="max-w-md mx-auto py-4"
                    >
                      <form onSubmit={handleUpdateStatus} className="space-y-6">
                        <div>
                          <label className="text-sm font-bold text-slate-300 mb-2 block">Change Stage</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['New', 'Contacted', 'In-Progress', 'Negotiation', 'Won', 'Lost'].map(status => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setNewStatus(status)}
                                className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                                  newStatus === status 
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-bold text-slate-300 mb-2 block">Remarks / Activity Note</label>
                          <textarea 
                            rows="4"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50 placeholder:text-slate-600 resize-none"
                            placeholder="What happened? (e.g. Called client, sent email...)"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={isSaving}
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : <><Save size={18} /> Update Status</>}
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}