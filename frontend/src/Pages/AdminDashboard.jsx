// import React, { useState, useEffect } from 'react';
// import {
//   Sprout, LayoutDashboard, Users, LogOut, Search,
//   Activity, Loader2, AlertCircle, BarChart3, Clock,
//   Wheat, TrendingUp, ShieldCheck, Trash2, RefreshCw,
//   Bell, Settings, ArrowUpRight, Package, ChevronRight,
//   User, Lock, AlertTriangle, CheckCircle, Eye, EyeOff,
// } from 'lucide-react';
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
//   Tooltip, ResponsiveContainer, Legend,
// } from 'recharts';

// const API_BASE_URL = "http://localhost:8080/api/v1";

// const M3 = {
//   bg:          '#0f1117',
//   surface:     '#1a1d27',
//   surfaceVar:  '#1f2230',
//   outline:     '#2e3150',
//   outlineVar:  '#252840',
//   primary:     '#c3c6ff',
//   primaryCont: '#4a4fa8',
//   onPrimary:   '#0e1178',
//   secondary:   '#c6c5de',
//   tertiary:    '#e6b9d8',
//   error:       '#ffb4ab',
//   errorCont:   '#930006',
//   green:       '#6ddc91',
//   greenCont:   '#003917',
//   yellow:      '#f5c518',
//   text:        '#f0f0ff',
//   textMed:     '#c4c4e0',
//   textLow:     '#8e8eaa',
// };

// const chip = (role) => {
//   if (role === 'ADMIN')  return { bg: '#3730a3', color: '#c7d2fe', border: '#4338ca' };
//   if (role === 'FARMER') return { bg: '#064e3b', color: '#6ee7b7', border: '#065f46' };
//   if (role === 'BUYER')  return { bg: '#0c4a6e', color: '#7dd3fc', border: '#075985' };
//   return { bg: '#2e3150', color: M3.textMed, border: M3.outline };
// };

// const catChip = (cat) => {
//   const map = {
//     vegetables: { bg: '#14532d', color: '#86efac' },
//     fruits:     { bg: '#7c2d12', color: '#fdba74' },
//     grains:     { bg: '#713f12', color: '#fde047' },
//     dairy:      { bg: '#1e3a5f', color: '#93c5fd' },
//     meat:       { bg: '#7f1d1d', color: '#fca5a5' },
//   };
//   return map[cat?.toLowerCase()] || { bg: '#2e3150', color: M3.textMed };
// };

// const Chip = ({ role, category }) => {
//   const c = role ? chip(role) : catChip(category);
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center',
//       padding: '3px 10px', borderRadius: 999,
//       background: c.bg, color: c.color,
//       border: `1px solid ${c.border || c.bg}`,
//       fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
//     }}>
//       {role || category || '—'}
//     </span>
//   );
// };

// const StatCard = ({ label, value, sub, icon: Icon, accent, index }) => (
//   <div style={{
//     background: M3.surface, border: `1px solid ${M3.outline}`,
//     borderRadius: 20, padding: '22px 24px',
//     position: 'relative', overflow: 'hidden',
//   }}>
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: '20px 20px 0 0' }} />
//     <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
//       <div style={{ width: 44, height: 44, borderRadius: 14, background: `${accent}22`, border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <Icon size={20} color={accent} />
//       </div>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#163420', border: '1px solid #1a4a2a', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}>
//         <ArrowUpRight size={11} />+{Math.floor(Math.random() * 12 + 4)}%
//       </div>
//     </div>
//     <p style={{ fontSize: 34, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</p>
//     <p style={{ fontSize: 13, fontWeight: 600, color: M3.textMed, marginTop: 6 }}>{label}</p>
//     <p style={{ fontSize: 11, color: M3.textLow, marginTop: 3 }}>{sub}</p>
//   </div>
// );

// // Custom Tooltip for charts
// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 12, padding: '10px 14px' }}>
//       {label && <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 4 }}>{label}</p>}
//       {payload.map((p, i) => (
//         <p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}: {p.value}</p>
//       ))}
//     </div>
//   );
// };

// // ── Defined OUTSIDE component to prevent re-render focus loss ──
// const PwInput = ({ label, field, placeholder, value, onChange, show, onToggleShow }) => (
//   <div style={{ marginBottom: 16 }}>
//     <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: M3.textMed, marginBottom: 8 }}>{label}</label>
//     <div style={{ position: 'relative' }}>
//       <input
//         type={show ? 'text' : 'password'}
//         value={value}
//         onChange={e => onChange(e.target.value)}
//         placeholder={placeholder}
//         style={{
//           width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12,
//           background: M3.surfaceVar, border: `1px solid ${M3.outline}`,
//           color: M3.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
//         }}
//         onFocus={e => e.target.style.borderColor = M3.primary}
//         onBlur={e => e.target.style.borderColor = M3.outline}
//       />
//       <button
//         type="button"
//         onClick={onToggleShow}
//         style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow }}
//       >
//         {show ? <EyeOff size={16} /> : <Eye size={16} />}
//       </button>
//     </div>
//   </div>
// );

// export default function AdminDashboard({ user, onLogout }) {
//   const [activeTab, setActiveTab]           = useState('overview');
//   const [searchQuery, setSearchQuery]       = useState('');
//   const [users, setUsers]                   = useState([]);
//   const [activities, setActivities]         = useState([]);
//   const [products, setProducts]             = useState([]);
//   const [isLoading, setIsLoading]           = useState(false);
//   const [isLogsLoading, setIsLogsLoading]   = useState(false);
//   const [isProductsLoading, setIsProductsLoading] = useState(false);
//   const [fetchError, setFetchError]         = useState(null);

//   // Settings state
//   const [pwForm, setPwForm]                 = useState({ current: '', newPw: '', confirm: '' });
//   const [showPw, setShowPw]                 = useState({ current: false, newPw: false, confirm: false });
//   const [pwError, setPwError]               = useState(null);
//   const [pwSuccess, setPwSuccess]           = useState(null);
//   const [isPwLoading, setIsPwLoading]       = useState(false);
//   const [clearLogsLoading, setClearLogsLoading] = useState(false);
//   const [clearLogsSuccess, setClearLogsSuccess] = useState(null);

//   const fetchActivities = async () => {
//     setIsLogsLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/activity`, {
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
//       });
//       const result = await res.json();
//       setActivities(result.data || (Array.isArray(result) ? result : []));
//     } catch { setActivities([]); }
//     finally { setIsLogsLoading(false); }
//   };

//   const fetchUsers = async () => {
//     if (!user?.token) return;
//     setIsLoading(true); setFetchError(null);
//     try {
//       const res = await fetch(`${API_BASE_URL}/admin`, {
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
//       });
//       if (!res.ok) throw new Error('Failed to fetch users');
//       const result = await res.json();
//       setUsers(result.data || []);
//     } catch (e) { setFetchError(e.message); setUsers([]); }
//     finally { setIsLoading(false); }
//   };

//   const fetchProducts = async () => {
//     setIsProductsLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/products`, {
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
//       });
//       const result = await res.json();
//       setProducts(Array.isArray(result) ? result : result.data || []);
//     } catch { setProducts([]); }
//     finally { setIsProductsLoading(false); }
//   };

//   useEffect(() => { fetchUsers(); fetchActivities(); fetchProducts(); }, []);
//   useEffect(() => { if (activeTab === 'items') fetchProducts(); }, [activeTab]);

//   const deleteUser = async (id) => {
//     try {
//       await fetch(`${API_BASE_URL}/admin/users/${id}`, {
//         method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` },
//       });
//     } catch (e) { console.error(e); }
//     finally { await fetchUsers(); await fetchActivities(); }
//   };

//   const handleChangePassword = async () => {
//   setPwError(null); setPwSuccess(null);
//   if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwError('All fields are required.'); return; }
//   if (pwForm.newPw !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
//   if (pwForm.newPw.length < 6) { setPwError('Min. 6 characters required.'); return; }
//   if (pwForm.current === pwForm.newPw) { setPwError('New password must be different.'); return; }
//   setIsPwLoading(true);
//   try {
//     const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${user?.token}`,
//       },
//       body: JSON.stringify({
//         currentPassword: pwForm.current,
//         newPassword: pwForm.newPw,
//       }),
//     });
//     if (!res.ok) {
//       const err = await res.text();
//       throw new Error(err || 'Current password is incorrect.');
//     }
//     setPwSuccess('Password changed! Please sign in again.');
//     setPwForm({ current: '', newPw: '', confirm: '' });
//     setTimeout(() => onLogout(), 2000);
//   } catch (e) { setPwError(e.message); }
//   finally { setIsPwLoading(false); }
// };

//   const handleClearLogs = async () => {
//     if (!confirm('Clear all activity logs? This cannot be undone.')) return;
//     setClearLogsLoading(true);
//     try {
//       await fetch(`${API_BASE_URL}/activity/clear`, {
//         method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` },
//       });
//       setClearLogsSuccess('All logs cleared successfully.');
//       await fetchActivities();
//     } catch { setClearLogsSuccess('Logs cleared.'); setActivities([]); }
//     finally { setClearLogsLoading(false); }
//   };

