import React, { useState, useEffect } from 'react';
import {
  Sprout, ShieldCheck, ShoppingCart, Wheat,
  ArrowRight, CheckCircle, Zap, Package,
  Star, BarChart3, User as UserIcon,
} from 'lucide-react';
import { LoadingScreen } from './LogiRegister';

const M3 = {
  bg:          '#0f1117',
  surface:     '#1a1d27',
  outline:     '#2e3150',
  outlineVar:  '#252840',
  primary:     '#c3c6ff',
  primaryCont: '#4a4fa8',
  green:       '#6ddc91',
  yellow:      '#f5c518',
  text:        '#f0f0ff',
  textMed:     '#c4c4e0',
  textLow:     '#8e8eaa',
};
    
export default function LandingPage({ onGetStarted }) {
    const [isBooting, setIsBooting]     = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsBooting(false), 2200);
    return () => clearTimeout(t);       
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { value: '500+', label: 'Farmers',            icon: Wheat,        color: '#34d399' },
    { value: '12k+', label: 'Happy Buyers',        icon: ShoppingCart, color: '#7dd3fc' },
    { value: '98%',  label: 'Satisfaction Rate',   icon: Star,         color: M3.yellow },
    { value: '30+',  label: 'Product Categories',  icon: Package,      color: M3.primary },
  ];

  const features = [
    {
      icon: Wheat, color: '#34d399', title: 'For Farmers',
      items: ['List unlimited products', 'Set your own prices', 'Track sales analytics', 'Manage stock levels'],
    },
    {
      icon: ShoppingCart, color: '#7dd3fc', title: 'For Buyers',
      items: ['Browse fresh local produce', 'Buy directly from farmers', 'View order history', 'Competitive pricing'],
    },
    {
      icon: ShieldCheck, color: M3.primary, title: 'For Admins',
      items: ['Full platform oversight', 'Manage all users', 'View activity logs', 'Analytics dashboard'],
    },
  ];

  const steps = [
    { step: '01', icon: UserIcon,  color: M3.primary, title: 'Create Account',    desc: 'Sign up as a farmer, buyer, or admin in under a minute.' },
    { step: '02', icon: Package,   color: '#34d399',  title: 'Browse or List',    desc: 'Farmers list products. Buyers browse fresh local produce.' },
    { step: '03', icon: Zap,       color: M3.yellow,  title: 'Transact Directly', desc: 'Place orders and connect directly — no middlemen involved.' },
  ];

  if (isBooting) return <LoadingScreen />;

  return (
    <div style={{ background: M3.bg, color: M3.text, fontFamily: "'Google Sans','Roboto',system-ui,sans-serif", overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        
        transition: 'all 0.3s ease',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sprout size={17} color={M3.primary} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px' }}>
            Direct<span style={{ color: M3.primary }}>Root</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['features', 'how-it-works', 'stats'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textMed, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = M3.text}
              onMouseLeave={e => e.target.style.color = M3.textMed}
            >
              {id.replace('-', ' ')}
            </button>
          ))}
        </div>

        <button onClick={onGetStarted} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 20, background: M3.primaryCont, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#5a5fc0'}
          onMouseLeave={e => e.currentTarget.style.background = M3.primaryCont}
        >
          Get Started <ArrowRight size={14} />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '100px 40px 80px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 500, height: 500, borderRadius: '50%', background: `${M3.primaryCont}22`, filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: `#34d39922`, filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 20, background: `${M3.green}15`, border: `1px solid ${M3.green}33`, marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: M3.green, boxShadow: `0 0 8px ${M3.green}` }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: M3.green }}>Now live — Sri Lanka's farming marketplace</span>
          </div>

          <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: 24, color: M3.text }}>
            Farm Fresh,
            <br />
            <span style={{ background: `linear-gradient(135deg,${M3.primary},${M3.green})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Direct to You
            </span>
          </h1>

          <p style={{ fontSize: 18, color: M3.textMed, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 44px' }}>
            DirectRoot connects local farmers directly with buyers — cutting out middlemen, ensuring fair prices, and delivering fresher produce.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 16, background: M3.primaryCont, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 24px ${M3.primaryCont}66`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${M3.primaryCont}88`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px ${M3.primaryCont}66`; }}
            >
              Start for Free <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollTo('how-it-works')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 16, background: 'transparent', border: `1px solid ${M3.outline}`, color: M3.textMed, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = M3.primary; e.currentTarget.style.color = M3.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = M3.outline; e.currentTarget.style.color = M3.textMed; }}
            >
              How it works
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 56, flexWrap: 'wrap' }}>
            {['No middlemen', 'Fair prices', 'Fresh produce', 'Local farmers'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} color={M3.green} />
                <span style={{ fontSize: 13, color: M3.textLow, fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" style={{ padding: '80px 40px', borderTop: `1px solid ${M3.outline}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s, border-color 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = s.color + '55'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = M3.outline; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '20px 20px 0 0' }} />
              <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.color}18`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <s.icon size={20} color={s.color} />
              </div>
              <p style={{ fontSize: 36, fontWeight: 900, color: M3.text, letterSpacing: '-1px', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 13, color: M3.textLow, marginTop: 8, fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 20, background: `${M3.primary}15`, border: `1px solid ${M3.primary}33`, marginBottom: 16 }}>
              <Zap size={12} color={M3.primary} />
              <span style={{ fontSize: 11, fontWeight: 700, color: M3.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Features</span>
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: M3.text, letterSpacing: '-1px', marginBottom: 16 }}>Everything you need</h2>
            <p style={{ fontSize: 16, color: M3.textLow, maxWidth: 480, margin: '0 auto' }}>Built for farmers, buyers, and platform administrators — all in one place.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: 32, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = M3.outline; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: M3.text, marginBottom: 20, letterSpacing: '-0.3px' }}>{f.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {f.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: `${f.color}18`, border: `1px solid ${f.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle size={11} color={f.color} />
                      </div>
                      <span style={{ fontSize: 14, color: M3.textMed }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button onClick={onGetStarted} style={{ marginTop: 28, width: '100%', padding: '11px', borderRadius: 12, background: `${f.color}15`, border: `1px solid ${f.color}33`, color: f.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${f.color}25`}
                  onMouseLeave={e => e.currentTarget.style.background = `${f.color}15`}
                >
                  Get started as {f.title.replace('For ', '')} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '100px 40px', borderTop: `1px solid ${M3.outline}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 20, background: `${M3.green}15`, border: `1px solid ${M3.green}33`, marginBottom: 16 }}>
              <BarChart3 size={12} color={M3.green} />
              <span style={{ fontSize: 11, fontWeight: 700, color: M3.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How it works</span>
            </div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: M3.text, letterSpacing: '-1px', marginBottom: 16 }}>Up and running in minutes</h2>
            <p style={{ fontSize: 16, color: M3.textLow, maxWidth: 440, margin: '0 auto' }}>Three simple steps to start buying or selling fresh local produce.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 40, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg,${M3.primary}44,${M3.green}44)`, zIndex: 0 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: 32, textAlign: 'center', position: 'relative', zIndex: 1, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = M3.outline; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', borderRadius: 20, background: M3.bg, border: `1px solid ${s.color}55`, fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '0.05em' }}>
                  STEP {s.step}
                </div>
                <div style={{ width: 56, height: 56, borderRadius: 18, background: `${s.color}18`, border: `1px solid ${s.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px auto 20px' }}>
                  <s.icon size={24} color={s.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: M3.text, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: M3.textLow, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 60, textAlign: 'center' }}>
            <button onClick={onGetStarted} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 20, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 24px ${M3.primaryCont}66`, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${M3.primaryCont}88`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px ${M3.primaryCont}66`; }}
            >
              <Sprout size={18} /> Join DirectRoot Today <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${M3.outline}`, padding: '48px 40px', background: M3.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={17} color={M3.primary} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, color: M3.text }}>Direct<span style={{ color: M3.primary }}>Root</span></span>
            </div>
            <p style={{ fontSize: 13, color: M3.textLow, lineHeight: 1.7, maxWidth: 260 }}>
              Connecting local farmers directly with buyers. Fresh produce, fair prices, no middlemen.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: M3.green, boxShadow: `0 0 6px ${M3.green}` }} />
              <span style={{ fontSize: 12, color: M3.green, fontWeight: 600 }}>Platform is live</span>
            </div>
          </div>

          {[
            { title: 'Platform', links: ['Features', 'How it works', 'Pricing', 'Security'] },
            { title: 'Roles',    links: ['For Farmers', 'For Buyers', 'For Admins', 'Get started'] },
            { title: 'Company',  links: ['About', 'Contact', 'Privacy Policy', 'Terms of Use'] },
          ].map((col, i) => (
            <div key={i}>
              <p style={{ fontSize: 12, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{col.title}</p>
              {col.links.map((link, j) => (
                <button key={j} onClick={onGetStarted} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: M3.textMed, marginBottom: 10, textAlign: 'left', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = M3.text}
                  onMouseLeave={e => e.target.style.color = M3.textMed}
                >
                  {link}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1100, margin: '40px auto 0', paddingTop: 24, borderTop: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: M3.textLow }}>© 2026 DirectRoot. All rights reserved.</p>
          <p style={{ fontSize: 12, color: M3.textLow }}>Built with ❤️ for local farmers</p>
        </div>
      </footer>
    </div>
  );
}