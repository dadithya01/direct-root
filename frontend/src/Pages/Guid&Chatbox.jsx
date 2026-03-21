import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, X, Send, Sprout, ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const M3 = {
  bg:          '#0f1117',
  surface:     '#1a1d27',
  surfaceVar:  '#1f2230',
  outline:     '#2e3150',
  outlineVar:  '#252840',
  primary:     '#c3c6ff',
  primaryCont: '#4a4fa8',
  green:       '#6ddc91',
  text:        '#f0f0ff',
  textMed:     '#c4c4e0',
  textLow:     '#8e8eaa',
  yellow:      '#f5c518',
};

// ── Paste your Groq key here (get free key at console.groq.com) ──
const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';
const SYSTEM_PROMPT = `You are a helpful assistant for DirectRoot — a Sri Lankan farm-to-buyer marketplace.
Only answer questions related to DirectRoot. Keep answers short, friendly, and clear (2-4 sentences max).
Use occasional emojis. Wrap important words in **double asterisks** for bold.
If asked about anything unrelated to DirectRoot, politely say you can only help with DirectRoot questions.

About DirectRoot:
- Farmers register and list products (vegetables, fruits, grains, dairy, meat) with prices and quantities.
- Buyers browse the marketplace, add to cart, and place orders directly from farmers.
- Admins manage users, view activity logs, and access analytics.
- Completely free — no fees, no commissions. Farmers keep 100% of their price.
- Built for Sri Lanka, connecting farmers and buyers across all provinces.
- Users sign up with username and password, choosing role: FARMER, BUYER, or ADMIN.
- Passwords changed in Settings → Change Password. Accounts deleted in Settings → Danger Zone.
- Farmers must remove all listings before deleting their account.`;