//   const filteredUsers = users.filter(u =>
//     u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     u.role?.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const filteredProducts = products.filter(p =>
//     p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     p.farmerUsername?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const admins  = filteredUsers.filter(u => u.role === 'ADMIN');
//   const farmers = filteredUsers.filter(u => u.role === 'FARMER');
//   const buyers  = filteredUsers.filter(u => u.role === 'BUYER');

//   const avatarColor = (name) => `hsl(${(name?.charCodeAt(0) || 65) * 7 % 360}, 55%, 38%)`;

//   // ── Analytics data ──
//   const roleDonutData = [
//     { name: 'Admins',  value: users.filter(u => u.role === 'ADMIN').length,  color: '#c7d2fe' },
//     { name: 'Farmers', value: users.filter(u => u.role === 'FARMER').length, color: '#6ee7b7' },
//     { name: 'Buyers',  value: users.filter(u => u.role === 'BUYER').length,  color: '#7dd3fc' },
//   ].filter(d => d.value > 0);

//   const catCounts = products.reduce((acc, p) => {
//     const cat = p.category || 'Other';
//     acc[cat] = (acc[cat] || 0) + 1;
//     return acc;
//   }, {});
//   const categoryBarData = Object.entries(catCounts).map(([name, count]) => ({ name, count }));

//   const registrations = activities.filter(a => a.action?.toLowerCase().includes('register')).length;
//   const deletions     = activities.filter(a => a.action?.toLowerCase().includes('delete')).length;
//   const activitySummaryData = [
//     { name: 'Registrations', value: registrations, color: M3.green },
//     { name: 'Deletions',     value: deletions,     color: M3.error },
//   ];

//   const stats = [
//     { label: 'Total Users',    value: users.length,      sub: `${admins.length} admins · ${farmers.length} farmers · ${buyers.length} buyers`, icon: Users,      accent: M3.primary },
//     { label: 'Products',       value: products.length,   sub: 'Active marketplace listings',  icon: Package,    accent: M3.green },
//     { label: 'Activity Logs',  value: activities.length, sub: 'System events recorded',       icon: Activity,   accent: M3.tertiary },
//     { label: 'Active Farmers', value: farmers.length,    sub: 'Registered on platform',        icon: TrendingUp, accent: M3.yellow },
//   ];

//   const nav = [
//     { tab: 'overview',   icon: LayoutDashboard, label: 'Overview' },
//     { tab: 'users',      icon: Users,           label: 'Users' },
//     { tab: 'items',      icon: Wheat,           label: 'Products' },
//     { tab: 'analytics',  icon: BarChart3,       label: 'Analytics' },
//     { tab: 'settings',   icon: Settings,        label: 'Settings' },
//   ];



//   return (
//     <div style={{ minHeight: '100vh', display: 'flex', background: M3.bg, fontFamily: "'Google Sans', 'Roboto', system-ui, sans-serif", color: M3.text }}>

//       {/* ── Sidebar ── */}
//       <aside style={{ width: 256, background: M3.surface, borderRight: `1px solid ${M3.outline}`, display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 20 }}>
//         <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${M3.outlineVar}` }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${M3.primaryCont}, #6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${M3.primary}44, 0 4px 12px #6366f144` }}>
//               <Sprout size={20} color={M3.primary} />
//             </div>
//             <div>
//               <p style={{ fontSize: 16, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>DirectRoot</p>
//               <p style={{ fontSize: 11, color: M3.primary, fontWeight: 600, marginTop: 1 }}>Admin Console</p>
//             </div>
//           </div>
//         </div>

//         <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
//           <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', marginBottom: 6 }}>Main Menu</p>
//           {nav.map(({ tab, icon: Icon, label }) => {
//             const active = activeTab === tab;
//             return (
//               <button key={label} onClick={() => setActiveTab(tab)} style={{
//                 width: '100%', display: 'flex', alignItems: 'center', gap: 14,
//                 padding: '13px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
//                 background: active ? `${M3.primary}18` : 'transparent',
//                 color: active ? M3.primary : M3.textMed,
//                 fontSize: 14, fontWeight: active ? 700 : 500,
//                 transition: 'all 0.15s ease', textAlign: 'left', position: 'relative',
//                 borderLeft: active ? `2px solid ${M3.primary}` : '2px solid transparent',
//               }}
//                 onMouseEnter={e => { if (!active) e.currentTarget.style.background = M3.outlineVar; }}
//                 onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
//               >
//                 <Icon size={18} />
//                 <span>{label}</span>
//                 {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
//               </button>
//             );
//           })}
//         </nav>

//         <div style={{ padding: '16px 12px', borderTop: `1px solid ${M3.outlineVar}` }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: M3.outlineVar, marginBottom: 8, border: `1px solid ${M3.outline}` }}>
//             <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${M3.primaryCont}, #7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: M3.primary }}>
//               {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
//             </div>
//             <div style={{ minWidth: 0, flex: 1 }}>
//               <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Admin'}</p>
//               <p style={{ fontSize: 11, color: M3.textLow }}>Administrator</p>
//             </div>
//           </div>
//           <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'transparent', color: M3.error, fontSize: 13, fontWeight: 600, transition: 'background 0.15s' }}
//             onMouseEnter={e => e.currentTarget.style.background = `${M3.errorCont}66`}
//             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//           >
//             <LogOut size={16} /> Sign out
//           </button>
//         </div>
//       </aside>

//       {/* ── Main ── */}
//       <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

//         {/* Topbar */}
//         <header style={{ background: `${M3.surface}e8`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${M3.outline}`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
//           <h1 style={{ fontSize: 18, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>
//             {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'users' ? 'User Management' : activeTab === 'items' ? 'Product Listings' : activeTab === 'analytics' ? 'Analytics' : 'Settings'}
//           </h1>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, borderRadius: 28, padding: '9px 16px', width: 240 }}>
//               <Search size={15} color={M3.textLow} />
//               <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', color: M3.text, fontSize: 13, flex: 1 }} />
//             </div>
//             <button onClick={() => { fetchUsers(); fetchActivities(); fetchProducts(); }} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}>
//               <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
//             </button>
//             <button style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed, position: 'relative' }}>
//               <Bell size={16} />
//               {activities.length > 0 && <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: M3.error, borderRadius: '50%', border: `2px solid ${M3.surface}` }} />}
//             </button>
//           </div>
//         </header>

//         <div style={{ padding: '32px', flex: 1 }}>
//           {fetchError && (
//             <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 16, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>
//               <AlertCircle size={16} /> {fetchError}
//             </div>
//           )}

//           {/* ── OVERVIEW ── */}
//           {activeTab === 'overview' && (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
//                 {stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
//               </div>
//               <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18 }}>
//                 {/* Recent Users */}
//                 <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
//                   <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                     <p style={{ fontSize: 15, fontWeight: 700, color: M3.text }}>Recent Users</p>
//                     <button onClick={() => setActiveTab('users')} style={{ fontSize: 12, fontWeight: 600, color: M3.primary, background: `${M3.primary}18`, border: `1px solid ${M3.primary}30`, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>View all</button>
//                   </div>
//                   {isLoading ? <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}><Loader2 size={24} color={M3.primary} className="animate-spin" /></div>
//                     : users.slice(0, 7).map((u, i) => (
//                       <div key={u.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: i < 6 ? `1px solid ${M3.outlineVar}` : 'none', transition: 'background 0.15s' }}
//                         onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
//                         onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                       >
//                         <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, background: avatarColor(u.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', boxShadow: `0 2px 8px ${avatarColor(u.username)}66` }}>
//                           {u.username?.charAt(0).toUpperCase()}
//                         </div>
//                         <p style={{ fontSize: 13, fontWeight: 600, color: M3.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.username}</p>
//                         <Chip role={u.role} />
//                       </div>
//                     ))}
//                 </div>

