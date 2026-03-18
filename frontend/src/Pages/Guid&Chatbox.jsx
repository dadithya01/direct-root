import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle, X, Send, Sprout, ChevronRight,
  ChevronLeft, ArrowRight,
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
  greenCont:   '#003917',
  text:        '#f0f0ff',
  textMed:     '#c4c4e0',
  textLow:     '#8e8eaa',
  yellow:      '#f5c518',
};

// ── FAQ knowledge base ──
// const FAQ = [
//   {
//     keywords: ['register', 'sign up', 'signup', 'create account', 'join', 'how to start'],
//     answer: "To register, click the **Sign In** button in the top right → then click **Sign up**. Choose your role — Farmer, Buyer, or Admin — enter your username and password, and you're in! It's completely free. 🌱",
//   },
//   {
//     keywords: ['farmer', 'sell', 'list', 'listing', 'post product', 'add product'],
//     answer: "As a Farmer, once you're signed in you can go to **Post New Item** and list your products with name, category, price, and quantity. Your listings appear in the marketplace instantly for buyers to purchase. 🌾",
//   },
//   {
//     keywords: ['buy', 'purchase', 'order', 'shop', 'buyer', 'cart'],
//     answer: "As a Buyer, browse the **Marketplace** tab after signing in. Add items to your cart, adjust quantities, then click **Place Order**. Your order history is available in the **My Orders** tab. 🛒",
//   },
//   {
//     keywords: ['free', 'cost', 'price', 'fee', 'charge', 'pay', 'subscription'],
//     answer: "DirectRoot is **completely free** to use! No listing fees, no subscription, no commissions. Farmers keep 100% of their product price. We believe fair trade should be accessible to everyone. ✅",
//   },
//   {
//     keywords: ['contact', 'support', 'help', 'problem', 'issue', 'whatsapp'],
//     answer: "For support, you can reach us through the contact form in the footer. We typically respond within 24 hours. For urgent issues, reach out via WhatsApp — link available in the footer. 📞",
//   },
//   {
//     keywords: ['admin', 'manage', 'platform', 'dashboard'],
//     answer: "Admins have full platform oversight — manage all users, view activity logs, monitor product listings, and access analytics. Admin accounts require special approval. 🛡️",
//   },
//   {
//     keywords: ['product', 'category', 'vegetable', 'fruit', 'grain', 'dairy', 'meat'],
//     answer: "DirectRoot supports **Vegetables, Fruits, Grains, Dairy, Meat**, and Other categories. Farmers can list any fresh local produce. Browse by category in the marketplace to find what you need! 🥦",
//   },
//   {
//     keywords: ['password', 'forgot', 'reset', 'change password'],
//     answer: "You can change your password in **Settings → Change Password** after logging in. Enter your current password, then your new one. If you've forgotten your password, contact our support team for help. 🔒",
//   },
//   {
//     keywords: ['delete', 'remove account', 'cancel'],
//     answer: "You can delete your account in **Settings → Danger Zone**. Note: Farmers must remove all their product listings before deleting their account. Your order history is preserved for records. ⚠️",
//   },
//   {
//     keywords: ['safe', 'secure', 'trust', 'scam', 'reliable'],
//     answer: "DirectRoot is a secure platform. All accounts are verified, and transactions happen directly between farmers and buyers. We have an admin team monitoring activity 24/7. Your data is never sold. 🔐",
//   },
//   {
//     keywords: ['sri lanka', 'location', 'where', 'country', 'region'],
//     answer: "DirectRoot is built specifically for **Sri Lanka's local farming community**. We connect farmers and buyers across all provinces — from Colombo to Kandy, Jaffna to Galle! 🇱🇰",
//   },
// ];

// Simple keyword matcher
// function getResponse(input) {
//   const lower = input.toLowerCase();
//   for (const faq of FAQ) {
//     if (faq.keywords.some(k => lower.includes(k))) {
//       return faq.answer;
//     }
//   }
//   return "I'm not sure about that! Try asking about **registering**, **buying**, **selling**, **pricing**, or **support**. Or click one of the quick questions below! 😊";
// }

// Render bold markdown **text**
// function BoldText({ text }) {
//   const parts = text.split(/\*\*(.*?)\*\*/g);
//   return (
//     <span>
//       {parts.map((p, i) =>
//         i % 2 === 1
//           ? <strong key={i} style={{ color: M3.primary, fontWeight: 700 }}>{p}</strong>
//           : p
//       )}
//     </span>
//   );
// }

// ── FAQ CHATBOT ──
// export function ChatBot() {
//   const [open, setOpen]         = useState(false);
//   const [messages, setMessages] = useState([
//     { from: 'bot', text: "👋 Hi! I'm the DirectRoot assistant. Ask me anything about the platform — or pick a quick question below!" },
//   ]);
//   const [input, setInput]       = useState('');
//   const [typing, setTyping]     = useState(false);
//   const [unread, setUnread]     = useState(1);
//   const bottomRef               = useRef(null);

