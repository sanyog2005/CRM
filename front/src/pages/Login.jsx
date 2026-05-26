import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  User, 
  Briefcase 
} from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Replace your handleSubmit with this:
const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        console.log("1. Sending Request...");
        const res = await axios.post('http://127.0.0.1:5000/api/login', formData);
        
        console.log("2. Response Received:", res.data);
        const user = res.data;

        console.log("3. Calling login() context...");
        await login(user); 

        console.log("4. Redirecting...");
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'manager') navigate('/manager');
        else navigate('/staff');
      
    } catch (err) {
        console.error("❌ FULL ERROR:", err); // Look at this in your browser console (F12)
        
        // If the error happens in step 3 or 4, err.response will be undefined
        if (err.response) {
            setError(err.response.data); // Server replied with an error (e.g. 401)
        } else if (err.request) {
            setError("Server connection failed (CORS or Network Error)."); 
        } else {
            setError("Error processing login: " + err.message); // Error in your React code (AuthContext)
        }
    } finally {
        setIsLoading(false);
    }
};

  const quickFill = (role) => {
    setFormData({ 
      email: `${role}@1.com`, 
      password: '123456' 
    });
    setError('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Enter your credentials to access your workspace.
        </p>
      </div>

      <div className="mb-8">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-3">Quick Access (Demo)</p>
        <div className="flex justify-center gap-3">
          <button onClick={() => quickFill('admin')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300 transition-all w-24 group">
            <ShieldCheck size={20} className="text-slate-400 group-hover:text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-300">Admin</span>
          </button>
          <button onClick={() => quickFill('manager')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-300 transition-all w-24 group">
            <Briefcase size={20} className="text-slate-400 group-hover:text-amber-400" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-300">Manager</span>
          </button>
          <button onClick={() => quickFill('staff')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-emerald-300 transition-all w-24 group">
            <User size={20} className="text-slate-400 group-hover:text-emerald-400" />
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-300">Staff</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between ml-1">
            <label className="text-xs font-bold text-slate-400">Password</label>
            <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot?</button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 hover:scale-[1.01] hover:shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
        </button>
      </form>

      {/* <p className="text-center text-slate-500 text-sm mt-8">
        Don't have an account?{' '}
        <Link 
          to="/signup" 
          className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors"
        >
          Create Account
        </Link>
      </p> */}
    </motion.div>
  );
}