//                 {/* Activity log */}
//                 <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
//                   <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}>
//                     <p style={{ fontSize: 15, fontWeight: 700, color: M3.text }}>Activity Log</p>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${M3.green}18`, border: `1px solid ${M3.green}33`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}>
//                       <span style={{ width: 6, height: 6, background: M3.green, borderRadius: '50%' }} />LIVE
//                     </div>
//                   </div>
//                   <div style={{ overflowY: 'auto', maxHeight: 380 }}>
//                     {isLogsLoading ? <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}><Loader2 size={24} color={M3.primary} className="animate-spin" /></div>
//                       : activities.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, fontSize: 13, padding: 48 }}>No activity yet</p>
//                       : (
//                         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                           <thead>
//                             <tr style={{ background: M3.surfaceVar }}>
//                               {['User', 'Action', 'Performed By', 'Role', 'Time'].map((h, i) => (
//                                 <th key={h} style={{ padding: '11px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {activities.map((a, i) => (
//                               <tr key={a.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, transition: 'background 0.15s' }}
//                                 onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
//                                 onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                               >
//                                 <td style={{ padding: '12px 20px' }}>
//                                   <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                                     <div style={{ width: 28, height: 28, borderRadius: 14, background: avatarColor(a.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>
//                                       {a.username?.[0]?.toUpperCase() || 'U'}
//                                     </div>
//                                     <span style={{ fontSize: 13, fontWeight: 600, color: M3.text }}>{a.username}</span>
//                                   </div>
//                                 </td>
//                                 <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 600, color: a.action?.toLowerCase().includes('delete') ? M3.error : M3.textMed }}>{a.action}</td>
//                                 <td style={{ padding: '12px 20px', fontSize: 12, color: M3.textLow }}>{a.performedBy}</td>
//                                 <td style={{ padding: '12px 20px' }}><Chip role={a.role} /></td>
//                                 <td style={{ padding: '12px 20px', textAlign: 'right' }}>
//                                   <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
//                                     <span style={{ fontSize: 11, color: M3.textMed }}>{a.timestamp ? new Date(a.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
//                                     <span style={{ fontSize: 11, color: M3.textLow }}>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── USERS ── */}
//           {activeTab === 'users' && (
//             <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
//               <div style={{ padding: '22px 28px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <div>
//                   <h2 style={{ fontSize: 17, fontWeight: 800, color: M3.text }}>All Users</h2>
//                   <p style={{ fontSize: 12, color: M3.textLow, marginTop: 3 }}>{users.length} total · {admins.length} admins · {farmers.length} farmers · {buyers.length} buyers</p>
//                 </div>
//               </div>
//               {isLoading ? <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}><Loader2 size={28} color={M3.primary} className="animate-spin" /></div>
//                 : (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//                     <thead>
//                       <tr style={{ background: M3.surfaceVar }}>
//                         {['User', 'Role', 'Actions'].map((h, i) => (
//                           <th key={h} style={{ padding: '12px 24px', textAlign: i === 2 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {[{ label: 'Administrators', list: admins }, { label: 'Farmers', list: farmers }, { label: 'Buyers', list: buyers }].map(({ label, list }) => (
//                         <React.Fragment key={label}>
//                           <tr style={{ background: `${M3.outlineVar}88` }}>
//                             <td colSpan={3} style={{ padding: '9px 24px', fontSize: 11, fontWeight: 800, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
//                               {label} — {list.length}
//                             </td>
//                           </tr>
//                           {list.map((u, i) => (
//                             <tr key={u.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, transition: 'background 0.15s' }}
//                               onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
//                               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                             >
//                               <td style={{ padding: '15px 24px' }}>
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//                                   <div style={{ width: 38, height: 38, borderRadius: 19, flexShrink: 0, background: avatarColor(u.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', boxShadow: `0 2px 8px ${avatarColor(u.username)}55` }}>
//                                     {u.username?.charAt(0).toUpperCase()}
//                                   </div>
//                                   <div>
//                                     <p style={{ fontWeight: 700, color: M3.text, fontSize: 14 }}>{u.username}</p>
//                                     <p style={{ fontSize: 11, color: M3.textLow }}>{u.username}@directroot.com</p>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td style={{ padding: '15px 24px' }}><Chip role={u.role} /></td>
//                               <td style={{ padding: '15px 24px', textAlign: 'right' }}>
//                                 {u.role !== 'ADMIN' ? (
//                                   <button onClick={() => { if (confirm(`Delete ${u.username}?`)) deleteUser(u.id); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: `1px solid ${M3.error}44`, background: `${M3.errorCont}44`, color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
//                                     <Trash2 size={12} /> Delete
//                                   </button>
//                                 ) : u.username === user.username ? (
//                                   <button onClick={() => { if (confirm('Delete your account?')) { deleteUser(u.id); onLogout(); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: '1px solid #fb923c44', background: '#7c2d1244', color: '#fb923c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
//                                     <Trash2 size={12} /> Delete Mine
//                                   </button>
//                                 ) : (
//                                   <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: M3.textLow }}><ShieldCheck size={13} /> Protected</span>
//                                 )}
//                               </td>
//                             </tr>
//                           ))}
//                         </React.Fragment>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//             </div>
//           )}

//           {/* ── PRODUCTS ── */}
//           {activeTab === 'items' && (
//             <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
//               <div style={{ padding: '22px 28px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <div>
//                   <h2 style={{ fontSize: 17, fontWeight: 800, color: M3.text }}>Product Listings</h2>
//                   <p style={{ fontSize: 12, color: M3.textLow, marginTop: 3 }}>{products.length} products listed by farmers</p>
//                 </div>
//                 <button onClick={fetchProducts} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 20, border: `1px solid ${M3.outline}`, background: M3.surfaceVar, color: M3.textMed, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
//                   <RefreshCw size={14} className={isProductsLoading ? 'animate-spin' : ''} /> Refresh
//                 </button>
//               </div>
//               {isProductsLoading ? <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}><Loader2 size={28} color={M3.primary} className="animate-spin" /></div>
//                 : filteredProducts.length === 0 ? <div style={{ padding: 64, textAlign: 'center' }}><Wheat size={36} color={M3.textLow} style={{ margin: '0 auto 12px' }} /><p style={{ color: M3.textLow, fontSize: 14 }}>No products found</p></div>
//                 : (
//                   <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
//                     <thead>
//                       <tr style={{ background: M3.surfaceVar }}>
//                         {['Product', 'Category', 'Price', 'Stock', 'Farmer', 'Listed'].map((h, i) => (
//                           <th key={h} style={{ padding: '12px 24px', textAlign: i === 5 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredProducts.map((p, i) => (
//                         <tr key={p.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, transition: 'background 0.15s' }}
//                           onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
//                           onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
//                         >
//                           <td style={{ padding: '15px 24px' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                               <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: `${M3.green}18`, border: `1px solid ${M3.green}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: M3.green }}>
//                                 {p.name?.[0]?.toUpperCase() || 'P'}
//                               </div>
//                               <div>
//                                 <p style={{ fontWeight: 700, color: M3.text }}>{p.name}</p>
//                                 {p.description && <p style={{ fontSize: 11, color: M3.textLow, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>}
//                               </div>
//                             </div>
//                           </td>
//                           <td style={{ padding: '15px 24px' }}><Chip category={p.category || 'N/A'} /></td>
//                           <td style={{ padding: '15px 24px' }}><span style={{ fontSize: 15, fontWeight: 800, color: M3.green }}>${p.price != null ? Number(p.price).toFixed(2) : '—'}</span></td>
//                           <td style={{ padding: '15px 24px' }}>
//                             {p.quantity === 0
//                               ? <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: `${M3.errorCont}66`, color: M3.error, border: `1px solid ${M3.error}33` }}>Out of stock</span>
//                               : <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                                   <span style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{p.quantity}</span>
//                                   <div style={{ width: 60, height: 4, background: M3.outlineVar, borderRadius: 99, overflow: 'hidden' }}>
//                                     <div style={{ width: `${Math.min((p.quantity / 100) * 100, 100)}%`, height: '100%', background: M3.green, borderRadius: 99 }} />
//                                   </div>
//                                 </div>}
//                           </td>
//                           <td style={{ padding: '15px 24px' }}>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
//                               <div style={{ width: 28, height: 28, borderRadius: 14, background: avatarColor(p.farmerUsername), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>
//                                 {p.farmerUsername?.[0]?.toUpperCase() || 'F'}
//                               </div>
//                               <span style={{ fontSize: 12, fontWeight: 600, color: M3.textMed }}>{p.farmerUsername || 'Unknown'}</span>
//                             </div>
//                           </td>
//                           <td style={{ padding: '15px 24px', textAlign: 'right', fontSize: 12, color: M3.textLow }}>
//                             {p.createdAt ? new Date(p.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//             </div>
//           )}

//           {/* ── ANALYTICS ── */}
//           {activeTab === 'analytics' && (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//               {/* Row 1 — Donut + Summary */}
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

//                 {/* User Role Donut */}
//                 <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
//                   <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>User Role Breakdown</p>
//                   <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 24 }}>Distribution across all roles</p>
//                   {users.length === 0 ? (
//                     <p style={{ textAlign: 'center', color: M3.textLow, padding: 40 }}>No user data</p>
//                   ) : (
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
//                       <ResponsiveContainer width={200} height={200}>
//                         <PieChart>
//                           <Pie data={roleDonutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
//                             {roleDonutData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
//                           </Pie>
//                           <Tooltip content={<CustomTooltip />} />
//                         </PieChart>
//                       </ResponsiveContainer>
//                       <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//                         {roleDonutData.map((d, i) => (
//                           <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                             <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
//                             <div>
//                               <p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{d.value}</p>
//                               <p style={{ fontSize: 11, color: M3.textLow }}>{d.name}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Activity Summary */}
//                 <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
//                   <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Activity Summary</p>
//                   <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 24 }}>Registrations vs deletions</p>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//                     {activitySummaryData.map((item, i) => (
//                       <div key={i}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                           <span style={{ fontSize: 13, fontWeight: 600, color: M3.textMed }}>{item.name}</span>
//                           <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.value}</span>
//                         </div>
//                         <div style={{ height: 10, background: M3.outlineVar, borderRadius: 99, overflow: 'hidden' }}>
//                           <div style={{
//                             width: activities.length > 0 ? `${(item.value / activities.length) * 100}%` : '0%',
//                             height: '100%', background: item.color, borderRadius: 99,
//                             transition: 'width 0.6s ease',
//                           }} />
//                         </div>
//                         <p style={{ fontSize: 11, color: M3.textLow, marginTop: 4 }}>
//                           {activities.length > 0 ? `${Math.round((item.value / activities.length) * 100)}% of total activity` : 'No activity yet'}
//                         </p>
//                       </div>
//                     ))}
//                     <div style={{ marginTop: 8, padding: '14px 16px', borderRadius: 14, background: M3.outlineVar, border: `1px solid ${M3.outline}` }}>
//                       <p style={{ fontSize: 12, color: M3.textLow }}>Total Events</p>
//                       <p style={{ fontSize: 24, fontWeight: 800, color: M3.text }}>{activities.length}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Row 2 — Category Bar Chart */}
//               <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
//                 <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Products by Category</p>
//                 <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 24 }}>Number of products in each category</p>
//                 {categoryBarData.length === 0 ? (
//                   <p style={{ textAlign: 'center', color: M3.textLow, padding: 40 }}>No product data yet</p>
//                 ) : (
//                   <ResponsiveContainer width="100%" height={260}>
//                     <BarChart data={categoryBarData} barSize={40}>
//                       <XAxis dataKey="name" tick={{ fill: M3.textLow, fontSize: 12 }} axisLine={false} tickLine={false} />
//                       <YAxis tick={{ fill: M3.textLow, fontSize: 12 }} axisLine={false} tickLine={false} />
//                       <Tooltip content={<CustomTooltip />} cursor={{ fill: `${M3.primary}10` }} />
//                       <Bar dataKey="count" name="Products" fill={M3.primary} radius={[8, 8, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 )}
//               </div>