//   const quickQuestions = [
//     'How do I register?',
//     'Is it free to use?',
//     'How do I sell products?',
//     'How do I place an order?',
//   ];

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, typing]);

//   const sendMessage = (text) => {
//     const msg = text || input.trim();
//     if (!msg) return;
//     setInput('');
//     setMessages(m => [...m, { from: 'user', text: msg }]);
//     setTyping(true);
//     setTimeout(() => {
//       setMessages(m => [...m, { from: 'bot', text: getResponse(msg) }]);
//       setTyping(false);
//     }, 800 + Math.random() * 400);
//   };

//   return (
//     <>
//       {/* Floating button */}
//       <button
//         onClick={() => { setOpen(o => !o); setUnread(0); }}
//         style={{
//           position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
//           width: 56, height: 56, borderRadius: '50%',
//           background: `linear-gradient(135deg, ${M3.primaryCont}, #6366f1)`,
//           border: `1px solid ${M3.primary}44`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           cursor: 'pointer', boxShadow: `0 4px 24px rgba(74,79,168,0.6), 0 0 0 0 ${M3.primary}44`,
//           transition: 'all 0.3s',
//           animation: open ? 'none' : 'chatPulse 2.5s ease-in-out infinite',
//         }}
//         onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
//         onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
//       >
//         {open ? <X size={22} color={M3.primary} /> : <MessageCircle size={22} color={M3.primary} />}
//         {!open && unread > 0 && (
//           <div style={{ position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: `2px solid ${M3.bg}`, fontSize: 10, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             {unread}
//           </div>
//         )}
//       </button>

//       {/* Chat panel */}
//       <div style={{
//         position: 'fixed', bottom: 96, right: 28, zIndex: 999,
//         width: 340, height: open ? 480 : 0, overflow: 'hidden',
//         background: 'rgba(26,29,39,0.95)', backdropFilter: 'blur(20px)',
//         border: `1px solid rgba(255,255,255,0.08)`,
//         borderRadius: 20,
//         boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
//         transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
//         display: 'flex', flexDirection: 'column',
//       }}>
//         {/* Header */}
//         <div style={{ padding: '16px 20px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12, background: `linear-gradient(135deg, rgba(74,79,168,0.3), transparent)`, flexShrink: 0 }}>
//           <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${M3.primaryCont},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${M3.primary}44` }}>
//             <Sprout size={18} color={M3.primary} />
//           </div>
//           <div>
//             <p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>DirectRoot Assistant</p>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
//               <div style={{ width: 6, height: 6, borderRadius: '50%', background: M3.green, boxShadow: `0 0 6px ${M3.green}` }} />
//               <span style={{ fontSize: 11, color: M3.green, fontWeight: 600 }}>Online</span>
//             </div>
//           </div>
//         </div>

//         {/* Messages */}
//         <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
//           {messages.map((m, i) => (
//             <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
//               <div style={{
//                 maxWidth: '82%', padding: '10px 14px', borderRadius: m.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
//                 background: m.from === 'user'
//                   ? `linear-gradient(135deg,${M3.primaryCont},#6366f1)`
//                   : 'rgba(255,255,255,0.06)',
//                 border: m.from === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
//                 fontSize: 13, lineHeight: 1.5,
//                 color: m.from === 'user' ? M3.primary : M3.textMed,
//               }}>
//                 <BoldText text={m.text} />
//               </div>
//             </div>
//           ))}

//           {/* Typing indicator */}
//           {typing && (
//             <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
//               <div style={{ padding: '10px 16px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 4, alignItems: 'center' }}>
//                 {[0, 1, 2].map(i => (
//                   <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: M3.textLow, animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Quick questions — show after first bot message only */}
//           {messages.length === 1 && (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
//               {quickQuestions.map((q, i) => (
//                 <button key={i} onClick={() => sendMessage(q)} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 12, background: 'rgba(195,198,255,0.06)', border: `1px solid ${M3.primary}22`, color: M3.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
//                   onMouseEnter={e => { e.currentTarget.style.background = 'rgba(195,198,255,0.12)'; e.currentTarget.style.borderColor = `${M3.primary}44`; }}
//                   onMouseLeave={e => { e.currentTarget.style.background = 'rgba(195,198,255,0.06)'; e.currentTarget.style.borderColor = `${M3.primary}22`; }}
//                 >
//                   {q}
//                 </button>
//               ))}
//             </div>
//           )}

