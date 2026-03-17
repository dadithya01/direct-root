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

function LoadingScreen() {
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
}

export default LoadingScreen;
