import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Lock, 
  User as UserIcon, 
  ChevronRight, 
  ShieldCheck, 
  ShoppingCart,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';

// --- API CONFIG ---
const API_BASE_URL = "http://localhost:8080/api/v1";

// ==========================================
// 1. BOOT/LOADING SCREEN (Dark)
// ==========================================
const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 4 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
        <div className="relative bg-slate-900 p-6 rounded-[2.5rem] border border-slate-700 shadow-2xl">
          <Sprout size={64} className="text-blue-500 animate-bounce" />
        </div>
      </div>
      <div className="w-full max-w-xs space-y-4">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[11px] font-mono text-slate-400 animate-pulse italic text-center tracking-widest uppercase">Syncing Handshake...</p>
      </div>
    </div>
  );
};

// ==========================================
// 2. MAIN APP (Dark Theme)
// ==========================================
export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [view, setView] = useState('login'); 
  const [role, setRole] = useState('FARMER'); 
  const [user, setUser] = useState(null); 
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleLogout = () => { setUser(null); setView('login'); };

  const handleAuth = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError("");

    const endpoint = view === 'login' ? '/signin' : '/register';
    const payload = view === 'login' 
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, password: formData.password, role };

    try {
      const response = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.status === 403) throw new Error("403 Forbidden");

      const result = await response.json();

      if (response.ok) {
        setUser({
          username: formData.username,
          role: result.data?.role || role,
          token: result.data?.token
        });
      } else {
        setError(result.message || "Authentication failed.");
      }
    } catch (err) {
      setError(err.message.includes("403") ? err.message : "Network error. Is Spring Boot running?");
    } finally { setFormLoading(false); }
  };

  if (isBooting) return <LoadingScreen />;

  // ========================
  // USER REDIRECTION
  // ========================
  if (user) {
    if (user.role === 'ADMIN') return <AdminDashboard user={user} onLogout={handleLogout} />;

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center font-sans animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-800 max-w-lg text-white">
          <div className="bg-blue-900/20 p-6 rounded-3xl mb-8 inline-block">
            {user.role === 'FARMER' ? <Sprout size={48} /> : <ShoppingCart size={48} />}
          </div>
          <h1 className="text-4xl font-black mb-4 tracking-tight">System Access Granted</h1>
          <p className="text-slate-300 font-medium leading-relaxed mb-10">
            Welcome, <span className="font-bold">{user.username}</span>. You are logged in as a <span className="font-black text-blue-400 uppercase tracking-widest text-xs px-2 py-1 bg-blue-900/20 rounded-lg">{user.role}</span>.
          </p>
          <button onClick={handleLogout} className="w-full py-4 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
            Disconnect Session
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // LOGIN / REGISTER FORM
  // ========================
  return (
    <div className="min-h-screen flex font-sans animate-in fade-in duration-700">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 items-center justify-center p-20 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent" />
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <Sprout size={32} />
          </div>
          <h1 className="text-5xl font-black leading-tight mb-4 tracking-tighter">AgriNet <span className="text-blue-400">Node</span></h1>
          <p className="text-slate-400 font-medium leading-relaxed italic">Yoga-7 Terminal: Ready for input.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-950 text-white">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black mb-1 tracking-tight">{view === 'login' ? 'Authenticate' : 'Request Registry'}</h2>
            <p className="text-slate-400 font-medium text-sm">Secure Agricultural Ledger Access</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700 text-red-400 rounded-xl flex gap-3 text-xs font-bold items-center">
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="username" required type="text" className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 font-medium text-white placeholder:text-slate-400 transition-all" onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input name="password" required type="password" className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 font-medium text-white placeholder:text-slate-400 transition-all" onChange={handleChange} />
              </div>
            </div>

            {view === 'register' && (
              <div className="pt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Select Profile</p>
                <div className="grid grid-cols-3 gap-2">
                   {['FARMER', 'BUYER', 'ADMIN'].map((r) => (
                     <button key={r} type="button" onClick={() => setRole(r)} className={`py-4 rounded-xl border-2 text-[9px] font-black uppercase transition-all flex flex-col items-center gap-1 ${role === r ? 'border-blue-400 bg-blue-900/20 text-blue-400 shadow-sm' : 'border-slate-700 text-slate-400 hover:bg-slate-800'}`}>
                       {r}
                     </button>
                   ))}
                </div>
              </div>
            )}

            <button disabled={formLoading} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-8 active:scale-95 disabled:opacity-50">
              {formLoading ? <Loader2 className="animate-spin" size={18} /> : <>{view === 'login' ? 'Sign In' : 'Register'}</>}
            </button>
          </form>

          <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="mt-8 w-full text-center text-blue-400 font-black text-xs hover:underline tracking-tight uppercase">
            {view === 'login' ? "New Operator? Request Access" : "Existing Node? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}