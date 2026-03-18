import { useState, useEffect } from 'react';
import { Sprout } from 'lucide-react';
import LandingPage     from '../Pages/LandingPage';
import LoginRegister   from '../Pages/LogiRegister';
import AdminDashboard  from '../Pages/AdminDashboard';
import FarmerDashboard from '../Pages/FarmerDashboard';
import BuyerDashboard  from '../Pages/BuyerDashboard';

const M3 = {
  bg: '#0f1117', outline: '#2e3150',
  primary: '#c3c6ff', primaryCont: '#4a4fa8',
  green: '#6ddc91', text: '#f0f0ff', textLow: '#8e8eaa',
};

function LoadingScreen() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ minHeight: '100vh', background: M3.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Google Sans','Roboto',system-ui,sans-serif" }}>
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${M3.primary}44,0 0 40px ${M3.primary}22`, animation: 'pulse 2s ease-in-out infinite' }}>
          <Sprout size={36} color={M3.primary} />
        </div>
        <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: M3.green, boxShadow: `0 0 12px ${M3.green}`, animation: 'bounce 1s ease-in-out infinite' }} />
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: M3.text, letterSpacing: '-1px', marginBottom: 8 }}>Direct<span style={{ color: M3.primary }}>Root</span></h1>
      <p style={{ fontSize: 13, color: M3.textLow, marginBottom: 40 }}>Agricultural Marketplace</p>
      <div style={{ width: 200, height: 3, background: M3.outline, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg,${M3.primary},${M3.green})`, borderRadius: 99, animation: 'loading 2s ease-in-out infinite' }} />
      </div>
      <p style={{ fontSize: 12, color: M3.textLow, marginTop: 16 }}>Initializing{'.'.repeat(dots)}</p>
      <style>{`
        @keyframes pulse  { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
        @keyframes bounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }
        @keyframes loading { 0%{width:0%;margin-left:0;} 50%{width:100%;margin-left:0;} 100%{width:0%;margin-left:100%;} }
      `}</style>
    </div>
  );
}

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [page, setPage]           = useState('landing'); // 'landing' | 'auth'
  const [user, setUser]           = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setIsBooting(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const handleLogout = () => { setUser(null); setPage('landing'); };

  if (isBooting)      return <LoadingScreen />;
  if (user?.role === 'ADMIN')  return <AdminDashboard  user={user} onLogout={handleLogout} />;
  if (user?.role === 'FARMER') return <FarmerDashboard user={user} onLogout={handleLogout} />;
  if (user?.role === 'BUYER')  return <BuyerDashboard  user={user} onLogout={handleLogout} />;
  if (page === 'landing')      return <LandingPage     onGetStarted={() => setPage('auth')} />;
  return                              <LoginRegister    onSuccess={u => setUser(u)} />;
}