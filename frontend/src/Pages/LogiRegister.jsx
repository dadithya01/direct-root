import React, { useState } from 'react';
import {
  Sprout, Lock, User as UserIcon,
  ShieldCheck, ShoppingCart, Wheat,
  AlertTriangle, Loader2, Eye, EyeOff, ArrowRight,
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api/v1";

const M3 = {
  bg:          '#0f1117',
  surface:     '#1a1d27',
  surfaceVar:  '#1f2230',
  outline:     '#2e3150',
  outlineVar:  '#252840',
  primary:     '#c3c6ff',
  primaryCont: '#4a4fa8',
  error:       '#ffb4ab',
  errorCont:   '#930006',
  green:       '#6ddc91',
  text:        '#f0f0ff',
  textMed:     '#c4c4e0',
  textLow:     '#8e8eaa',
};

const ROLES = [
  { value: 'FARMER', label: 'Farmer',        icon: Wheat,        color: '#34d399', cont: '#064e3b' },
  { value: 'BUYER',  label: 'Buyer',          icon: ShoppingCart, color: '#7dd3fc', cont: '#0c4a6e' },
  { value: 'ADMIN',  label: 'Administrator',  icon: ShieldCheck,  color: '#c3c6ff', cont: '#4a4fa8' },
];

const AuthInput = ({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, rightEl }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <Icon size={15} color={M3.textLow} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required
        style={{ width: '100%', padding: '13px 44px 13px 42px', borderRadius: 14, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' }}
        onFocus={e => e.target.style.borderColor = M3.primary}
        onBlur={e => e.target.style.borderColor = M3.outline}
      />
      {rightEl && <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>{rightEl}</div>}
    </div>
  </div>
);

export default function LoginRegister({ onSuccess }) {
  const [view, setView]               = useState('login');
  const [role, setRole]               = useState('FARMER');
  const [error, setError]             = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showPw, setShowPw]           = useState(false);
  const [formData, setFormData]       = useState({ username: '', password: '' });

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleAuth = async (e) => {
    e.preventDefault();
    setFormLoading(true); setError('');
    const endpoint = view === 'login' ? '/signin' : '/register';
    const payload  = view === 'login'
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, password: formData.password, role };
    try {
      const res    = await fetch(`${API_BASE_URL}/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        onSuccess({ username: formData.username, role: result.data?.role || role, token: result.data?.token });
      } else {
        setError(result.message || 'Authentication failed.');
      }
    } catch { setError('Network error. Is Spring Boot running?'); }
    finally { setFormLoading(false); }
  };

  const selectedRole = ROLES.find(r => r.value === role);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: M3.bg, fontFamily: "'Google Sans','Roboto',system-ui,sans-serif", color: M3.text }}>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: M3.surface, borderRight: `1px solid ${M3.outline}`, padding: 60 }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: `${M3.primaryCont}22`, filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: `#34d39911`, filter: 'blur(60px)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 380 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${M3.primary}44,0 8px 24px ${M3.primary}22` }}>
              <Sprout size={24} color={M3.primary} />
            </div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: M3.text }}>Direct<span style={{ color: M3.primary }}>Root</span></p>
              <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>Agricultural Marketplace</p>
            </div>
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.8px', marginBottom: 20, color: M3.text }}>
            Farm Fresh,<br /><span style={{ color: M3.green }}>Direct to You</span>
          </h2>
          <p style={{ fontSize: 14, color: M3.textLow, lineHeight: 1.7, marginBottom: 40 }}>
            Connecting local farmers with buyers, cutting out middlemen and ensuring fresh produce at fair prices.
          </p>
          {[
            { icon: Wheat,        color: '#34d399',  label: 'Farmers list fresh produce directly' },
            { icon: ShoppingCart, color: '#7dd3fc',  label: 'Buyers shop from local farms' },
            { icon: ShieldCheck,  color: M3.primary, label: 'Secure and transparent platform' },
          ].map(({ icon: Icon, color, label }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={14} color={color} />
              </div>
              <p style={{ fontSize: 13, color: M3.textMed }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: 32 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: M3.text, letterSpacing: '-0.5px' }}>
                {view === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ fontSize: 13, color: M3.textLow, marginTop: 6 }}>
                {view === 'login' ? 'Sign in to your DirectRoot account' : 'Join the DirectRoot marketplace'}
              </p>
            </div>

            {error && (
              <div style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 12, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleAuth}>
              <AuthInput icon={UserIcon} label="Username" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />
              <AuthInput icon={Lock} label="Password" name="password" type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={handleChange}
                rightEl={
                  <button type="button" onClick={() => setShowPw(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow, display: 'flex' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />

              {view === 'register' && (
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Select Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {ROLES.map(({ value, label, icon: Icon, color, cont }) => {
                      const active = role === value;
                      return (
                        <button key={value} type="button" onClick={() => setRole(value)} style={{ padding: '14px 10px', borderRadius: 14, border: `1px solid ${active ? color + '66' : M3.outline}`, background: active ? `${cont}88` : M3.surfaceVar, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: active ? `${color}22` : M3.outlineVar, border: `1px solid ${active ? color + '44' : M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={14} color={active ? color : M3.textLow} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: active ? color : M3.textLow }}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedRole && (
                    <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 12, background: `${selectedRole.color}0f`, border: `1px solid ${selectedRole.color}22`, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <selectedRole.icon size={13} color={selectedRole.color} />
                      <p style={{ fontSize: 12, color: selectedRole.color, fontWeight: 600 }}>
                        {selectedRole.value === 'FARMER' && 'You will be able to list and manage your products.'}
                        {selectedRole.value === 'BUYER'  && 'You will be able to browse and purchase products.'}
                        {selectedRole.value === 'ADMIN'  && 'You will have full platform management access.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <button type="submit" disabled={formLoading} style={{ width: '100%', padding: '14px', borderRadius: 14, marginTop: 8, background: formLoading ? M3.outlineVar : M3.primaryCont, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 14, fontWeight: 700, cursor: formLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {formLoading
                  ? <><Loader2 size={16} className="animate-spin" />{view === 'login' ? 'Signing in...' : 'Creating account...'}</>
                  : <>{view === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
                }
              </button>
            </form>
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: M3.textLow }}>{view === 'login' ? "Don't have an account? " : 'Already have an account? '}</span>
            <button onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); setFormData({ username: '', password: '' }); }}
              style={{ fontSize: 13, fontWeight: 700, color: M3.primary, background: 'none', border: 'none', cursor: 'pointer' }}>
              {view === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}