async function groqReply(userMessage) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    console.error('Groq error:', res.status, errBody);
    throw new Error(`Groq ${res.status}: ${errBody?.error?.message || 'Unknown error'}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Empty Groq response');
  return text;
}

// ── Local TF-IDF fallback ──
const FAQ = [
  { question: 'How do I register or create an account?', keywords: ['register', 'sign up', 'signup', 'create account', 'join', 'how to start', 'new account', 'begin', 'getting started'], answer: "To register, click the **Sign In** button in the top right → then click **Sign up**. Choose your role — Farmer, Buyer, or Admin — enter your username and password, and you're in! It's completely free. 🌱" },
  { question: 'How do I list or sell products as a farmer?', keywords: ['farmer', 'sell', 'list', 'listing', 'post product', 'add product', 'create listing', 'new product', 'upload product'], answer: "As a Farmer, go to **Post New Item** after signing in. Fill in the product name, category, price, and quantity. Your listing appears in the marketplace instantly for buyers to purchase. 🌾" },
  { question: 'How do I buy or order products?', keywords: ['buy', 'purchase', 'order', 'shop', 'buyer', 'cart', 'checkout', 'place order', 'add to cart'], answer: "As a Buyer, browse the **Marketplace** tab after signing in. Add items to your cart, adjust quantities, then click **Place Order**. Your order history is in the **My Orders** tab. 🛒" },
  { question: 'Is DirectRoot free to use? What does it cost?', keywords: ['free', 'cost', 'price', 'fee', 'charge', 'pay', 'subscription', 'money', 'payment', 'how much', 'pricing', 'commission'], answer: "DirectRoot is **completely free** for everyone! No listing fees, no subscriptions, no commissions. Farmers keep 100% of their product price. ✅" },
  { question: 'What product categories are available?', keywords: ['category', 'categories', 'vegetable', 'fruit', 'grain', 'dairy', 'meat', 'product type', 'what can i sell', 'what products'], answer: "DirectRoot supports **Vegetables, Fruits, Grains, Dairy, Meat**, and Other categories. Farmers can list any fresh local produce. Browse by category in the marketplace! 🥦" },
  { question: 'How do I contact support or get help?', keywords: ['contact', 'support', 'help', 'problem', 'issue', 'whatsapp', 'assist', 'customer service', 'reach', 'email'], answer: "For support, use the contact form in the footer or email **support@directroot.lk**. We typically respond within 24 hours. For urgent issues, reach out via WhatsApp! 📞" },
  { question: 'What can admins do on the platform?', keywords: ['admin', 'administrator', 'manage', 'platform', 'dashboard', 'admin role', 'admin access', 'manage users'], answer: "Admins have full platform oversight — manage all users, view activity logs, monitor product listings, and access full analytics. Admin accounts require special approval. 🛡️" },
  { question: 'How do I change my password?', keywords: ['password', 'forgot', 'reset', 'change password', 'update password', 'new password', 'lost password'], answer: "Go to **Settings → Change Password** after logging in. Enter your current password, then your new password. You'll be signed out automatically after a successful change. 🔒" },
  { question: 'How do I delete my account?', keywords: ['delete', 'remove account', 'cancel', 'close account', 'deactivate', 'delete account'], answer: "Go to **Settings → Danger Zone** to delete your account. Note: Farmers must remove all product listings first. Your order history is preserved after deletion. ⚠️" },
  { question: 'Is DirectRoot safe and secure?', keywords: ['safe', 'secure', 'trust', 'scam', 'reliable', 'privacy', 'data', 'security', 'protected'], answer: "DirectRoot is fully secure — all passwords are encrypted with bcrypt and communication uses JWT tokens. Transactions happen directly between farmers and buyers with admin oversight. Your data is never sold. 🔐" },
  { question: 'Where is DirectRoot available?', keywords: ['sri lanka', 'location', 'where', 'country', 'region', 'available', 'province', 'coverage', 'area'], answer: "DirectRoot is built specifically for **Sri Lanka's local farming community**! We connect farmers and buyers across all provinces — from Colombo to Kandy, Jaffna to Galle! 🇱🇰" },
  { question: 'How do I view my order history or analytics?', keywords: ['order history', 'my orders', 'analytics', 'spending', 'past orders', 'view orders', 'purchases', 'track orders'], answer: "Your order history is in **My Orders** tab. The **Analytics** tab shows total spending, most purchased products, spending by category, and shopping insights! 📊" },
  { question: 'How do I track my farm sales and performance?', keywords: ['sales', 'revenue', 'performance', 'farmer analytics', 'income', 'earnings', 'farm stats'], answer: "Farmers can view the **Analytics** tab to see total revenue, number of orders, best-selling products, sales by category, and current stock levels — all updated in real time! 📈" },
  { question: 'How do I edit or update my product listing?', keywords: ['edit product', 'update listing', 'modify product', 'change price', 'update stock', 'edit listing', 'update product'], answer: "In **My Listings**, find the product and click the Edit button. You can update the name, price, quantity, category, and description. Changes appear in the marketplace immediately. ✏️" },
  { question: 'How do I delete or remove a product listing?', keywords: ['delete product', 'remove listing', 'remove product', 'delete listing', 'take down product'], answer: "In **My Listings**, find the product and click the Delete button. It will be removed from the marketplace instantly. Note: remove all listings before deleting your farmer account. 🗑️" },
  { question: 'How do I sign in or log in?', keywords: ['sign in', 'login', 'log in', 'signin', 'access account', 'enter account'], answer: "Click the **Sign In** button in the top right of the landing page. Enter your username and password, then click **Sign In**. You'll be taken to your dashboard based on your role. 👤" },
  { question: 'What roles are available when registering?', keywords: ['role', 'roles', 'farmer role', 'buyer role', 'which role', 'what role', 'choose role', 'select role'], answer: "There are 3 roles — **Farmer** (list and sell products), **Buyer** (browse and purchase products), and **Admin** (manage the platform). Choose the role that fits your use case when registering. 🎭" },
  { question: 'How do I see what farmers are selling near me?', keywords: ['near me', 'local', 'nearby', 'close', 'find farmer', 'local farmer', 'local produce', 'fresh local'], answer: "Browse the **Marketplace** tab as a Buyer — all farmers across Sri Lanka list their products there. You can see which farmer listed each product and filter by category! 🗺️" },
];

const STOP_WORDS = new Set(['a','an','the','is','it','in','on','at','to','for','of','and','or','but','not','with','my','me','i','do','can','how','what','where','when','why','who','be','are','was','were','has','have','had','will','would','could','should','this','that','there','here','from','by','as','if','so','up','about','get','want','need','please','hi','hello','hey','thanks','thank']);
const SYNONYMS  = { 'cost':'free price fee','cheap':'free price fee','shop':'buy purchase order','market':'buy purchase marketplace','sell':'farmer list product','login':'sign in account','logout':'sign out account','account':'register sign up' };

function tokenize(text) { return text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(t=>t.length>1&&!STOP_WORDS.has(t)); }
function tf(term,doc) { return doc.length?doc.filter(t=>t===term).length/doc.length:0; }
function idf(term,corpus) { const n=corpus.filter(d=>d.includes(term)).length; return n?Math.log(corpus.length/n):0; }
function tfidfVector(doc,corpus) { const vec={}; for(const t of[...new Set(doc)]){const s=tf(t,doc)*idf(t,corpus);if(s>0)vec[t]=s;} return vec; }
function cosineSim(a,b) { const k=Object.keys(a); if(!k.length)return 0; const dot=k.reduce((s,x)=>s+a[x]*(b[x]||0),0); const ma=Math.sqrt(k.reduce((s,x)=>s+a[x]**2,0)); const mb=Math.sqrt(Object.values(b).reduce((s,v)=>s+v**2,0)); return ma&&mb?dot/(ma*mb):0; }

function getSmartResponse(input) {
  if (!input.trim()) return "Please type a question! 😊";
  const ut = tokenize(input);
  if (!ut.length) return "Could you rephrase that? I'm here to help! 😊";
  const corpus = FAQ.map(f => tokenize(f.question + ' ' + f.keywords.join(' ')));
  let bestScore = 0, bestMatch = null;
  for (let i = 0; i < FAQ.length; i++) {
    const dv = tfidfVector(corpus[i], corpus);
    let s = cosineSim(tfidfVector(ut, corpus), dv);
    const lo = input.toLowerCase();
    FAQ[i].keywords.forEach(k => { if (lo.includes(k)) s += Math.min(k.length > 5 ? 0.4 : 0.2, 0.7); });
    for (const [syn, exp] of Object.entries(SYNONYMS)) { if (lo.includes(syn)) { const ss = cosineSim(tfidfVector([...ut,...tokenize(exp)],corpus),dv)*0.85; if(ss>s)s=ss; } }
    if (s > bestScore) { bestScore = s; bestMatch = FAQ[i]; }
  }
  return bestScore < 0.04 || !bestMatch
    ? "I'm not sure about that! Try asking about **registering**, **buying**, **selling**, **pricing**, **security**, or **account settings**. Or pick a quick question below! 😊"
    : bestMatch.answer;
}

function BoldText({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? <strong key={i} style={{ color: M3.primary, fontWeight: 700 }}>{p}</strong> : p
      )}
    </span>
  );
}

// ── CHATBOT ──
export function ChatBot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm the DirectRoot smart assistant. Ask me anything about the platform — or pick a quick question below!" },
  ]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef           = useRef(null);

  const quickQuestions = [
    'How do I register?',
    'Is it free to use?',
    'How do I sell products?',
    'How do I place an order?',
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // ── Key fix: check if key starts with gsk_ ──
  const usingAI = GROQ_API_KEY && GROQ_API_KEY.startsWith('gsk_');

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;
    setInput('');
    setMessages(m => [...m, { from: 'user', text: msg }]);
    setTyping(true);

    let reply = null;

    if (usingAI) {
      try {
        reply = await groqReply(msg);
      } catch (err) {
        console.warn('Groq failed, using local FAQ fallback:', err.message);
      }
    }

    if (!reply) {
      await new Promise(r => setTimeout(r, 500 + Math.random() * 300));
      reply = getSmartResponse(msg);
    }

    setMessages(m => [...m, { from: 'bot', text: reply }]);
    setTyping(false);
  };

  return (
    <>
      {/* Floating pill button */}
      <button onClick={() => { setOpen(o => !o); setUnread(0); }} style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
        height: 48, padding: '0 20px', borderRadius: 999,
        background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`,
        border: `1px solid ${M3.primary}44`,
        display: 'flex', alignItems: 'center', gap: 9,
        cursor: 'pointer', transition: 'all 0.3s',
        animation: open ? 'none' : 'chatPulse 2.5s ease-in-out infinite',
        boxShadow: `0 4px 28px rgba(74,79,168,0.65)`,
        whiteSpace: 'nowrap',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(74,79,168,0.8)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 28px rgba(74,79,168,0.65)`; }}
      >
        {open ? <X size={17} color={M3.primary} /> : <MessageCircle size={17} color={M3.primary} />}
        <span style={{ fontSize: 13, fontWeight: 700, color: M3.primary }}>
          {open ? 'Close' : 'Ask anything'}
        </span>
        {!open && unread > 0 && (
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#ef4444', fontSize: 10, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2 }}>
            {unread}
          </div>
        )}
      </button>

      {/* Chat panel */}
      <div style={{
        position: 'fixed', bottom: 88, right: 28, zIndex: 999,
        width: 340, height: open ? 500 : 0, overflow: 'hidden',
        background: 'rgba(26,29,39,0.97)', backdropFilter: 'blur(20px)',
        border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12, background: `linear-gradient(135deg,rgba(74,79,168,0.3),transparent)`, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${M3.primary}44` }}>
            <Sprout size={18} color={M3.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>DirectRoot Assistant</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: M3.green, boxShadow: `0 0 6px ${M3.green}` }} />
              <span style={{ fontSize: 11, color: M3.green, fontWeight: 600 }}>
                {usingAI ? 'AI' : 'Smart FAQ'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '84%', padding: '10px 14px',
                borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.from === 'user' ? `linear-gradient(135deg,${M3.primaryCont},#6366f1)` : 'rgba(255,255,255,0.06)',
                border: m.from === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                fontSize: 13, lineHeight: 1.55,
                color: m.from === 'user' ? M3.primary : M3.textMed,
              }}>
                <BoldText text={m.text} />
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '10px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: M3.textLow, animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 12, background: 'rgba(195,198,255,0.06)', border: `1px solid ${M3.primary}22`, color: M3.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(195,198,255,0.12)'; e.currentTarget.style.borderColor = `${M3.primary}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(195,198,255,0.06)'; e.currentTarget.style.borderColor = `${M3.primary}22`; }}
                >{q}</button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${M3.outlineVar}`, display: 'flex', gap: 8, flexShrink: 0 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !typing && sendMessage()}
            placeholder="Ask anything about DirectRoot..."
            style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.08)`, color: M3.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
            onFocus={e => e.target.style.borderColor = `${M3.primary}55`}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <button onClick={() => !typing && sendMessage()} disabled={!input.trim() || typing}
            style={{ width: 40, height: 40, borderRadius: 12, background: input.trim() && !typing ? `linear-gradient(135deg,${M3.primaryCont},#6366f1)` : 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !typing ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0 }}>
            <Send size={16} color={input.trim() && !typing ? M3.primary : M3.textLow} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes chatPulse {
          0%,100% { box-shadow: 0 4px 28px rgba(74,79,168,0.65), 0 0 0 0 rgba(195,198,255,0.35); }
          50%      { box-shadow: 0 4px 28px rgba(74,79,168,0.65), 0 0 0 9px rgba(195,198,255,0); }
        }
        @keyframes typingDot {
          0%,60%,100% { transform: translateY(0); opacity: 0.4; }
          30%          { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

// ══════════════════════════════════════════════
// ── GUIDED TOUR ──
// ══════════════════════════════════════════════
const TOUR_STEPS = [
  { target: null,            title: '👋 Welcome to DirectRoot!',  desc: "Sri Lanka's first direct farm-to-buyer marketplace. Let us show you around in 5 quick steps.", position: 'center' },
  { target: 'tour-hero',    title: '🌱 Fresh from the farm',      desc: 'DirectRoot connects local farmers directly with buyers — no middlemen, fair prices, fresher produce.', position: 'bottom' },
  { target: 'tour-stats',   title: '📊 Already growing fast',     desc: 'Over 500 farmers and 12,000 buyers have already joined. Be part of the movement!', position: 'top' },
  { target: 'tour-features',title: '✨ Built for everyone',        desc: "Whether you're a farmer wanting to sell, a buyer wanting fresh produce, or an admin — we've got you covered.", position: 'top' },
  { target: 'tour-cta',     title: '🚀 Ready to join?',           desc: 'Sign up in under a minute — completely free. Start buying or selling fresh local produce today!', position: 'top' },
];

export function GuidedTour({ onGetStarted }) {
  const [step, setStep]           = useState(0);
  const [visible, setVisible]     = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('dr_tour_seen');
    if (seen) return;
    const t = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('dr_tour_seen', '1');
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      const t = TOUR_STEPS[nextStep].target;
      if (t) document.getElementById(t)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      dismiss();
      onGetStarted();
    }
  };

  const prev = () => { if (step > 0) setStep(step - 1); };

  if (!visible || dismissed) return null;

  const current  = TOUR_STEPS[step];
  const isCenter = current.position === 'center';

  return (
    <>
      <div onClick={dismiss} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000 }} />
      <div style={{
        position: 'fixed', zIndex: 2001, width: 360,
        ...(isCenter ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' } : { bottom: 40, left: '50%', transform: 'translateX(-50%)' }),
        background: 'rgba(26,29,39,0.98)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'tourIn 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${M3.primary}88,${M3.green}88,transparent)`, borderRadius: '24px 24px 0 0' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 99, background: i === step ? M3.primary : M3.outlineVar, transition: 'all 0.3s' }} />
            ))}
          </div>
          <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = M3.text}
            onMouseLeave={e => e.currentTarget.style.color = M3.textLow}
          >Skip tour <X size={13} /></button>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: M3.text, marginBottom: 10, letterSpacing: '-0.3px' }}>{current.title}</h3>
        <p style={{ fontSize: 14, color: M3.textMed, lineHeight: 1.6, marginBottom: 24 }}>{current.desc}</p>
        <p style={{ fontSize: 11, color: M3.textLow, marginBottom: 16, textAlign: 'center' }}>Step {step + 1} of {TOUR_STEPS.length}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={prev} style={{ flex: 1, padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: M3.textMed, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            ><ChevronLeft size={15} /> Back</button>
          )}
          <button onClick={next} style={{ flex: 2, padding: '11px', borderRadius: 12, background: step === TOUR_STEPS.length - 1 ? `linear-gradient(135deg,${M3.primaryCont},#6366f1)` : `rgba(74,79,168,0.5)`, border: `1px solid ${M3.primary}44`, color: M3.primary, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s', boxShadow: step === TOUR_STEPS.length - 1 ? `0 4px 20px rgba(74,79,168,0.5)` : 'none' }}
            onMouseEnter={e => e.currentTarget.style.background = step === TOUR_STEPS.length - 1 ? `linear-gradient(135deg,#5a5fc0,#7c3aed)` : 'rgba(74,79,168,0.7)'}
            onMouseLeave={e => e.currentTarget.style.background = step === TOUR_STEPS.length - 1 ? `linear-gradient(135deg,${M3.primaryCont},#6366f1)` : 'rgba(74,79,168,0.5)'}
          >
            {step === TOUR_STEPS.length - 1 ? <><Sprout size={15} /> Get Started!</> : <>Next <ChevronRight size={15} /></>}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes tourIn {
          from { opacity:0; transform:${isCenter ? 'translate(-50%,-48%)' : 'translateX(-50%) translateY(16px)'}; }
          to   { opacity:1; transform:${isCenter ? 'translate(-50%,-50%)' : 'translateX(-50%) translateY(0)'}; }
        }
      `}</style>
    </>
  );
}