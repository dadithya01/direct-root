import React, { useState, useEffect, useRef } from 'react';
import {
  Sprout, ShieldCheck, ShoppingCart, Wheat,
  ArrowRight, CheckCircle, Zap, Package,
  Star, BarChart3, User as UserIcon,
} from 'lucide-react';
import { ChatBot, GuidedTour } from './Guid&Chatbox';

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

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, visible] = useScrollReveal();
  const transforms = { up: 'translateY(40px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.92)' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[direction],
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix, color, started }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, step);
    return () => clearInterval(timer);
  }, [started, target]);
  return (
    <p style={{ fontSize: 38, fontWeight: 900, color: M3.text, letterSpacing: '-1.5px', lineHeight: 1 }}>
      <span style={{ color }}>{count}</span>{suffix}
    </p>
  );
}

export default function LandingPage({ onGetStarted, user }) {
  const [scrolled, setScrolled]             = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [statsStarted, setStatsStarted]     = useState(false);
  const [modal, setModal]                   = useState(null);
  const statsRef                            = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const footerLinks = {
    'Features':       () => scrollTo('tour-features'),
    'How it works':   () => scrollTo('how-it-works'),
    'Pricing':        () => scrollTo('pricing'),
    'Security':       () => onGetStarted(),
    'For Farmers':    () => scrollTo('tour-features'),
    'For Buyers':     () => scrollTo('tour-features'),
    'For Admins':     () => scrollTo('tour-features'),
    'Get started':    () => onGetStarted(),
    'About':          () => setModal('about'),
    'Contact':        () => window.location.href = 'mailto:support@directroot.lk',
    'Privacy Policy': () => setModal('privacy'),
    'Terms of Use':   () => setModal('terms'),
  };

  const MODALS = {
    about: {
      title: 'About DirectRoot',
      content: `DirectRoot was born from a simple idea — farmers in Sri Lanka work incredibly hard, yet middlemen take a large cut of their earnings while buyers pay more than they should.

We built DirectRoot to change that. Our platform connects local farmers directly with buyers across Sri Lanka, removing the middlemen, ensuring fairer prices for farmers and fresher produce for buyers.

Founded in 2026, DirectRoot is built by a team passionate about supporting Sri Lanka's farming community. We believe technology should serve people — not complicate their lives.

Our mission is simple: make it easy for anyone to buy directly from the people who grow their food.`,
    },
    privacy: {
      title: 'Privacy Policy',
      content: `Last updated: January 2026

1. Information We Collect
We collect your username and password (encrypted) when you register. We also store your product listings, orders, and activity logs to operate the platform.

2. How We Use Your Information
Your information is used solely to operate DirectRoot — to show your listings, process orders, and maintain your account. We never sell your data to third parties.

3. Data Security
All passwords are encrypted using industry-standard bcrypt hashing. All API communication uses JWT authentication tokens. Your data is stored securely on our servers.

4. Data Retention
Your account data is kept as long as your account is active. Order history is preserved even after account deletion for record-keeping purposes.

5. Your Rights
You can update your password or delete your account at any time through Settings. To request complete data removal, contact us at support@directroot.lk.

6. Contact
For privacy concerns, email us at support@directroot.lk.`,
    },
    terms: {
      title: 'Terms of Use',
      content: `Last updated: January 2026

1. Acceptance
By using DirectRoot, you agree to these terms. If you do not agree, please do not use the platform.

2. User Accounts
You are responsible for keeping your account credentials secure. You must provide accurate information when registering. One account per person.

3. Farmers
Farmers agree to list only products they genuinely have available. Listing false quantities or prices is prohibited and may result in account suspension.

4. Buyers
Buyers agree to place orders only when they intend to complete the purchase. Repeated order cancellations may result in account restrictions.

5. Prohibited Conduct
Users must not attempt to hack, abuse, or disrupt the platform. Harassment of other users is strictly prohibited. Fraudulent activity will result in immediate account termination.

6. Limitation of Liability
DirectRoot facilitates connections between farmers and buyers but is not responsible for the quality of products exchanged. Disputes between users should be resolved directly.

7. Changes to Terms
We may update these terms at any time. Continued use of the platform after changes constitutes acceptance.

8. Contact
For questions about these terms, email support@directroot.lk.`,
    },
  };

  const stats = [
    { value: '500+', label: 'Farmers',           icon: Wheat,        color: '#34d399', target: 500, suffix: '+'  },
    { value: '12k+', label: 'Happy Buyers',       icon: ShoppingCart, color: '#7dd3fc', target: 12,  suffix: 'k+' },
    { value: '98%',  label: 'Satisfaction Rate',  icon: Star,         color: M3.yellow, target: 98,  suffix: '%'  },
    { value: '30+',  label: 'Product Categories', icon: Package,      color: M3.primary, target: 30, suffix: '+'  },
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
    { step: '01', icon: UserIcon, color: M3.primary, title: 'Create Account',    desc: 'Sign up as a farmer, buyer, or admin in under a minute.' },
    { step: '02', icon: Package,  color: '#34d399',  title: 'Browse or List',    desc: 'Farmers list products. Buyers browse fresh local produce.' },
    { step: '03', icon: Zap,      color: M3.yellow,  title: 'Transact Directly', desc: 'Place orders and connect directly — no middlemen involved.' },
  ];

  const glassCard = (color = M3.primary) => ({
    background: 'rgba(26, 29, 39, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid rgba(255,255,255,0.08)`,
    borderRadius: 24,
    padding: 32,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  });

  return (
    <div style={{ background: M3.bg, color: M3.text, fontFamily: "'Google Sans','Roboto',system-ui,sans-serif", overflowX: 'hidden' }}>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes float { 0%,100%{transform:translateY(0px);} 50%{transform:translateY(-12px);} }
        @keyframes spin-slow { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        @keyframes pulse-glow { 0%,100%{opacity:0.4;} 50%{opacity:0.8;} }
        @keyframes mesh-shift { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
        .glass-card:hover { border-color: rgba(255,255,255,0.16) !important; transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.4) !important; }
        .stat-card:hover { transform: translateY(-6px) !important; }
        .step-card:hover { transform: translateY(-6px) !important; }
        .nav-link:hover { color: #f0f0ff !important; }
        @keyframes modalIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(15,17,23,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${M3.primary}33` }}>
            <Sprout size={17} color={M3.primary} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px' }}>
            Direct<span style={{ color: M3.primary }}>Root</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['features', 'how-it-works', 'stats','pricing'].map(id => (
            <button key={id} className="nav-link" onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textMed, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', transition: 'color 0.2s' }}>
              {id.replace('-', ' ')}
            </button>
          ))}
        </div>
        <button onClick={onGetStarted} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', borderRadius: 20, background: 'rgba(74,79,168,0.8)', backdropFilter: 'blur(10px)', border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 0 20px ${M3.primary}22` }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(90,95,192,0.9)'; e.currentTarget.style.boxShadow = `0 0 30px ${M3.primary}44`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,79,168,0.8)'; e.currentTarget.style.boxShadow = `0 0 20px ${M3.primary}22`; }}
        >
          Sign In <ArrowRight size={14} />
        </button>
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, background: `linear-gradient(90deg, ${M3.primary}, ${M3.green})`, width: `${scrollProgress}%`, transition: 'width 0.1s linear', borderRadius: '0 2px 2px 0', boxShadow: `0 0 8px ${M3.primary}88` }} />
      </nav>

      <section id="tour-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '100px 40px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: `radial-gradient(ellipse 80% 60% at 20% 20%, rgba(74,79,168,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(52,211,153,0.2) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 60% 10%, rgba(99,102,241,0.2) 0%, transparent 50%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(109,220,145,0.15) 0%, transparent 50%)`, animation: 'pulse-glow 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '10%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent, rgba(195,198,255,0.08), transparent, rgba(109,220,145,0.08), transparent)', animation: 'spin-slow 20s linear infinite', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'conic-gradient(from 180deg, transparent, rgba(109,220,145,0.1), transparent, rgba(195,198,255,0.06), transparent)', animation: 'spin-slow 15s linear infinite reverse', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `linear-gradient(rgba(195,198,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(195,198,255,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 16px', borderRadius: 20, background: 'rgba(109,220,145,0.1)', backdropFilter: 'blur(10px)', border: `1px solid rgba(109,220,145,0.25)`, marginBottom: 28, boxShadow: '0 0 20px rgba(109,220,145,0.1)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: M3.green, boxShadow: `0 0 8px ${M3.green}` }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: M3.green }}>Now live — Sri Lanka's farming marketplace</span>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 style={{ fontSize: 68, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-2.5px', marginBottom: 24, color: M3.text }}>
              Farm Fresh,<br />
              <span style={{ background: `linear-gradient(135deg, ${M3.primary} 0%, ${M3.green} 50%, #7dd3fc 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Direct to You
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p style={{ fontSize: 18, color: M3.textMed, lineHeight: 1.7, maxWidth: 560, margin: '0 auto 48px' }}>
              DirectRoot connects local farmers directly with buyers — cutting out middlemen, ensuring fair prices, and delivering fresher produce.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={onGetStarted} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 36px', borderRadius: 16, background: `linear-gradient(135deg, ${M3.primaryCont}, #6366f1)`, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 30px rgba(74,79,168,0.5)`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 40px rgba(74,79,168,0.7)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 30px rgba(74,79,168,0.5)`; }}
              >
                Start for Free <ArrowRight size={16} />
              </button>
              <button onClick={() => scrollTo('how-it-works')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', border: `1px solid rgba(255,255,255,0.1)`, color: M3.textMed, fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${M3.primary}55`; e.currentTarget.style.color = M3.primary; e.currentTarget.style.background = 'rgba(195,198,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = M3.textMed; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                How it works
              </button>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 56, flexWrap: 'wrap' }}>
              {['No middlemen', 'Fair prices', 'Fresh produce', 'Local farmers'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle size={14} color={M3.green} />
                  <span style={{ fontSize: 13, color: M3.textLow, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="tour-stats" style={{ padding: '80px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
        <span id="stats" style={{ position: 'absolute', top: -64 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(74,79,168,0.08) 0%, transparent 70%)', zIndex: 0 }} />
        <div ref={statsRef} style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, position: 'relative', zIndex: 1 }}>
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80} direction="up">
              <div className="stat-card" style={{ ...glassCard(s.color), textAlign: 'center', boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`, transition: 'all 0.3s ease' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}88, transparent)`, borderRadius: '24px 24px 0 0' }} />
                <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `${s.color}08`, filter: 'blur(20px)' }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 0 20px ${s.color}20` }}>
                  <s.icon size={22} color={s.color} />
                </div>
                <AnimatedCounter target={s.target} suffix={s.suffix} color={s.color} started={statsStarted} />
                <p style={{ fontSize: 13, color: M3.textLow, marginTop: 8, fontWeight: 500 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="tour-features" style={{ padding: '100px 40px', position: 'relative', overflow: 'hidden' }}>
        <span id="features" style={{ position: 'absolute', top: -64 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: `radial-gradient(ellipse 50% 60% at 0% 50%, rgba(52,211,153,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 100% 50%, rgba(74,79,168,0.07) 0%, transparent 60%)` }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 20, background: 'rgba(195,198,255,0.08)', backdropFilter: 'blur(10px)', border: `1px solid rgba(195,198,255,0.15)`, marginBottom: 16 }}>
                <Zap size={12} color={M3.primary} />
                <span style={{ fontSize: 11, fontWeight: 700, color: M3.primary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Features</span>
              </div>
              <h2 style={{ fontSize: 46, fontWeight: 900, color: M3.text, letterSpacing: '-1.5px', marginBottom: 16 }}>Everything you need</h2>
              <p style={{ fontSize: 16, color: M3.textLow, maxWidth: 480, margin: '0 auto' }}>Built for farmers, buyers, and platform administrators — all in one place.</p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 120} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <div className="glass-card" style={{ ...glassCard(f.color), boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`, cursor: 'default' }}>
                  <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: `${f.color}10`, filter: 'blur(40px)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${f.color}66, transparent)`, borderRadius: '24px 24px 0 0' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, boxShadow: `0 0 24px ${f.color}20` }}>
                      <f.icon size={26} color={f.color} />
                    </div>
                    <h3 style={{ fontSize: 21, fontWeight: 800, color: M3.text, marginBottom: 20, letterSpacing: '-0.3px' }}>{f.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                      {f.items.map((item, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 6, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <CheckCircle size={11} color={f.color} />
                          </div>
                          <span style={{ fontSize: 14, color: M3.textMed }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={onGetStarted} style={{ marginTop: 28, width: '100%', padding: '12px', borderRadius: 12, background: `${f.color}12`, border: `1px solid ${f.color}25`, color: f.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = `${f.color}22`; e.currentTarget.style.borderColor = `${f.color}44`; e.currentTarget.style.boxShadow = `0 0 20px ${f.color}20`; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${f.color}12`; e.currentTarget.style.borderColor = `${f.color}25`; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      Get started as {f.title.replace('For ', '')} <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{ padding: '100px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(109,220,145,0.06) 0%, transparent 60%)', zIndex: 0 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 20, background: 'rgba(109,220,145,0.08)', backdropFilter: 'blur(10px)', border: `1px solid rgba(109,220,145,0.2)`, marginBottom: 16 }}>
                <BarChart3 size={12} color={M3.green} />
                <span style={{ fontSize: 11, fontWeight: 700, color: M3.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>How it works</span>
              </div>
              <h2 style={{ fontSize: 46, fontWeight: 900, color: M3.text, letterSpacing: '-1.5px', marginBottom: 16 }}>Up and running in minutes</h2>
              <p style={{ fontSize: 16, color: M3.textLow, maxWidth: 440, margin: '0 auto' }}>Three simple steps to start buying or selling fresh local produce.</p>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, position: 'relative', marginTop: 24 }}>
            <div style={{ position: 'absolute', top: 44, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, ${M3.primary}44, ${M3.green}44)`, zIndex: 0 }} />
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 120} direction="up">
                <div className="step-card" style={{ ...glassCard(s.color), textAlign: 'center', zIndex: 1, boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`, transition: 'all 0.3s ease' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}66, transparent)`, borderRadius: '24px 24px 0 0' }} />
                  <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 100, height: 100, borderRadius: '50%', background: `${s.color}08`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', padding: '4px 14px', borderRadius: 20, background: 'rgba(15,17,23,0.9)', backdropFilter: 'blur(10px)', border: `1px solid ${s.color}55`, fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '0.08em', zIndex: 2 }}>
                    STEP {s.step}
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 20, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px auto 20px', boxShadow: `0 0 24px ${s.color}20` }}>
                      <s.icon size={26} color={s.color} />
                    </div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: M3.text, marginBottom: 12 }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: M3.textLow, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div id="tour-cta" style={{ marginTop: 64, textAlign: 'center' }}>
              <button onClick={onGetStarted} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 44px', borderRadius: 20, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 30px rgba(74,79,168,0.5)`, transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 40px rgba(74,79,168,0.7)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 30px rgba(74,79,168,0.5)`; }}
              >
                <Sprout size={18} /> Join DirectRoot Today <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="pricing" style={{ padding: '100px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(109,220,145,0.07) 0%, transparent 65%)', zIndex: 0 }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 20, background: 'rgba(109,220,145,0.08)', backdropFilter: 'blur(10px)', border: `1px solid rgba(109,220,145,0.2)`, marginBottom: 16 }}>
                <CheckCircle size={12} color={M3.green} />
                <span style={{ fontSize: 11, fontWeight: 700, color: M3.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pricing</span>
              </div>
              <h2 style={{ fontSize: 46, fontWeight: 900, color: M3.text, letterSpacing: '-1.5px', marginBottom: 16 }}>
                Always <span style={{ background: `linear-gradient(135deg,${M3.green},#34d399)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>free</span>. Forever.
              </h2>
              <p style={{ fontSize: 16, color: M3.textLow, maxWidth: 480, margin: '0 auto' }}>
                No hidden fees. No commissions. No credit card required. DirectRoot is 100% free for everyone.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
              <div style={{ background: 'rgba(26,29,39,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(109,220,145,0.2)', borderRadius: 28, padding: '40px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${M3.green}88, transparent)` }} />
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `${M3.green}08`, filter: 'blur(40px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: M3.green, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>One plan for everyone</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: M3.textLow, marginTop: 10 }}>Rs.</span>
                    <span style={{ fontSize: 96, fontWeight: 900, color: M3.text, lineHeight: 1, letterSpacing: '-4px' }}>0</span>
                  </div>
                  <p style={{ fontSize: 15, color: M3.textLow, marginBottom: 28 }}>per month, forever</p>
                  <button onClick={onGetStarted} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 14, background: `linear-gradient(135deg,rgba(109,220,145,0.2),rgba(52,211,153,0.15))`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,220,145,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,rgba(109,220,145,0.2),rgba(52,211,153,0.15))'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Get started — it's free <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                { role: '🌾 Farmers',  items: ['Unlimited product listings', 'Set your own prices', 'Sales analytics dashboard', 'Order notifications', 'Stock management'] },
                { role: '🛒 Buyers',   items: ['Browse all products', 'Direct farm ordering', 'Order history & tracking', 'Spending analytics', 'Shopping insights'] },
                { role: '🛡️ Admins',  items: ['Full user management', 'Platform analytics', 'Activity log monitoring', 'Product oversight', 'Account controls'] },
              ].map((plan, i) => (
                <div key={i} style={{ background: 'rgba(26,29,39,0.6)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px 22px', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${M3.green}33`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <p style={{ fontSize: 15, fontWeight: 800, color: M3.text, marginBottom: 18 }}>{plan.role}</p>
                  {plan.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <CheckCircle size={14} color={M3.green} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: M3.textMed }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 18, padding: '8px 14px', borderRadius: 10, background: `${M3.green}0f`, border: `1px solid ${M3.green}22`, textAlign: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: M3.green }}>All included — free</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ marginTop: 32, padding: '20px 28px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
              {['No signup fee', 'No listing fee', 'No commission', 'No credit card', 'No expiry'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <CheckCircle size={13} color={M3.green} />
                  <span style={{ fontSize: 13, color: M3.textMed, fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 40px', background: 'rgba(26,29,39,0.8)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${M3.primary}33` }}>
                <Sprout size={17} color={M3.primary} />
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, color: M3.text }}>Direct<span style={{ color: M3.primary }}>Root</span></span>
            </div>
            <p style={{ fontSize: 13, color: M3.textLow, lineHeight: 1.7, maxWidth: 260 }}>Connecting local farmers directly with buyers. Fresh produce, fair prices, no middlemen.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: M3.green, boxShadow: `0 0 8px ${M3.green}` }} />
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
                <button key={j} onClick={footerLinks[link]} style={{ display: 'block', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: M3.textMed, marginBottom: 10, textAlign: 'left', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = M3.text}
                  onMouseLeave={e => e.target.style.color = M3.textMed}
                >{link}</button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, color: M3.textLow }}>© 2026 DirectRoot. All rights reserved.</p>
          <p style={{ fontSize: 12, color: M3.textLow }}>Built with ❤️ for local farmers</p>
        </div>
      </footer>

      <ChatBot />
      <GuidedTour onGetStarted={onGetStarted} />

      {modal && (
        <>
          <div onClick={() => setModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 3000 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 3001, width: '90%', maxWidth: 560, maxHeight: '80vh', background: 'rgba(26,29,39,0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', animation: 'modalIn 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${M3.primary}88, ${M3.green}88, transparent)`, borderRadius: '24px 24px 0 0' }} />
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sprout size={17} color={M3.primary} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>{MODALS[modal].title}</h2>
              </div>
              <button onClick={() => setModal(null)} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: M3.textLow, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = M3.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = M3.textLow; }}
              >✕</button>
            </div>
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
              {MODALS[modal].content.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: 13, lineHeight: 1.75, marginBottom: 14, fontWeight: para.match(/^\d\./) ? 600 : 400, color: para.match(/^\d\./) ? M3.primary : M3.textLow }}>
                  {para}
                </p>
              ))}
            </div>
            <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => setModal(null)} style={{ padding: '10px 24px', borderRadius: 12, background: M3.primaryCont, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#5a5fc0'}
                onMouseLeave={e => e.currentTarget.style.background = M3.primaryCont}
              >Close</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}