//               {/* Row 3 — Marketplace value */}
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
//                 {[
//                   {
//                     label: 'Total Marketplace Value',
//                     value: `$${products.reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0).toFixed(2)}`,
//                     sub: 'Sum of price × stock',
//                     color: M3.green,
//                   },
//                   {
//                     label: 'Avg Product Price',
//                     value: products.length > 0 ? `$${(products.reduce((s, p) => s + (p.price || 0), 0) / products.length).toFixed(2)}` : '$0.00',
//                     sub: 'Across all listings',
//                     color: M3.primary,
//                   },
//                   {
//                     label: 'Out of Stock',
//                     value: products.filter(p => p.quantity === 0).length,
//                     sub: 'Products with 0 quantity',
//                     color: M3.error,
//                   },
//                 ].map((card, i) => (
//                   <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
//                     <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 8 }}>{card.label}</p>
//                     <p style={{ fontSize: 28, fontWeight: 800, color: card.color, letterSpacing: '-0.5px' }}>{card.value}</p>
//                     <p style={{ fontSize: 11, color: M3.textLow, marginTop: 6 }}>{card.sub}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ── SETTINGS ── */}
//           {activeTab === 'settings' && (
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

//               {/* LEFT COLUMN */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//                 {/* Admin Profile Card */}
//                 <div style={{
//                   background: M3.surface, border: `1px solid ${M3.outline}`,
//                   borderRadius: 24, overflow: 'hidden', position: 'relative',
//                 }}>
//                   {/* Banner */}
//                   <div style={{
//                     height: 90,
//                     background: `linear-gradient(135deg, ${M3.primaryCont}cc, #4c1d9588, #1e1b4b)`,
//                     borderBottom: `1px solid ${M3.outline}`,
//                   }} />
//                   {/* Avatar */}
//                   <div style={{ padding: '0 24px 24px', position: 'relative' }}>
//                     <div style={{
//                       width: 76, height: 76, borderRadius: 22,
//                       background: `linear-gradient(135deg, ${M3.primaryCont}, #6d28d9)`,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       fontSize: 28, fontWeight: 900, color: M3.primary,
//                       border: `3px solid ${M3.surface}`,
//                       marginTop: -38, marginBottom: 12,
//                       boxShadow: `0 4px 20px #6d28d944`,
//                     }}>
//                       {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
//                     </div>
//                     <p style={{ fontSize: 20, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>{user?.username || 'Administrator'}</p>
//                     <p style={{ fontSize: 13, color: M3.textLow, marginTop: 2 }}>{user?.username}@directroot.com</p>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
//                       <Chip role="ADMIN" />
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                         <div style={{ width: 6, height: 6, background: M3.green, borderRadius: '50%', boxShadow: `0 0 6px ${M3.green}` }} />
//                         <span style={{ fontSize: 11, color: M3.green, fontWeight: 600 }}>Active</span>
//                       </div>
//                     </div>

//                     {/* Stats row */}
//                     <div style={{
//                       display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
//                       gap: 1, marginTop: 20,
//                       background: M3.outline, borderRadius: 16, overflow: 'hidden',
//                     }}>
//                       {[
//                         { label: 'Users', value: users.length },
//                         { label: 'Products', value: products.length },
//                         { label: 'Logs', value: activities.length },
//                       ].map((s, i) => (
//                         <div key={i} style={{ background: M3.surfaceVar, padding: '14px 0', textAlign: 'center' }}>
//                           <p style={{ fontSize: 20, fontWeight: 800, color: M3.primary }}>{s.value}</p>
//                           <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.label}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Change Password Card */}
//                 <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, overflow: 'hidden' }}>
//                   <div style={{ padding: '20px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}>
//                     <div style={{ width: 36, height: 36, borderRadius: 12, background: `${M3.primary}18`, border: `1px solid ${M3.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                       <Lock size={16} color={M3.primary} />
//                     </div>
//                     <div>
//                       <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Change Password</p>
//                       <p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Update your admin account password</p>
//                     </div>
//                   </div>
//                   <div style={{ padding: 24 }}>
//                     {pwError && (
//                       <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 12, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
//                         <AlertTriangle size={14} /> {pwError}
//                       </div>
//                     )}
//                     {pwSuccess && (
//                       <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
//                         <CheckCircle size={14} /> {pwSuccess}
//                       </div>
//                     )}
//                     <PwInput label="Current Password" field="current" placeholder="Enter current password"
//                       value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))}
//                       show={showPw.current} onToggleShow={() => setShowPw(s => ({ ...s, current: !s.current }))} />
//                     <PwInput label="New Password" field="newPw" placeholder="Min. 6 characters"
//                       value={pwForm.newPw} onChange={v => setPwForm(f => ({ ...f, newPw: v }))}
//                       show={showPw.newPw} onToggleShow={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))} />
//                     <PwInput label="Confirm New Password" field="confirm" placeholder="Re-enter new password"
//                       value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
//                       show={showPw.confirm} onToggleShow={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))} />
//                     <button
//                       onClick={handleChangePassword}
//                       disabled={isPwLoading}
//                       style={{
//                         marginTop: 4, width: '100%', padding: '13px', borderRadius: 14,
//                         background: isPwLoading ? M3.outlineVar : M3.primaryCont,
//                         border: `1px solid ${M3.primary}44`,
//                         color: M3.primary, fontSize: 14, fontWeight: 700,
//                         cursor: isPwLoading ? 'not-allowed' : 'pointer',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//                         transition: 'all 0.2s',
//                       }}
//                     >
//                       {isPwLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
//                       {isPwLoading ? 'Updating...' : 'Update Password'}
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT COLUMN — Danger Zone */}
//               <div style={{
//                 background: M3.surface,
//                 border: `1px solid ${M3.error}55`,
//                 borderRadius: 24, overflow: 'hidden',
//               }}>
//                 {/* Header */}
//                 <div style={{
//                   padding: '20px 24px',
//                   borderBottom: `1px solid ${M3.error}22`,
//                   background: `linear-gradient(135deg, ${M3.errorCont}44, ${M3.errorCont}11)`,
//                   display: 'flex', alignItems: 'center', gap: 12,
//                 }}>
//                   <div style={{ width: 36, height: 36, borderRadius: 12, background: `${M3.error}18`, border: `1px solid ${M3.error}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <AlertTriangle size={16} color={M3.error} />
//                   </div>
//                   <div>
//                     <p style={{ fontSize: 15, fontWeight: 700, color: M3.error }}>Danger Zone</p>
//                     <p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Irreversible actions — proceed with extreme caution</p>
//                   </div>
//                 </div>

//                 <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

//                   {/* Success message */}
//                   {clearLogsSuccess && (
//                     <div style={{ padding: '11px 14px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
//                       <CheckCircle size={14} /> {clearLogsSuccess}
//                     </div>
//                   )}

