import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Lock, 
  User as UserIcon, 
  ChevronRight, 
  ShieldCheck, 
  ShoppingCart,
  AlertCircle,
  Loader2
} from 'lucide-react';

// --- API CONFIG ---
const API_BASE_URL = "http://localhost:8080/api/v1/auth";

// ==========================================
// 1. BOOT/LOADING SCREEN
// ==========================================
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  
  const logs = [
    "Initializing AgriNet Core...",
    "Mounting MySQL Drivers...",
    "Establishing Secure JWT Handshake...",
    "Yoga-7-Arch: Loading UI Modules...",
    "System Ready."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 30);
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev < logs.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
        <div className="relative bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <Sprout size={64} className="text-blue-500 animate-bounce" />
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.3em] font-bold">
            {progress}% Loaded
          </p>
          <p className="text-[11px] font-mono text-slate-500 animate-pulse italic">
            {logs[logIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. AUTHENTICATION COMPONENT
// ==========================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('login'); 
  const [role, setRole] = useState('FARMER'); 
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "", 
    password: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    const endpoint = view === 'login' ? '/signin' : '/register';
    
    // Payload matches exactly: username, password, role
    const payload = view === 'login' 
      ? { username: formData.username, password: formData.password }
      : { 
          username: formData.username,
          password: formData.password, 
          role: role 
        };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (response.status === 403) {
        throw new Error("403 Forbidden: Disable CSRF in Spring Security.");
      }

      const result = await response.json();

      if (response.ok) {
        alert(`Success! Logged in as ${formData.username}`);
        console.log("Successful Response:", result);
      } else {
        setError(result.message || "Authentication failed.");
      }
    } catch (err) {
      setError(err.message.includes("403") ? err.message : "Network error. Is Spring Boot running?");
      console.error("Debug Info:", err);
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-md text-white">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/20">
            <Sprout size={40} />
          </div>
          <h1 className="text-6xl font-black leading-tight tracking-tighter mb-6">
            Connecting <span className="text-blue-500">Farmers</span> to the World.
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Optimized for your Yoga 7. Pure performance.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {view === 'login' ? 'Welcome Back' : 'Get Started'}
            </h2>
            <p className="text-slate-500 font-medium">Authentication via Username and Password.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 text-sm font-bold animate-pulse">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="username" required type="text" placeholder="Adthya" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="password" required type="password" placeholder="••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" onChange={handleChange} />
              </div>
            </div>

            {view === 'register' && (
              <div className="pt-4 space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Register as</p>
                <div className="grid grid-cols-3 gap-3">
                   <button type="button" onClick={() => setRole('FARMER')} className={`py-4 px-2 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'FARMER' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                     <Sprout size={20} />
                     <span className="text-[9px] font-black uppercase tracking-tighter">Farmer</span>
                   </button>
                   <button type="button" onClick={() => setRole('BUYER')} className={`py-4 px-2 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'BUYER' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                     <ShoppingCart size={20} />
                     <span className="text-[9px] font-black uppercase tracking-tighter">Buyer</span>
                   </button>
                   <button type="button" onClick={() => setRole('ADMIN')} className={`py-4 px-2 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === 'ADMIN' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                     <ShieldCheck size={20} />
                     <span className="text-[9px] font-black uppercase tracking-tighter">Admin</span>
                   </button>
                </div>
              </div>
            )}

            <button disabled={formLoading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[1.25rem] shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-70">
              {formLoading ? <Loader2 className="animate-spin" size={20} /> : <>{view === 'login' ? 'Sign In' : 'Create Account'} <ChevronRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
             <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-blue-600 hover:underline font-black text-sm">
                {view === 'login' ? "Don't have an account? Register Now" : "Already have an account? Login instead"}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}