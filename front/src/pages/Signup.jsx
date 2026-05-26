import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // ✅ Import Axios
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  Check, 
  Briefcase
} from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Staff', // Default
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Password Strength Logic
  useEffect(() => {
    const pass = formData.password;
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // ✅ Real API Call
      await axios.post('http://127.0.0.1:5000/api/signup', formData);
      
      // Success - Redirect to Login
      // Optional: Show a success toast here before navigating
      navigate('/'); 
      
    } catch (err) {
      // Handle "Email already exists" or Server Errors
      const msg = err.response?.data || 'Failed to create account. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for strength color
  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-rose-500';
    if (passwordStrength <= 4) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Join the workspace to manage your tasks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        {/* Email Input */}
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

        {/* Role Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 ml-1">Department Role</label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
            >
              <option className="bg-[#030712] text-white" value="Staff">Staff Member</option>
              <option className="bg-[#030712] text-white" value="Manager">Branch Manager</option>
              <option className="bg-[#030712] text-white" value="Admin">Administrator</option>
            </select>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
              placeholder="Create a password"
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
          
          {/* Strength Meter */}
          <div className="flex gap-1 h-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all duration-500 ${
                  i < passwordStrength ? getStrengthColor() : 'bg-white/10'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 ml-1">Confirm Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
              placeholder="Confirm password"
              required
            />
          </div>
        </div>

        {/* Error Message */}
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

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 hover:scale-[1.01] hover:shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              Create Account <ArrowRight size={20} />
            </>
          )}
        </button>

      </form>

      <p className="text-center text-slate-500 text-sm mt-8">
        Already have an account? <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors">Sign In</Link>
      </p>
    </motion.div>
  );
}