//                   {/* Clear logs */}
//                   <div style={{ borderRadius: 16, border: `1px solid ${M3.outline}`, overflow: 'hidden' }}>
//                     <div style={{ padding: '16px 18px', background: M3.outlineVar }}>
//                       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
//                         <div>
//                           <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Clear Activity Logs</p>
//                           <p style={{ fontSize: 12, color: M3.textLow, marginTop: 4, lineHeight: 1.5 }}>
//                             Permanently delete all <strong style={{ color: M3.textMed }}>{activities.length}</strong> activity log entries from the system. This cannot be undone.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div style={{ padding: '12px 18px', borderTop: `1px solid ${M3.outline}`, display: 'flex', justifyContent: 'flex-end' }}>
//                       <button
//                         onClick={handleClearLogs}
//                         disabled={clearLogsLoading || activities.length === 0}
//                         style={{
//                           display: 'inline-flex', alignItems: 'center', gap: 7,
//                           padding: '9px 16px', borderRadius: 12,
//                           border: `1px solid ${M3.error}55`, background: `${M3.errorCont}55`,
//                           color: M3.error, fontSize: 12, fontWeight: 700,
//                           cursor: clearLogsLoading || activities.length === 0 ? 'not-allowed' : 'pointer',
//                           opacity: activities.length === 0 ? 0.4 : 1,
//                         }}
//                       >
//                         {clearLogsLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
//                         {clearLogsLoading ? 'Clearing...' : 'Clear Logs'}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Delete own account */}
//                   <div style={{ borderRadius: 16, border: `1px solid ${M3.error}44`, overflow: 'hidden' }}>
//                     <div style={{ padding: '16px 18px', background: `${M3.errorCont}22` }}>
//                       <p style={{ fontSize: 14, fontWeight: 700, color: M3.error }}>Delete My Account</p>
//                       <p style={{ fontSize: 12, color: M3.textLow, marginTop: 4, lineHeight: 1.5 }}>
//                         Permanently delete your admin account <strong style={{ color: M3.textMed }}>({user?.username})</strong>. You will be immediately signed out and cannot recover this account.
//                       </p>
//                       <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: `${M3.error}11`, border: `1px solid ${M3.error}22` }}>
//                         <p style={{ fontSize: 11, color: M3.error, fontWeight: 600 }}>
//                           ⚠ Make sure another admin account exists before deleting yours.
//                         </p>
//                       </div>
//                     </div>
//                     <div style={{ padding: '12px 18px', borderTop: `1px solid ${M3.error}22`, display: 'flex', justifyContent: 'flex-end' }}>
//                       <button
//                         onClick={() => {
//                           if (confirm(`Delete your account "${user?.username}"? This is permanent and you will be signed out immediately.`)) {
//                             deleteUser(users.find(u => u.username === user?.username)?.id);
//                             onLogout();
//                           }
//                         }}
//                         style={{
//                           display: 'inline-flex', alignItems: 'center', gap: 7,
//                           padding: '9px 16px', borderRadius: 12,
//                           border: `1px solid ${M3.error}77`, background: `${M3.errorCont}88`,
//                           color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer',
//                         }}
//                       >
//                         <Trash2 size={13} /> Delete My Account
//                       </button>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import {
  Sprout, LayoutDashboard, Users, LogOut, Search,
  Activity, Loader2, AlertCircle, BarChart3, Clock,
  Wheat, TrendingUp, ShieldCheck, Trash2, RefreshCw,
  Bell, Settings, ArrowUpRight, Package, ChevronRight,
  User, Lock, AlertTriangle, CheckCircle, Eye, EyeOff,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const API_BASE_URL = "http://localhost:8080/api/v1";

const M3 = {
  bg:          '#0f1117',
  surface:     '#1a1d27',
  surfaceVar:  '#1f2230',
  outline:     '#2e3150',
  outlineVar:  '#252840',
  primary:     '#c3c6ff',
  primaryCont: '#4a4fa8',
  onPrimary:   '#0e1178',
  secondary:   '#c6c5de',
  tertiary:    '#e6b9d8',
  error:       '#ffb4ab',
  errorCont:   '#930006',
  green:       '#6ddc91',
  greenCont:   '#003917',
  yellow:      '#f5c518',
  text:        '#f0f0ff',
  textMed:     '#c4c4e0',
  textLow:     '#8e8eaa',
};

const chip = (role) => {
  if (role === 'ADMIN')  return { bg: '#3730a3', color: '#c7d2fe', border: '#4338ca' };
  if (role === 'FARMER') return { bg: '#064e3b', color: '#6ee7b7', border: '#065f46' };
  if (role === 'BUYER')  return { bg: '#0c4a6e', color: '#7dd3fc', border: '#075985' };
  return { bg: '#2e3150', color: M3.textMed, border: M3.outline };
};

const catChip = (cat) => {
  const map = {
    vegetables: { bg: '#14532d', color: '#86efac' },
    fruits:     { bg: '#7c2d12', color: '#fdba74' },
    grains:     { bg: '#713f12', color: '#fde047' },
    dairy:      { bg: '#1e3a5f', color: '#93c5fd' },
    meat:       { bg: '#7f1d1d', color: '#fca5a5' },
  };
  return map[cat?.toLowerCase()] || { bg: '#2e3150', color: M3.textMed };
};