//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div style={{ padding: '12px 14px', borderTop: `1px solid ${M3.outlineVar}`, display: 'flex', gap: 8, flexShrink: 0 }}>
//           <input
//             value={input}
//             onChange={e => setInput(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && sendMessage()}
//             placeholder="Ask a question..."
//             style={{ flex: 1, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.08)`, color: M3.text, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
//             onFocus={e => e.target.style.borderColor = `${M3.primary}55`}
//             onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
//           />
//           <button onClick={() => sendMessage()} disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: 12, background: input.trim() ? `linear-gradient(135deg,${M3.primaryCont},#6366f1)` : 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0 }}>
//             <Send size={16} color={input.trim() ? M3.primary : M3.textLow} />
//           </button>
//         </div>
//       </div>

//       <style>{`
//         @keyframes chatPulse {
//           0%,100% { box-shadow: 0 4px 24px rgba(74,79,168,0.6), 0 0 0 0 rgba(195,198,255,0.4); }
//           50% { box-shadow: 0 4px 24px rgba(74,79,168,0.6), 0 0 0 10px rgba(195,198,255,0); }
//         }
//         @keyframes typingDot {
//           0%,60%,100% { transform: translateY(0); opacity: 0.4; }
//           30% { transform: translateY(-4px); opacity: 1; }
//         }
//       `}</style>
//     </>
//   );
// }

// ── GUIDED TOUR ──
const TOUR_STEPS = [
  {
    target: null, // center of screen
    title: '👋 Welcome to DirectRoot!',
    desc: "Sri Lanka's first direct farm-to-buyer marketplace. Let us show you around in 5 quick steps.",
    position: 'center',
  },
  {
    target: 'tour-hero',
    title: '🌱 Fresh from the farm',
    desc: 'DirectRoot connects local farmers directly with buyers — no middlemen, fair prices, fresher produce.',
    position: 'bottom',
  },
  {
    target: 'tour-stats',
    title: '📊 Already growing fast',
    desc: 'Over 500 farmers and 12,000 buyers have already joined. Be part of the movement!',
    position: 'top',
  },
  {
    target: 'tour-features',
    title: '✨ Built for everyone',
    desc: 'Whether you\'re a farmer wanting to sell, a buyer wanting fresh produce, or an admin — we have you covered.',
    position: 'top',
  },
  {
    target: 'tour-cta',
    title: '🚀 Ready to join?',
    desc: 'Sign up in under a minute — completely free. Start buying or selling fresh local produce today!',
    position: 'top',
  },
];

export function GuidedTour({ onGetStarted }) {
  const [step, setStep]       = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show tour after 2.5s on first visit
  useEffect(() => {
    const seen = localStorage.getItem('dr_tour_seen');
    // if (seen) return;
    const t = setTimeout(() => setVisible(true), 1200);
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
      // Scroll to target section
      const t = TOUR_STEPS[nextStep].target;
      if (t) document.getElementById(t)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      dismiss();
      onGetStarted();
    }
  };

  const prev = () => { if (step > 0) setStep(step - 1); };

  if (!visible || dismissed) return null;

  const current = TOUR_STEPS[step];
  const isCenter = current.position === 'center';

  return (
    <>
      {/* Overlay */}
      <div onClick={dismiss} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 2000, transition: 'all 0.3s' }} />

      {/* Tour card */}
      <div style={{
        position: 'fixed', zIndex: 2001,
        ...(isCenter
          ? { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }
          : { bottom: 40, left: '50%', transform: 'translateX(-50%)' }
        ),
        width: 360,
        background: 'rgba(26,29,39,0.98)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 28,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        animation: 'tourIn 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Top glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${M3.primary}88, ${M3.green}88, transparent)`, borderRadius: '24px 24px 0 0' }} />

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 99, background: i === step ? M3.primary : M3.outlineVar, transition: 'all 0.3s' }} />
            ))}
          </div>
          <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = M3.text}
            onMouseLeave={e => e.currentTarget.style.color = M3.textLow}
          >
            Skip tour <X size={13} />
          </button>
        </div>

        {/* Content */}
        <h3 style={{ fontSize: 18, fontWeight: 800, color: M3.text, marginBottom: 10, letterSpacing: '-0.3px' }}>
          {current.title}
        </h3>
        <p style={{ fontSize: 14, color: M3.textMed, lineHeight: 1.6, marginBottom: 24 }}>
          {current.desc}
        </p>

        {/* Step counter */}
        <p style={{ fontSize: 11, color: M3.textLow, marginBottom: 16, textAlign: 'center' }}>
          Step {step + 1} of {TOUR_STEPS.length}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button onClick={prev} style={{ flex: 1, padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: M3.textMed, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <ChevronLeft size={15} /> Back
            </button>
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
          from { opacity: 0; transform: ${isCenter ? 'translate(-50%,-48%)' : 'translateX(-50%) translateY(16px)'}; }
          to   { opacity: 1; transform: ${isCenter ? 'translate(-50%,-50%)' : 'translateX(-50%) translateY(0)'}; }
        }
      `}</style>
    </>
  );
}