const Chip = ({ role, category }) => {
  const c = role ? chip(role) : catChip(category);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 999,
      background: c.bg, color: c.color,
      border: `1px solid ${c.border || c.bg}`,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
    }}>
      {role || category || '—'}
    </span>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, accent, index }) => (
  <div style={{
    background: M3.surface, border: `1px solid ${M3.outline}`,
    borderRadius: 20, padding: '22px 24px',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, borderRadius: '20px 20px 0 0' }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: `${accent}22`, border: `1px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={accent} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#163420', border: '1px solid #1a4a2a', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}>
        <ArrowUpRight size={11} />+{Math.floor(Math.random() * 12 + 4)}%
      </div>
    </div>
    <p style={{ fontSize: 34, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</p>
    <p style={{ fontSize: 13, fontWeight: 600, color: M3.textMed, marginTop: 6 }}>{label}</p>
    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 3 }}>{sub}</p>
  </div>
);

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 12, padding: '10px 14px' }}>
      {label && <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 4 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

// ── Defined OUTSIDE component to prevent re-render focus loss ──
const PwInput = ({ label, field, placeholder, value, onChange, show, onToggleShow }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: M3.textMed, marginBottom: 8 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '12px 44px 12px 16px', borderRadius: 12,
          background: M3.surfaceVar, border: `1px solid ${M3.outline}`,
          color: M3.text, fontSize: 14, outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = M3.primary}
        onBlur={e => e.target.style.borderColor = M3.outline}
      />
      <button
        type="button"
        onClick={onToggleShow}
        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab]           = useState('overview');
  const [searchQuery, setSearchQuery]       = useState('');
  const [users, setUsers]                   = useState([]);
  const [activities, setActivities]         = useState([]);
  const [products, setProducts]             = useState([]);
  const [isLoading, setIsLoading]           = useState(false);
  const [isLogsLoading, setIsLogsLoading]   = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [fetchError, setFetchError]         = useState(null);

  // Settings state
  const [pwForm, setPwForm]                 = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw]                 = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError]               = useState(null);
  const [pwSuccess, setPwSuccess]           = useState(null);
  const [isPwLoading, setIsPwLoading]       = useState(false);
  const [clearLogsLoading, setClearLogsLoading] = useState(false);
  const [clearLogsSuccess, setClearLogsSuccess] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [seenNotifications, setSeenNotifications] = useState(false);

  // Mark as seen when panel is opened, clear after 5 seconds
  useEffect(() => {
    if (!showNotifications) return;
    const timer = setTimeout(() => {
      setSeenNotifications(true);  // mark as seen after 5s of viewing
      setShowNotifications(false); // close the panel
    }, 5000);
    return () => clearTimeout(timer);
  }, [showNotifications]);

  // Reset seen state when new activities or low stock appear
  useEffect(() => {
    setSeenNotifications(false);
  }, [activities.length, products.length]);

  const fetchActivities = async () => {
    setIsLogsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/activity`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      });
      const result = await res.json();
      setActivities(result.data || (Array.isArray(result) ? result : []));
    } catch { setActivities([]); }
    finally { setIsLogsLoading(false); }
  };

  const fetchUsers = async () => {
    if (!user?.token) return;
    setIsLoading(true); setFetchError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/admin`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const result = await res.json();
      setUsers(result.data || []);
    } catch (e) { setFetchError(e.message); setUsers([]); }
    finally { setIsLoading(false); }
  };

  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      });
      const result = await res.json();
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch { setProducts([]); }
    finally { setIsProductsLoading(false); }
  };

  useEffect(() => { fetchUsers(); fetchActivities(); fetchProducts(); }, []);
  useEffect(() => { if (activeTab === 'items') fetchProducts(); }, [activeTab]);

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (e) { console.error(e); }
    finally { await fetchUsers(); await fetchActivities(); }
  };

  const handleChangePassword = async () => {
    setPwError(null); setPwSuccess(null);
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwError('All fields are required.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    if (pwForm.newPw.length < 6) { setPwError('New password must be at least 6 characters.'); return; }
    if (pwForm.current === pwForm.newPw) { setPwError('New password must be different from current password.'); return; }
    setIsPwLoading(true);
    try {
      // Step 1 — verify current password by authenticating
      const authRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user?.username, password: pwForm.current }),
      });
      if (!authRes.ok) throw new Error('Current password is incorrect.');

      // Step 2 — delete old account and re-register with new password
      const adminUser = users.find(u => u.username === user?.username);
      if (!adminUser) throw new Error('Could not find your account.');

      // Delete current account
      await fetch(`${API_BASE_URL}/admin/users/${adminUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      // Re-register with new password
      const registerRes = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user?.username, password: pwForm.newPw, role: 'ADMIN' }),
      });
      if (!registerRes.ok) throw new Error('Failed to update password. Please contact support.');

      setPwSuccess('Password updated! Please sign in again.');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => onLogout(), 2000);
    } catch (e) { setPwError(e.message); }
    finally { setIsPwLoading(false); }
  };

  const handleClearLogs = async () => {
    if (!confirm('Clear all activity logs? This cannot be undone.')) return;
    setClearLogsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/activity/clear`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` },
      });
      setClearLogsSuccess('All logs cleared successfully.');
      await fetchActivities();
    } catch { setClearLogsSuccess('Logs cleared.'); setActivities([]); }
    finally { setClearLogsLoading(false); }
  };

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmerUsername?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins  = filteredUsers.filter(u => u.role === 'ADMIN');
  const farmers = filteredUsers.filter(u => u.role === 'FARMER');
  const buyers  = filteredUsers.filter(u => u.role === 'BUYER');

  const avatarColor = (name) => `hsl(${(name?.charCodeAt(0) || 65) * 7 % 360}, 55%, 38%)`;

  // ── Analytics data ──
  const roleDonutData = [
    { name: 'Admins',  value: users.filter(u => u.role === 'ADMIN').length,  color: '#c7d2fe' },
    { name: 'Farmers', value: users.filter(u => u.role === 'FARMER').length, color: '#6ee7b7' },
    { name: 'Buyers',  value: users.filter(u => u.role === 'BUYER').length,  color: '#7dd3fc' },
  ].filter(d => d.value > 0);

  const catCounts = products.reduce((acc, p) => {
    const cat = p.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryBarData = Object.entries(catCounts).map(([name, count]) => ({ name, count }));

  const registrations = activities.filter(a => a.action?.toLowerCase().includes('register')).length;
  const deletions     = activities.filter(a => a.action?.toLowerCase().includes('delete')).length;
  const activitySummaryData = [
    { name: 'Registrations', value: registrations, color: M3.green },
    { name: 'Deletions',     value: deletions,     color: M3.error },
  ];

  const stats = [
    { label: 'Total Users',    value: users.length,      sub: `${admins.length} admins · ${farmers.length} farmers · ${buyers.length} buyers`, icon: Users,      accent: M3.primary },
    { label: 'Products',       value: products.length,   sub: 'Active marketplace listings',  icon: Package,    accent: M3.green },
    { label: 'Activity Logs',  value: activities.length, sub: 'System events recorded',       icon: Activity,   accent: M3.tertiary },
    { label: 'Active Farmers', value: farmers.length,    sub: 'Registered on platform',        icon: TrendingUp, accent: M3.yellow },
  ];

  const nav = [
    { tab: 'overview',   icon: LayoutDashboard, label: 'Overview' },
    { tab: 'users',      icon: Users,           label: 'Users' },
    { tab: 'items',      icon: Wheat,           label: 'Products' },
    { tab: 'analytics',  icon: BarChart3,       label: 'Analytics' },
    { tab: 'settings',   icon: Settings,        label: 'Settings' },
  ];



  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: M3.bg, fontFamily: "'Google Sans', 'Roboto', system-ui, sans-serif", color: M3.text }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 256, background: M3.surface, borderRight: `1px solid ${M3.outline}`, display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 20 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${M3.outlineVar}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${M3.primaryCont}, #6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${M3.primary}44, 0 4px 12px #6366f144` }}>
              <Sprout size={20} color={M3.primary} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>DirectRoot</p>
              <p style={{ fontSize: 11, color: M3.primary, fontWeight: 600, marginTop: 1 }}>Admin Console</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', marginBottom: 6 }}>Main Menu</p>
          {nav.map(({ tab, icon: Icon, label }) => {
            const active = activeTab === tab;
            return (
              <button key={label} onClick={() => setActiveTab(tab)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: active ? `${M3.primary}18` : 'transparent',
                color: active ? M3.primary : M3.textMed,
                fontSize: 14, fontWeight: active ? 700 : 500,
                transition: 'all 0.15s ease', textAlign: 'left', position: 'relative',
                borderLeft: active ? `2px solid ${M3.primary}` : '2px solid transparent',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = M3.outlineVar; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} />
                <span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: `1px solid ${M3.outlineVar}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: M3.outlineVar, marginBottom: 8, border: `1px solid ${M3.outline}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${M3.primaryCont}, #7c3aed)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: M3.primary }}>
              {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Admin'}</p>
              <p style={{ fontSize: 11, color: M3.textLow }}>Administrator</p>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'transparent', color: M3.error, fontSize: 13, fontWeight: 600, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = `${M3.errorCont}66`}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, marginLeft: 256, display: 'flex', flexDirection: 'column' }}>

        {/* Topbar */}
        <header style={{ background: `${M3.surface}e8`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${M3.outline}`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>
            {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'users' ? 'User Management' : activeTab === 'items' ? 'Product Listings' : activeTab === 'analytics' ? 'Analytics' : 'Settings'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, borderRadius: 28, padding: '9px 16px', width: 240 }}>
              <Search size={15} color={M3.textLow} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', color: M3.text, fontSize: 13, flex: 1 }} />
            </div>
            <button onClick={() => { fetchUsers(); fetchActivities(); fetchProducts(); }} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}>
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(s => !s)}
                style={{ width: 40, height: 40, borderRadius: 20, background: showNotifications ? `${M3.primary}18` : M3.surfaceVar, border: `1px solid ${showNotifications ? M3.primary : M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: showNotifications ? M3.primary : M3.textMed, position: 'relative', transition: 'all 0.15s' }}
              >
                <Bell size={16} />
                {!seenNotifications && (activities.length > 0 || products.some(p => p.quantity < 5)) && (
                  <span style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, background: M3.error, borderRadius: '50%', border: `2px solid ${M3.surface}` }} />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <div onClick={() => setShowNotifications(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />

                  {/* Panel */}
                  <div style={{
                    position: 'absolute', top: 48, right: 0, width: 360,
                    background: M3.surface, border: `1px solid ${M3.outline}`,
                    borderRadius: 20, zIndex: 50, overflow: 'hidden',
                    boxShadow: `0 8px 32px #00000066, 0 0 0 1px ${M3.outline}`,
                  }}>
                    {/* Panel header */}
                    <div style={{ padding: '16px 20px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Bell size={15} color={M3.primary} />
                        <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Notifications</p>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${M3.error}22`, color: M3.error, border: `1px solid ${M3.error}33` }}>
                        {activities.slice(0, 5).length + products.filter(p => p.quantity > 0 && p.quantity < 5).length} new
                      </span>
                    </div>

                    <div style={{ maxHeight: 440, overflowY: 'auto' }}>

                      {/* ── Recent Activity ── */}
                      <div style={{ padding: '12px 20px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                          <Activity size={12} color={M3.primary} />
                          <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Activity</p>
                        </div>
                        {activities.length === 0 ? (
                          <p style={{ fontSize: 12, color: M3.textLow, padding: '8px 0 12px' }}>No recent activity</p>
                        ) : activities.slice(0, 5).map((a, i) => {
                          const isDelete = a.action?.toLowerCase().includes('delete');
                          const isRegister = a.action?.toLowerCase().includes('register');
                          const iconColor = isDelete ? M3.error : isRegister ? M3.green : M3.primary;
                          const timeAgo = a.timestamp ? (() => {
                            const diff = Date.now() - new Date(a.timestamp).getTime();
                            const mins = Math.floor(diff / 60000);
                            const hrs = Math.floor(mins / 60);
                            if (mins < 1) return 'just now';
                            if (mins < 60) return `${mins}m ago`;
                            if (hrs < 24) return `${hrs}h ago`;
                            return new Date(a.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' });
                          })() : '';

                          return (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 4 ? `1px solid ${M3.outlineVar}` : 'none' }}>
                              <div style={{ width: 30, height: 30, borderRadius: 10, background: `${iconColor}18`, border: `1px solid ${iconColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                <Activity size={13} color={iconColor} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: M3.text }}>
                                  <span style={{ color: iconColor }}>{a.username}</span> — {a.action}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                  <Chip role={a.role} />
                                  <span style={{ fontSize: 10, color: M3.textLow }}>{timeAgo}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* ── Low Stock Alerts ── */}
                      {products.some(p => p.quantity > 0 && p.quantity < 5) && (
                        <div style={{ padding: '12px 20px', borderTop: `1px solid ${M3.outlineVar}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <AlertTriangle size={12} color={M3.yellow} />
                            <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Low Stock Alerts</p>
                          </div>
                          {products.filter(p => p.quantity > 0 && p.quantity < 5).map((p, i, arr) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${M3.outlineVar}` : 'none' }}>
                              <div style={{ width: 30, height: 30, borderRadius: 10, background: `${M3.yellow}18`, border: `1px solid ${M3.yellow}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: M3.yellow }}>
                                {p.name?.[0]?.toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                <p style={{ fontSize: 11, color: M3.yellow, marginTop: 2, fontWeight: 600 }}>Only {p.quantity} left — low stock</p>
                              </div>
                              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${M3.yellow}18`, border: `1px solid ${M3.yellow}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 800, color: M3.yellow }}>{p.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Out of stock */}
                      {products.some(p => p.quantity === 0) && (
                        <div style={{ padding: '12px 20px', borderTop: `1px solid ${M3.outlineVar}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <AlertCircle size={12} color={M3.error} />
                            <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Out of Stock</p>
                          </div>
                          {products.filter(p => p.quantity === 0).map((p, i, arr) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${M3.outlineVar}` : 'none' }}>
                              <div style={{ width: 30, height: 30, borderRadius: 10, background: `${M3.error}18`, border: `1px solid ${M3.error}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: M3.error }}>
                                {p.name?.[0]?.toUpperCase()}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                <p style={{ fontSize: 11, color: M3.error, marginTop: 2, fontWeight: 600 }}>Out of stock — needs restocking</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Empty state */}
                      {activities.length === 0 && !products.some(p => p.quantity < 5) && (
                        <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                          <Bell size={28} color={M3.textLow} style={{ margin: '0 auto 10px' }} />
                          <p style={{ fontSize: 13, color: M3.textLow }}>All caught up!</p>
                          <p style={{ fontSize: 11, color: M3.textLow, marginTop: 4 }}>No new notifications</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '12px 20px', borderTop: `1px solid ${M3.outlineVar}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => { setActiveTab('overview'); setShowNotifications(false); }}
                        style={{ fontSize: 12, fontWeight: 600, color: M3.primary, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View all activity →
                      </button>
                      <button
                        onClick={() => setShowNotifications(false)}
                        style={{ fontSize: 12, fontWeight: 600, color: M3.textLow, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div style={{ padding: '32px', flex: 1 }}>
          {fetchError && (
            <div style={{ marginBottom: 24, padding: '14px 18px', borderRadius: 16, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>
              <AlertCircle size={16} /> {fetchError}
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
                {stats.map((s, i) => <StatCard key={i} {...s} index={i} />)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 18 }}>
                {/* Recent Users */}
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: M3.text }}>Recent Users</p>
                    <button onClick={() => setActiveTab('users')} style={{ fontSize: 12, fontWeight: 600, color: M3.primary, background: `${M3.primary}18`, border: `1px solid ${M3.primary}30`, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' }}>View all</button>
                  </div>
                  {isLoading ? <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}><Loader2 size={24} color={M3.primary} className="animate-spin" /></div>
                    : users.slice(0, 7).map((u, i) => (
                      <div key={u.id ?? i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: i < 6 ? `1px solid ${M3.outlineVar}` : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, background: avatarColor(u.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', boxShadow: `0 2px 8px ${avatarColor(u.username)}66` }}>
                          {u.username?.charAt(0).toUpperCase()}
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: M3.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.username}</p>
                        <Chip role={u.role} />
                      </div>
                    ))}
                </div>

                {/* Activity log */}
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: M3.text }}>Activity Log</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${M3.green}18`, border: `1px solid ${M3.green}33`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}>
                      <span style={{ width: 6, height: 6, background: M3.green, borderRadius: '50%' }} />LIVE
                    </div>
                  </div>
                  <div style={{ overflowY: 'auto', maxHeight: 380 }}>
                    {isLogsLoading ? <div style={{ padding: 48, display: 'flex', justifyContent: 'center' }}><Loader2 size={24} color={M3.primary} className="animate-spin" /></div>
                      : activities.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, fontSize: 13, padding: 48 }}>No activity yet</p>
                      : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ background: M3.surfaceVar }}>
                              {['User', 'Action', 'Performed By', 'Role', 'Time'].map((h, i) => (
                                <th key={h} style={{ padding: '11px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {activities.map((a, i) => (
                              <tr key={a.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <td style={{ padding: '12px 20px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 14, background: avatarColor(a.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>
                                      {a.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: M3.text }}>{a.username}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '12px 20px', fontSize: 12, fontWeight: 600, color: a.action?.toLowerCase().includes('delete') ? M3.error : M3.textMed }}>{a.action}</td>
                                <td style={{ padding: '12px 20px', fontSize: 12, color: M3.textLow }}>{a.performedBy}</td>
                                <td style={{ padding: '12px 20px' }}><Chip role={a.role} /></td>
                                <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                    <span style={{ fontSize: 11, color: M3.textMed }}>{a.timestamp ? new Date(a.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                                    <span style={{ fontSize: 11, color: M3.textLow }}>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '22px 28px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: M3.text }}>All Users</h2>
                  <p style={{ fontSize: 12, color: M3.textLow, marginTop: 3 }}>{users.length} total · {admins.length} admins · {farmers.length} farmers · {buyers.length} buyers</p>
                </div>
              </div>
              {isLoading ? <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}><Loader2 size={28} color={M3.primary} className="animate-spin" /></div>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: M3.surfaceVar }}>
                        {['User', 'Role', 'Actions'].map((h, i) => (
                          <th key={h} style={{ padding: '12px 24px', textAlign: i === 2 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[{ label: 'Administrators', list: admins }, { label: 'Farmers', list: farmers }, { label: 'Buyers', list: buyers }].map(({ label, list }) => (
                        <React.Fragment key={label}>
                          <tr style={{ background: `${M3.outlineVar}88` }}>
                            <td colSpan={3} style={{ padding: '9px 24px', fontSize: 11, fontWeight: 800, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              {label} — {list.length}
                            </td>
                          </tr>
                          {list.map((u, i) => (
                            <tr key={u.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '15px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <div style={{ width: 38, height: 38, borderRadius: 19, flexShrink: 0, background: avatarColor(u.username), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white', boxShadow: `0 2px 8px ${avatarColor(u.username)}55` }}>
                                    {u.username?.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p style={{ fontWeight: 700, color: M3.text, fontSize: 14 }}>{u.username}</p>
                                    <p style={{ fontSize: 11, color: M3.textLow }}>{u.username}@directroot.com</p>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '15px 24px' }}><Chip role={u.role} /></td>
                              <td style={{ padding: '15px 24px', textAlign: 'right' }}>
                                {u.role !== 'ADMIN' ? (
                                  <button onClick={() => { if (confirm(`Delete ${u.username}?`)) deleteUser(u.id); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: `1px solid ${M3.error}44`, background: `${M3.errorCont}44`, color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                    <Trash2 size={12} /> Delete
                                  </button>
                                ) : u.username === user.username ? (
                                  <button onClick={() => { if (confirm('Delete your account?')) { deleteUser(u.id); onLogout(); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: '1px solid #fb923c44', background: '#7c2d1244', color: '#fb923c', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                                    <Trash2 size={12} /> Delete Mine
                                  </button>
                                ) : (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: M3.textLow }}><ShieldCheck size={13} /> Protected</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === 'items' && (
            <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ padding: '22px 28px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: M3.text }}>Product Listings</h2>
                  <p style={{ fontSize: 12, color: M3.textLow, marginTop: 3 }}>{products.length} products listed by farmers</p>
                </div>
                <button onClick={fetchProducts} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 20, border: `1px solid ${M3.outline}`, background: M3.surfaceVar, color: M3.textMed, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <RefreshCw size={14} className={isProductsLoading ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>
              {isProductsLoading ? <div style={{ padding: 64, display: 'flex', justifyContent: 'center' }}><Loader2 size={28} color={M3.primary} className="animate-spin" /></div>
                : filteredProducts.length === 0 ? <div style={{ padding: 64, textAlign: 'center' }}><Wheat size={36} color={M3.textLow} style={{ margin: '0 auto 12px' }} /><p style={{ color: M3.textLow, fontSize: 14 }}>No products found</p></div>
                : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: M3.surfaceVar }}>
                        {['Product', 'Category', 'Price', 'Stock', 'Farmer', 'Listed'].map((h, i) => (
                          <th key={h} style={{ padding: '12px 24px', textAlign: i === 5 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p, i) => (
                        <tr key={p.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = M3.outlineVar}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '15px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: `${M3.green}18`, border: `1px solid ${M3.green}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: M3.green }}>
                                {p.name?.[0]?.toUpperCase() || 'P'}
                              </div>
                              <div>
                                <p style={{ fontWeight: 700, color: M3.text }}>{p.name}</p>
                                {p.description && <p style={{ fontSize: 11, color: M3.textLow, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '15px 24px' }}><Chip category={p.category || 'N/A'} /></td>
                          <td style={{ padding: '15px 24px' }}><span style={{ fontSize: 15, fontWeight: 800, color: M3.green }}>${p.price != null ? Number(p.price).toFixed(2) : '—'}</span></td>
                          <td style={{ padding: '15px 24px' }}>
                            {p.quantity === 0
                              ? <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: `${M3.errorCont}66`, color: M3.error, border: `1px solid ${M3.error}33` }}>Out of stock</span>
                              : <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{p.quantity}</span>
                                  <div style={{ width: 60, height: 4, background: M3.outlineVar, borderRadius: 99, overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min((p.quantity / 100) * 100, 100)}%`, height: '100%', background: M3.green, borderRadius: 99 }} />
                                  </div>
                                </div>}
                          </td>
                          <td style={{ padding: '15px 24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                              <div style={{ width: 28, height: 28, borderRadius: 14, background: avatarColor(p.farmerUsername), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>
                                {p.farmerUsername?.[0]?.toUpperCase() || 'F'}
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 600, color: M3.textMed }}>{p.farmerUsername || 'Unknown'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '15px 24px', textAlign: 'right', fontSize: 12, color: M3.textLow }}>
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Row 1 — Donut + Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* User Role Donut */}
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>User Role Breakdown</p>
                  <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 24 }}>Distribution across all roles</p>
                  {users.length === 0 ? (
                    <p style={{ textAlign: 'center', color: M3.textLow, padding: 40 }}>No user data</p>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                      <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                          <Pie data={roleDonutData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                            {roleDonutData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {roleDonutData.map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{d.value}</p>
                              <p style={{ fontSize: 11, color: M3.textLow }}>{d.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity Summary */}
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Activity Summary</p>
                  <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 24 }}>Registrations vs deletions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {activitySummaryData.map((item, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: M3.textMed }}>{item.name}</span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: item.color }}>{item.value}</span>
                        </div>
                        <div style={{ height: 10, background: M3.outlineVar, borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{
                            width: activities.length > 0 ? `${(item.value / activities.length) * 100}%` : '0%',
                            height: '100%', background: item.color, borderRadius: 99,
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                        <p style={{ fontSize: 11, color: M3.textLow, marginTop: 4 }}>
                          {activities.length > 0 ? `${Math.round((item.value / activities.length) * 100)}% of total activity` : 'No activity yet'}
                        </p>
                      </div>
                    ))}
                    <div style={{ marginTop: 8, padding: '14px 16px', borderRadius: 14, background: M3.outlineVar, border: `1px solid ${M3.outline}` }}>
                      <p style={{ fontSize: 12, color: M3.textLow }}>Total Events</p>
                      <p style={{ fontSize: 24, fontWeight: 800, color: M3.text }}>{activities.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2 — Category Bar Chart */}
              <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Products by Category</p>
                <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 24 }}>Number of products in each category</p>
                {categoryBarData.length === 0 ? (
                  <p style={{ textAlign: 'center', color: M3.textLow, padding: 40 }}>No product data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={categoryBarData} barSize={40}>
                      <XAxis dataKey="name" tick={{ fill: M3.textLow, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: M3.textLow, fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: `${M3.primary}10` }} />
                      <Bar dataKey="count" name="Products" fill={M3.primary} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Row 3 — Marketplace value */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                  {
                    label: 'Total Marketplace Value',
                    value: `$${products.reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0).toFixed(2)}`,
                    sub: 'Sum of price × stock',
                    color: M3.green,
                  },
                  {
                    label: 'Avg Product Price',
                    value: products.length > 0 ? `$${(products.reduce((s, p) => s + (p.price || 0), 0) / products.length).toFixed(2)}` : '$0.00',
                    sub: 'Across all listings',
                    color: M3.primary,
                  },
                  {
                    label: 'Out of Stock',
                    value: products.filter(p => p.quantity === 0).length,
                    sub: 'Products with 0 quantity',
                    color: M3.error,
                  },
                ].map((card, i) => (
                  <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                    <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 8 }}>{card.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: card.color, letterSpacing: '-0.5px' }}>{card.value}</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 6 }}>{card.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

              {/* LEFT COLUMN */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Admin Profile Card */}
                <div style={{
                  background: M3.surface, border: `1px solid ${M3.outline}`,
                  borderRadius: 24, overflow: 'hidden', position: 'relative',
                }}>
                  {/* Banner */}
                  <div style={{
                    height: 90,
                    background: `linear-gradient(135deg, ${M3.primaryCont}cc, #4c1d9588, #1e1b4b)`,
                    borderBottom: `1px solid ${M3.outline}`,
                  }} />
                  {/* Avatar */}
                  <div style={{ padding: '0 24px 24px', position: 'relative' }}>
                    <div style={{
                      width: 76, height: 76, borderRadius: 22,
                      background: `linear-gradient(135deg, ${M3.primaryCont}, #6d28d9)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 28, fontWeight: 900, color: M3.primary,
                      border: `3px solid ${M3.surface}`,
                      marginTop: -38, marginBottom: 12,
                      boxShadow: `0 4px 20px #6d28d944`,
                    }}>
                      {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <p style={{ fontSize: 20, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>{user?.username || 'Administrator'}</p>
                    <p style={{ fontSize: 13, color: M3.textLow, marginTop: 2 }}>{user?.username}@directroot.com</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                      <Chip role="ADMIN" />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 6, height: 6, background: M3.green, borderRadius: '50%', boxShadow: `0 0 6px ${M3.green}` }} />
                        <span style={{ fontSize: 11, color: M3.green, fontWeight: 600 }}>Active</span>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                      gap: 1, marginTop: 20,
                      background: M3.outline, borderRadius: 16, overflow: 'hidden',
                    }}>
                      {[
                        { label: 'Users', value: users.length },
                        { label: 'Products', value: products.length },
                        { label: 'Logs', value: activities.length },
                      ].map((s, i) => (
                        <div key={i} style={{ background: M3.surfaceVar, padding: '14px 0', textAlign: 'center' }}>
                          <p style={{ fontSize: 20, fontWeight: 800, color: M3.primary }}>{s.value}</p>
                          <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Change Password Card */}
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: `${M3.primary}18`, border: `1px solid ${M3.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={16} color={M3.primary} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Change Password</p>
                      <p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Update your admin account password</p>
                    </div>
                  </div>
                  <div style={{ padding: 24 }}>
                    {pwError && (
                      <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 12, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                        <AlertTriangle size={14} /> {pwError}
                      </div>
                    )}
                    {pwSuccess && (
                      <div style={{ marginBottom: 16, padding: '11px 14px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                        <CheckCircle size={14} /> {pwSuccess}
                      </div>
                    )}
                    <PwInput label="Current Password" field="current" placeholder="Enter current password"
                      value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))}
                      show={showPw.current} onToggleShow={() => setShowPw(s => ({ ...s, current: !s.current }))} />
                    <PwInput label="New Password" field="newPw" placeholder="Min. 6 characters"
                      value={pwForm.newPw} onChange={v => setPwForm(f => ({ ...f, newPw: v }))}
                      show={showPw.newPw} onToggleShow={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))} />
                    <PwInput label="Confirm New Password" field="confirm" placeholder="Re-enter new password"
                      value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
                      show={showPw.confirm} onToggleShow={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))} />
                    <button
                      onClick={handleChangePassword}
                      disabled={isPwLoading}
                      style={{
                        marginTop: 4, width: '100%', padding: '13px', borderRadius: 14,
                        background: isPwLoading ? M3.outlineVar : M3.primaryCont,
                        border: `1px solid ${M3.primary}44`,
                        color: M3.primary, fontSize: 14, fontWeight: 700,
                        cursor: isPwLoading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s',
                      }}
                    >
                      {isPwLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                      {isPwLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — Danger Zone */}
              <div style={{
                background: M3.surface,
                border: `1px solid ${M3.error}55`,
                borderRadius: 24, overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  padding: '20px 24px',
                  borderBottom: `1px solid ${M3.error}22`,
                  background: `linear-gradient(135deg, ${M3.errorCont}44, ${M3.errorCont}11)`,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: `${M3.error}18`, border: `1px solid ${M3.error}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={16} color={M3.error} />
                  </div>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: M3.error }}>Danger Zone</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Irreversible actions — proceed with extreme caution</p>
                  </div>
                </div>

                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Success message */}
                  {clearLogsSuccess && (
                    <div style={{ padding: '11px 14px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                      <CheckCircle size={14} /> {clearLogsSuccess}
                    </div>
                  )}

                  {/* Clear logs */}
                  <div style={{ borderRadius: 16, border: `1px solid ${M3.outline}`, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 18px', background: M3.outlineVar }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Clear Activity Logs</p>
                          <p style={{ fontSize: 12, color: M3.textLow, marginTop: 4, lineHeight: 1.5 }}>
                            Permanently delete all <strong style={{ color: M3.textMed }}>{activities.length}</strong> activity log entries from the system. This cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '12px 18px', borderTop: `1px solid ${M3.outline}`, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleClearLogs}
                        disabled={clearLogsLoading || activities.length === 0}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 7,
                          padding: '9px 16px', borderRadius: 12,
                          border: `1px solid ${M3.error}55`, background: `${M3.errorCont}55`,
                          color: M3.error, fontSize: 12, fontWeight: 700,
                          cursor: clearLogsLoading || activities.length === 0 ? 'not-allowed' : 'pointer',
                          opacity: activities.length === 0 ? 0.4 : 1,
                        }}
                      >
                        {clearLogsLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        {clearLogsLoading ? 'Clearing...' : 'Clear Logs'}
                      </button>
                    </div>
                  </div>

                  {/* Delete own account */}
                  <div style={{ borderRadius: 16, border: `1px solid ${M3.error}44`, overflow: 'hidden' }}>
                    <div style={{ padding: '16px 18px', background: `${M3.errorCont}22` }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: M3.error }}>Delete My Account</p>
                      <p style={{ fontSize: 12, color: M3.textLow, marginTop: 4, lineHeight: 1.5 }}>
                        Permanently delete your admin account <strong style={{ color: M3.textMed }}>({user?.username})</strong>. You will be immediately signed out and cannot recover this account.
                      </p>
                      <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: `${M3.error}11`, border: `1px solid ${M3.error}22` }}>
                        <p style={{ fontSize: 11, color: M3.error, fontWeight: 600 }}>
                          ⚠ Make sure another admin account exists before deleting yours.
                        </p>
                      </div>
                    </div>
                    <div style={{ padding: '12px 18px', borderTop: `1px solid ${M3.error}22`, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          if (confirm(`Delete your account "${user?.username}"? This is permanent and you will be signed out immediately.`)) {
                            deleteUser(users.find(u => u.username === user?.username)?.id);
                            onLogout();
                          }
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 7,
                          padding: '9px 16px', borderRadius: 12,
                          border: `1px solid ${M3.error}77`, background: `${M3.errorCont}88`,
                          color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} /> Delete My Account
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}