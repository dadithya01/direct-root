import React, { useState, useEffect } from 'react';
import {
  Sprout, LogOut, ShoppingCart, Store, ClipboardList,
  Loader2, AlertCircle, CheckCircle, X, Plus, Minus,
  Trash2, ShoppingBag, RefreshCw, Search, ChevronRight,
  Package, TrendingUp, ArrowUpRight, BarChart3, Settings,
  Lock, Eye, EyeOff, AlertTriangle, FileSignature,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const API_BASE_URL = "http://localhost:8080/api/v1";
const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Other'];

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
  greenCont:   '#003917',
  yellow:      '#f5c518',
  text:        '#f0f0ff',
  textMed:     '#c4c4e0',
  textLow:     '#8e8eaa',
  buyer:       '#7dd3fc',
  buyerCont:   '#0c4a6e',
  buyerDark:   '#082f49',
};

const catStyle = (cat) => {
  const map = {
    vegetables: { bg: '#14532d', color: '#86efac', border: '#166534' },
    fruits:     { bg: '#7c2d12', color: '#fdba74', border: '#9a3412' },
    grains:     { bg: '#713f12', color: '#fde047', border: '#854d0e' },
    dairy:      { bg: '#1e3a5f', color: '#93c5fd', border: '#1e40af' },
    meat:       { bg: '#7f1d1d', color: '#fca5a5', border: '#991b1b' },
    other:      { bg: '#2e3150', color: M3.textMed, border: M3.outline },
  };
  return map[cat?.toLowerCase()] || map.other;
};

const CatChip = ({ category }) => {
  const s = catStyle(category);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}>
      {category || 'N/A'}
    </span>
  );
};

const BuyerPwInput = ({ label, placeholder, value, onChange, show, onToggleShow }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
        onFocus={e => e.target.style.borderColor = M3.buyer} onBlur={e => e.target.style.borderColor = M3.outline}
      />
      <button type="button" onClick={onToggleShow} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow }}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  </div>
);

const ContractStatusBadge = ({ status }) => {
  const map = {
    PENDING:   { bg: '#713f1222', color: '#fde047', border: '#713f1255', label: 'Open' },
    APPLIED:   { bg: '#0c4a6e22', color: '#7dd3fc', border: '#0c4a6e55', label: 'Applied' },
    ACTIVE:    { bg: '#00391722', color: '#6ddc91', border: '#00391755', label: 'Active' },
    COMPLETED: { bg: '#1f223022', color: '#8e8eaa', border: '#2e315055', label: 'Completed' },
    CANCELLED: { bg: '#93000622', color: '#ffb4ab', border: '#93000655', label: 'Cancelled' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />{s.label}
    </span>
  );
};

export default function BuyerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab]       = useState('shop');
  const [products, setProducts]         = useState([]);
  const [orders, setOrders]             = useState([]);
  const [cart, setCart]                 = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');

  const [pwForm, setPwForm]             = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw]             = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError]           = useState(null);
  const [pwSuccess, setPwSuccess]       = useState(null);
  const [isPwLoading, setIsPwLoading]   = useState(false);

  // ── Contracts state ──
  const [contracts, setContracts]               = useState([]);
  const [isContractsLoading, setIsContractsLoading] = useState(false);
  const [contractForm, setContractForm]         = useState({ cropType: '', category: '', monthlyQuantity: '', deliveryFrequency: 'MONTHLY', durationMonths: 6, monthlyPrice: '', notes: '' });
  const [contractError, setContractError]       = useState(null);
  const [contractSuccess, setContractSuccess]   = useState(null);
  const [isPostingContract, setIsPostingContract] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch { setError('Failed to load products.'); }
    finally { setIsLoading(false); }
  };

  const fetchMyOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/my`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setOrders(Array.isArray(result) ? result : result.data || []);
    } catch { setError('Failed to load orders.'); }
    finally { setIsOrdersLoading(false); }
  };

  const fetchMyContracts = async () => {
    setIsContractsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contracts/my/buyer`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setContracts(Array.isArray(result) ? result : result.data || []);
    } catch { setContracts([]); }
    finally { setIsContractsLoading(false); }
  };

  const postContractRequest = async () => {
    setContractError(null); setContractSuccess(null);
    if (!contractForm.cropType || !contractForm.category || !contractForm.monthlyQuantity || !contractForm.monthlyPrice) {
      setContractError('Please fill in all required fields.'); return;
    }
    setIsPostingContract(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contracts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        body: JSON.stringify({ cropType: contractForm.cropType, category: contractForm.category, monthlyQuantity: parseInt(contractForm.monthlyQuantity), deliveryFrequency: contractForm.deliveryFrequency, durationMonths: contractForm.durationMonths, monthlyPrice: parseFloat(contractForm.monthlyPrice), notes: contractForm.notes }),
      });
      if (!res.ok) throw new Error('Failed to post contract request.');
      setContractSuccess('Contract request posted! Farmers can now apply.');
      setContractForm({ cropType: '', category: '', monthlyQuantity: '', deliveryFrequency: 'MONTHLY', durationMonths: 6, monthlyPrice: '', notes: '' });
      setShowContractForm(false);
      fetchMyContracts();
    } catch (err) { setContractError(err.message); }
    finally { setIsPostingContract(false); }
  };

  const handleAccept = async (contractId) => {
    try {
      await fetch(`${API_BASE_URL}/contracts/${contractId}/accept`, { method: 'PUT', headers: { Authorization: `Bearer ${user?.token}` } });
      setContractSuccess('Application accepted! Contract is now active.');
      fetchMyContracts();
    } catch { setContractError('Failed to accept application.'); }
  };

  const handleReject = async (contractId) => {
    try {
      await fetch(`${API_BASE_URL}/contracts/${contractId}/reject`, { method: 'PUT', headers: { Authorization: `Bearer ${user?.token}` } });
      setContractSuccess('Application rejected. Request is open again.');
      fetchMyContracts();
    } catch { setContractError('Failed to reject application.'); }
  };

  const handleCancelContract = async (contractId) => {
    if (!confirm('Cancel this contract? This cannot be undone.')) return;
    try {
      await fetch(`${API_BASE_URL}/contracts/${contractId}/cancel`, { method: 'PUT', headers: { Authorization: `Bearer ${user?.token}` } });
      setContractSuccess('Contract cancelled.');
      fetchMyContracts();
    } catch { setContractError('Failed to cancel contract.'); }
  };

  useEffect(() => { fetchProducts(); fetchMyOrders(); fetchMyContracts(); }, []);
  useEffect(() => { if (activeTab === 'contracts') fetchMyContracts(); }, [activeTab]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) { if (existing.quantity >= product.quantity) return prev; return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i); }
      return [...prev, { product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.product.id !== productId));
  const updateQty = (productId, delta) => {
    setCart(prev => prev.map(i => { if (i.product.id !== productId) return i; const newQty = i.quantity + delta; if (newQty <= 0) return null; if (newQty > i.product.quantity) return i; return { ...i, quantity: newQty }; }).filter(Boolean));
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const getCartQty = (productId) => cart.find(i => i.product.id === productId)?.quantity || 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true); setError(null); setSuccess(null);
    try {
      const orderItems = cart.map(i => ({ productId: i.product.id ?? i.product.productId, quantity: i.quantity }));
      const res = await fetch(`${API_BASE_URL}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ items: orderItems }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.message || 'Order failed.'); }
      setSuccess('Order placed successfully!');
      setCart([]);
      fetchProducts(); fetchMyOrders();
      setTimeout(() => setActiveTab('orders'), 1200);
    } catch (err) { setError(err.message); }
    finally { setIsCheckingOut(false); }
  };

  const handleChangePassword = async () => {
    setPwError(null); setPwSuccess(null);
    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) { setPwError('All fields are required.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('New passwords do not match.'); return; }
    if (pwForm.newPw.length < 6) { setPwError('Min. 6 characters required.'); return; }
    if (pwForm.current === pwForm.newPw) { setPwError('New password must be different.'); return; }
    setIsPwLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) });
      if (!res.ok) throw new Error('Current password is incorrect.');
      setPwSuccess('Password changed! Signing out...');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => onLogout(), 2000);
    } catch (e) { setPwError(e.message); }
    finally { setIsPwLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (!confirm(`Delete your account "${user?.username}"? This is permanent.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/delete-account`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } });
      if (!res.ok) throw new Error('Failed to delete account.');
      onLogout();
    } catch (e) { setError(e.message); }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmerUsername?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpent = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const allItems   = orders.flatMap(o => o.items || []);
  const productMap = allItems.reduce((acc, i) => { acc[i.productName] = (acc[i.productName] || 0) + (i.quantity || 0); return acc; }, {});
  const topProducts = Object.entries(productMap).map(([name, units]) => ({ name, units })).sort((a, b) => b.units - a.units).slice(0, 6);
  const catSpendMap = allItems.reduce((acc, item) => { const product = products.find(p => p.name === item.productName); const cat = product?.category || 'Other'; acc[cat] = (acc[cat] || 0) + (item.priceAtPurchase || 0) * (item.quantity || 0); return acc; }, {});
  const categorySpendData = Object.entries(catSpendMap).map(([name, amount]) => ({ name, amount: parseFloat(amount.toFixed(2)) })).sort((a, b) => b.amount - a.amount);
  const DONUT_COLORS = ['#7dd3fc', '#6ddc91', '#c3c6ff', '#f5c518', '#ffb4ab', '#fdba74'];

  const activeContracts  = contracts.filter(c => c.status === 'ACTIVE').length;
  const pendingContracts = contracts.filter(c => c.status === 'PENDING' || c.status === 'APPLIED').length;
  const totalContractValue = contracts.filter(c => c.status === 'ACTIVE').reduce((s, c) => s + (c.monthlyPrice || 0) * (c.durationMonths || 0), 0);

  const ChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (<div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 10, padding: '8px 12px' }}>{label && <p style={{ fontSize: 11, color: M3.textLow, marginBottom: 3 }}>{label}</p>}{payload.map((p, i) => (<p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color || M3.buyer }}>{p.name}: {typeof p.value === 'number' && p.name?.toLowerCase().includes('amount') ? `$${p.value}` : p.value}</p>))}</div>);
  };

  const nav = [
    { tab: 'shop',      icon: Store,          label: 'Shop' },
    { tab: 'orders',    icon: ClipboardList,  label: 'My Orders' },
    { tab: 'contracts', icon: FileSignature,  label: 'Contracts' },
    { tab: 'analytics', icon: BarChart3,      label: 'Analytics' },
    { tab: 'settings',  icon: Settings,       label: 'Settings' },
  ];

  const headerTitle = { shop: 'Marketplace', orders: 'My Orders', contracts: 'Contracts', analytics: 'Analytics', settings: 'Settings' };
  const headerSub = {
    shop: `${filteredProducts.length} products available`,
    orders: `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`,
    contracts: `${contracts.length} total requests · ${activeContracts} active`,
    analytics: 'Your purchase overview',
    settings: 'Manage your account',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: M3.bg, fontFamily: "'Google Sans', 'Roboto', system-ui, sans-serif", color: M3.text }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 256, background: M3.surface, borderRight: `1px solid ${M3.outline}`, display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 20 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${M3.outlineVar}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${M3.buyerCont}, #0369a1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${M3.buyer}44, 0 4px 12px #0369a144` }}><Sprout size={20} color={M3.buyer} /></div>
            <div><p style={{ fontSize: 16, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>DirectRoot</p><p style={{ fontSize: 11, color: M3.buyer, fontWeight: 600, marginTop: 1 }}>Buyer Portal</p></div>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', marginBottom: 6 }}>Menu</p>
          {nav.map(({ tab, icon: Icon, label }) => {
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', background: active ? `${M3.buyer}18` : 'transparent', color: active ? M3.buyer : M3.textMed, fontSize: 14, fontWeight: active ? 700 : 500, borderLeft: active ? `2px solid ${M3.buyer}` : '2px solid transparent', transition: 'all 0.15s', textAlign: 'left' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = M3.outlineVar; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} /><span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            );
          })}

          <div style={{ marginTop: 12, padding: 16, borderRadius: 16, background: M3.outlineVar, border: `1px solid ${M3.outline}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>My Stats</p>
            {[
              { label: 'Orders Placed',  value: orders.length,               color: M3.buyer },
              { label: 'Total Spent',    value: `$${totalSpent.toFixed(2)}`, color: M3.green },
              { label: 'Active Contracts', value: activeContracts,           color: M3.primary },
              { label: 'In Cart',        value: cartCount,                   color: M3.yellow },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 3 ? 10 : 0 }}>
                <span style={{ fontSize: 12, color: M3.textLow }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div style={{ marginTop: 12, borderRadius: 16, background: `${M3.buyer}10`, border: `1px solid ${M3.buyer}33`, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: `1px solid ${M3.buyer}22`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: M3.buyer }}><ShoppingCart size={13} /> Cart ({cartCount})</div>
                <span style={{ fontSize: 13, fontWeight: 800, color: M3.green }}>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ padding: '8px 16px', maxHeight: 100, overflowY: 'auto' }}>
                {cart.map(i => (<div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: M3.textLow, marginBottom: 4 }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{i.product.name}</span><span style={{ fontWeight: 700, color: M3.textMed }}>×{i.quantity}</span></div>))}
              </div>
              <div style={{ padding: '10px 12px', borderTop: `1px solid ${M3.buyer}22` }}>
                <button onClick={handleCheckout} disabled={isCheckingOut} style={{ width: '100%', padding: '9px', borderRadius: 10, background: M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {isCheckingOut ? <Loader2 size={12} className="animate-spin" /> : <ShoppingBag size={12} />}{isCheckingOut ? 'Placing...' : 'Checkout'}
                </button>
              </div>
            </div>
          )}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 12px', borderTop: `1px solid ${M3.outlineVar}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: M3.outlineVar, marginBottom: 8, border: `1px solid ${M3.outline}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${M3.buyerCont}, #0369a1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: M3.buyer }}>{user?.username?.substring(0, 2).toUpperCase() || 'BU'}</div>
            <div style={{ minWidth: 0, flex: 1 }}><p style={{ fontSize: 13, fontWeight: 700, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Buyer'}</p><p style={{ fontSize: 11, color: M3.buyer }}>Buyer</p></div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'transparent', color: M3.error, fontSize: 13, fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.background = `${M3.errorCont}66`}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          ><LogOut size={16} /> Sign out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, marginLeft: 256 }}>
        <header style={{ background: `${M3.surface}e8`, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${M3.outline}`, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>{headerTitle[activeTab]}</h1>
            <p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>{headerSub[activeTab]}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {activeTab === 'shop' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: '8px 14px', width: 220 }}>
                  <Search size={14} color={M3.textLow} />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." style={{ background: 'none', border: 'none', outline: 'none', color: M3.text, fontSize: 13, flex: 1, fontFamily: 'inherit' }} />
                  {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow, display: 'flex' }}><X size={12} /></button>}
                </div>
                <button onClick={fetchProducts} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}><RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /></button>
              </>
            )}
            {activeTab === 'orders' && <button onClick={fetchMyOrders} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}><RefreshCw size={15} className={isOrdersLoading ? 'animate-spin' : ''} /></button>}
            {activeTab === 'contracts' && <button onClick={fetchMyContracts} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}><RefreshCw size={15} className={isContractsLoading ? 'animate-spin' : ''} /></button>}
            {cart.length > 0 && (
              <button onClick={() => setActiveTab('shop')} style={{ position: 'relative', width: 40, height: 40, borderRadius: 20, background: M3.buyerCont, border: `1px solid ${M3.buyer}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.buyer }}>
                <ShoppingCart size={16} />
                <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: M3.error, borderRadius: '50%', fontSize: 9, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${M3.bg}` }}>{cartCount}</span>
              </button>
            )}
          </div>
        </header>

        <div style={{ padding: '32px' }}>
          {error && <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 14, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertCircle size={15} />{error}</div><button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.error }}><X size={15} /></button></div>}
          {success && <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 14, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={15} />{success}</div><button onClick={() => setSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.green }}><X size={15} /></button></div>}

          {/* ── Shop ── */}
          {activeTab === 'shop' && (
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1 }}>
                {isLoading ? (<div style={{ padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}><Loader2 size={28} color={M3.buyer} className="animate-spin" /><p style={{ fontSize: 12, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading marketplace...</p></div>)
                  : filteredProducts.length === 0 ? (<div style={{ padding: 64, textAlign: 'center' }}><Store size={40} color={M3.textLow} style={{ margin: '0 auto 14px' }} /><p style={{ fontSize: 14, color: M3.textLow, fontWeight: 600 }}>{searchQuery ? `No products matching "${searchQuery}"` : 'No products available'}</p></div>)
                  : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                      {filteredProducts.map((p) => {
                        const inCart = getCartQty(p.id); const outOfStock = p.quantity === 0;
                        return (
                          <div key={p.id} style={{ background: M3.surface, border: `1px solid ${inCart > 0 ? M3.buyer + '55' : M3.outline}`, borderRadius: 20, overflow: 'hidden', opacity: outOfStock ? 0.6 : 1, transition: 'all 0.2s', boxShadow: inCart > 0 ? `0 0 0 1px ${M3.buyer}33` : 'none' }}>
                            {inCart > 0 && <div style={{ height: 3, background: M3.buyer }} />}
                            <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${M3.outlineVar}` }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 13, background: `${M3.buyer}18`, border: `1px solid ${M3.buyer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: M3.buyer }}>{p.name?.[0]?.toUpperCase()}</div>
                                <CatChip category={p.category} />
                              </div>
                              <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>{p.name}</p>
                              {p.description && <p style={{ fontSize: 12, color: M3.textLow, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.description}</p>}
                            </div>
                            <div style={{ padding: '14px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div><p style={{ fontSize: 22, fontWeight: 800, color: M3.green, letterSpacing: '-0.5px' }}>${Number(p.price).toFixed(2)}</p><p style={{ fontSize: 11, color: outOfStock ? M3.error : M3.textLow, marginTop: 2, fontWeight: outOfStock ? 700 : 400 }}>{outOfStock ? 'Out of stock' : `${p.quantity} available`}</p></div>
                                <div style={{ textAlign: 'right' }}><p style={{ fontSize: 10, color: M3.textLow }}>by</p><p style={{ fontSize: 12, fontWeight: 700, color: M3.buyer }}>{p.farmerUsername}</p></div>
                              </div>
                              {outOfStock ? <div style={{ padding: '10px', borderRadius: 12, background: M3.outlineVar, textAlign: 'center', fontSize: 12, color: M3.textLow, fontWeight: 600 }}>Out of Stock</div>
                                : inCart === 0 ? <button onClick={() => addToCart(p)} style={{ width: '100%', padding: '11px', borderRadius: 12, background: M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}><Plus size={15} /> Add to Cart</button>
                                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: M3.outlineVar, borderRadius: 12, padding: '4px', border: `1px solid ${M3.buyer}33` }}>
                                    <button onClick={() => updateQty(p.id, -1)} style={{ width: 36, height: 36, borderRadius: 9, background: M3.surfaceVar, border: 'none', color: M3.error, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={14} /></button>
                                    <span style={{ fontSize: 15, fontWeight: 800, color: M3.buyer }}>{inCart}</span>
                                    <button onClick={() => updateQty(p.id, 1)} disabled={inCart >= p.quantity} style={{ width: 36, height: 36, borderRadius: 9, background: M3.buyerCont, border: 'none', color: M3.buyer, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: inCart >= p.quantity ? 0.4 : 1 }}><Plus size={14} /></button>
                                  </div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
              {cart.length > 0 && (
                <div style={{ width: 300, flexShrink: 0 }}>
                  <div style={{ background: M3.surface, border: `1px solid ${M3.buyer}44`, borderRadius: 20, overflow: 'hidden', position: 'sticky', top: 88 }}>
                    <div style={{ padding: '18px 20px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${M3.buyer}08` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShoppingCart size={16} color={M3.buyer} /><p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Your Cart</p></div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${M3.buyer}18`, color: M3.buyer, border: `1px solid ${M3.buyer}33` }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ padding: '12px', maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {cart.map(i => (
                        <div key={i.product.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: M3.outlineVar, borderRadius: 14, border: `1px solid ${M3.outline}` }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, background: `${M3.buyer}18`, border: `1px solid ${M3.buyer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: M3.buyer }}>{i.product.name?.[0]?.toUpperCase()}</div>
                          <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 12, fontWeight: 700, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.product.name}</p><p style={{ fontSize: 10, color: M3.textLow }}>${Number(i.product.price).toFixed(2)} × {i.quantity}</p></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                            <button onClick={() => updateQty(i.product.id, -1)} style={{ width: 24, height: 24, borderRadius: 7, background: M3.surfaceVar, border: 'none', color: M3.textMed, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={10} /></button>
                            <span style={{ fontSize: 12, fontWeight: 800, color: M3.text, width: 16, textAlign: 'center' }}>{i.quantity}</span>
                            <button onClick={() => updateQty(i.product.id, 1)} disabled={i.quantity >= i.product.quantity} style={{ width: 24, height: 24, borderRadius: 7, background: M3.buyerCont, border: 'none', color: M3.buyer, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: i.quantity >= i.product.quantity ? 0.4 : 1 }}><Plus size={10} /></button>
                            <button onClick={() => removeFromCart(i.product.id)} style={{ width: 24, height: 24, borderRadius: 7, background: `${M3.errorCont}55`, border: 'none', color: M3.error, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: 2 }}><Trash2 size={10} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: '16px 20px', borderTop: `1px solid ${M3.outlineVar}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}><span style={{ fontSize: 12, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</span><span style={{ fontSize: 22, fontWeight: 800, color: M3.green, letterSpacing: '-0.5px' }}>${cartTotal.toFixed(2)}</span></div>
                      <button onClick={handleCheckout} disabled={isCheckingOut} style={{ width: '100%', padding: '13px', borderRadius: 14, background: isCheckingOut ? M3.outlineVar : M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 14, fontWeight: 700, cursor: isCheckingOut ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}{isCheckingOut ? 'Placing Order...' : 'Place Order'}</button>
                      <button onClick={() => setCart([])} style={{ width: '100%', marginTop: 8, padding: '9px', borderRadius: 12, background: 'none', border: 'none', color: M3.textLow, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Trash2 size={12} /> Clear Cart</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Orders ── */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[{ label: 'Orders Placed', value: orders.length, sub: 'Total orders', accent: M3.buyer, icon: ClipboardList }, { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, sub: 'Across all orders', accent: M3.green, icon: TrendingUp }, { label: 'Items Bought', value: orders.reduce((s, o) => s + (o.items?.length || 0), 0), sub: 'Unique products', accent: M3.primary, icon: Package }].map((s, i) => (
                  <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '20px 20px 0 0' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.accent}22`, border: `1px solid ${s.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={18} color={s.accent} /></div><div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#163420', border: '1px solid #1a4a2a', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}><ArrowUpRight size={10} />Active</div></div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px' }}>{s.value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed, marginTop: 5 }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: `${M3.buyer}18`, border: `1px solid ${M3.buyer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardList size={15} color={M3.buyer} /></div><div><p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Order History</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>{orders.length} orders placed</p></div></div>
                  <button onClick={() => setActiveTab('shop')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 20, background: M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><Store size={13} /> Shop More</button>
                </div>
                {isOrdersLoading ? <div style={{ padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}><Loader2 size={28} color={M3.buyer} className="animate-spin" /><p style={{ fontSize: 12, color: M3.textLow }}>Loading orders...</p></div>
                  : orders.length === 0 ? <div style={{ padding: 64, textAlign: 'center' }}><ClipboardList size={40} color={M3.textLow} style={{ margin: '0 auto 14px' }} /><p style={{ fontSize: 14, color: M3.textLow, fontWeight: 600 }}>No orders yet</p><button onClick={() => setActiveTab('shop')} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 20, background: M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><Store size={14} /> Start Shopping</button></div>
                  : <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>{[...orders].reverse().map((order) => (<div key={order.id} style={{ borderRadius: 16, border: `1px solid ${M3.outline}`, overflow: 'hidden', background: M3.surfaceVar }}><div style={{ padding: '13px 18px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: M3.outlineVar }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, fontFamily: 'monospace' }}>ORDER #{order.id}</span><span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${M3.green}18`, color: M3.green, border: `1px solid ${M3.green}33` }}>Completed</span></div><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ fontSize: 11, color: M3.textLow }}>{order.orderedAt ? new Date(order.orderedAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span><span style={{ fontSize: 15, fontWeight: 800, color: M3.green }}>${Number(order.totalPrice).toFixed(2)}</span></div></div><div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>{order.items?.map((item, i) => (<div key={item.id ?? i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: M3.surface, borderRadius: 12, border: `1px solid ${M3.outlineVar}` }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 32, height: 32, borderRadius: 10, background: `${M3.buyer}18`, border: `1px solid ${M3.buyer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: M3.buyer, flexShrink: 0 }}>{item.productName?.[0]?.toUpperCase()}</div><div><p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{item.productName}</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>by {item.farmerUsername}</p></div></div><div style={{ textAlign: 'right' }}><p style={{ fontSize: 13, fontWeight: 800, color: M3.green }}>${Number(item.priceAtPurchase).toFixed(2)}</p><p style={{ fontSize: 10, color: M3.textLow, marginTop: 2 }}>qty: {item.quantity}</p></div></div>))}</div></div>))}</div>}
              </div>
            </div>
          )}

          {/* ── CONTRACTS TAB ── */}
          {activeTab === 'contracts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {contractError && <div style={{ padding: '12px 16px', borderRadius: 14, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertCircle size={15} />{contractError}</div><button onClick={() => setContractError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.error }}><X size={15} /></button></div>}
              {contractSuccess && <div style={{ padding: '12px 16px', borderRadius: 14, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={15} />{contractSuccess}</div><button onClick={() => setContractSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.green }}><X size={15} /></button></div>}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Total Contracts',  value: contracts.length,          sub: 'All requests posted',    accent: M3.buyer },
                  { label: 'Active Contracts', value: activeContracts,           sub: 'Currently running',      accent: M3.green },
                  { label: 'Total Value',      value: `$${totalContractValue.toFixed(0)}`, sub: 'Active contract worth', accent: M3.primary },
                ].map((s, i) => (
                  <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '20px 20px 0 0' }} />
                    <p style={{ fontSize: 28, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: 6 }}>{s.value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Post form */}
              <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Hire a Farmer</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>Post a contract request and let farmers apply</p></div>
                  <button onClick={() => setShowContractForm(f => !f)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 20, background: showContractForm ? M3.outlineVar : M3.buyerCont, border: `1px solid ${showContractForm ? M3.outline : M3.buyer + '44'}`, color: showContractForm ? M3.textMed : M3.buyer, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    {showContractForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Post Request</>}
                  </button>
                </div>

                {showContractForm && (
                  <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[{ label: 'Crop Type *', key: 'cropType', placeholder: 'e.g. Tomatoes, Rice, Milk', type: 'text' }, { label: 'Monthly Price (USD) *', key: 'monthlyPrice', placeholder: 'e.g. 200.00', type: 'number' }].map(field => (
                      <div key={field.key}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{field.label}</label>
                        <input type={field.type} value={contractForm[field.key]} onChange={e => setContractForm(f => ({ ...f, [field.key]: e.target.value }))} placeholder={field.placeholder}
                          style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          onFocus={e => e.target.style.borderColor = M3.buyer} onBlur={e => e.target.style.borderColor = M3.outline}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Category *</label>
                      <select value={contractForm.category} onChange={e => setContractForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = M3.buyer} onBlur={e => e.target.style.borderColor = M3.outline}>
                        <option value="">Select category</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Monthly Quantity (units) *</label>
                      <input type="number" min="1" value={contractForm.monthlyQuantity} onChange={e => setContractForm(f => ({ ...f, monthlyQuantity: e.target.value }))} placeholder="e.g. 50"
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        onFocus={e => e.target.style.borderColor = M3.buyer} onBlur={e => e.target.style.borderColor = M3.outline}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Duration</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[6, 12].map(d => <button key={d} onClick={() => setContractForm(f => ({ ...f, durationMonths: d }))} style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1px solid ${contractForm.durationMonths === d ? M3.buyer + '77' : M3.outline}`, background: contractForm.durationMonths === d ? M3.buyerCont : M3.surfaceVar, color: contractForm.durationMonths === d ? M3.buyer : M3.textMed, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{d} months</button>)}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Delivery Frequency</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {['WEEKLY', 'MONTHLY'].map(f => <button key={f} onClick={() => setContractForm(prev => ({ ...prev, deliveryFrequency: f }))} style={{ flex: 1, padding: '11px', borderRadius: 12, border: `1px solid ${contractForm.deliveryFrequency === f ? M3.buyer + '77' : M3.outline}`, background: contractForm.deliveryFrequency === f ? M3.buyerCont : M3.surfaceVar, color: contractForm.deliveryFrequency === f ? M3.buyer : M3.textMed, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{f === 'WEEKLY' ? 'Weekly' : 'Monthly'}</button>)}
                      </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Notes / Requirements</label>
                      <textarea value={contractForm.notes} onChange={e => setContractForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any special requirements, delivery location, quality standards..." rows={3}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6 }}
                        onFocus={e => e.target.style.borderColor = M3.buyer} onBlur={e => e.target.style.borderColor = M3.outline}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end' }}>
                      {contractForm.monthlyPrice && contractForm.durationMonths && (
                        <div style={{ padding: '14px 18px', borderRadius: 14, background: `${M3.buyer}10`, border: `1px solid ${M3.buyer}33` }}>
                          <p style={{ fontSize: 11, color: M3.textLow, marginBottom: 4 }}>Total contract value</p>
                          <p style={{ fontSize: 22, fontWeight: 800, color: M3.buyer, letterSpacing: '-0.5px' }}>${(parseFloat(contractForm.monthlyPrice || 0) * contractForm.durationMonths).toFixed(2)}</p>
                          <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>${contractForm.monthlyPrice}/mo × {contractForm.durationMonths} months</p>
                        </div>
                      )}
                      <button onClick={postContractRequest} disabled={isPostingContract} style={{ padding: '13px 28px', borderRadius: 14, background: isPostingContract ? M3.outlineVar : M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 14, fontWeight: 700, cursor: isPostingContract ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                        {isPostingContract ? <Loader2 size={16} className="animate-spin" /> : <FileSignature size={16} />}{isPostingContract ? 'Posting...' : 'Post Request'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* My contracts list */}
              <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${M3.outlineVar}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>My Contract Requests</p>
                  <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{contracts.length} total requests</p>
                </div>
                {isContractsLoading ? <div style={{ padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}><Loader2 size={28} color={M3.buyer} className="animate-spin" /><p style={{ fontSize: 12, color: M3.textLow }}>Loading contracts...</p></div>
                  : contracts.length === 0 ? (
                    <div style={{ padding: 64, textAlign: 'center' }}>
                      <FileSignature size={40} color={M3.textLow} style={{ margin: '0 auto 14px' }} />
                      <p style={{ fontSize: 14, color: M3.textLow, fontWeight: 600 }}>No contract requests yet</p>
                      <p style={{ fontSize: 12, color: M3.textLow, marginTop: 6 }}>Post a request and farmers will apply to work with you.</p>
                      <button onClick={() => setShowContractForm(true)} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 20, background: M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><Plus size={14} /> Post First Request</button>
                    </div>
                  ) : (
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[...contracts].reverse().map(c => (
                        <div key={c.id} style={{ borderRadius: 16, border: `1px solid ${M3.outline}`, overflow: 'hidden', background: M3.surfaceVar }}>
                          <div style={{ padding: '13px 18px', background: M3.outlineVar, borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, fontFamily: 'monospace' }}>CONTRACT #{c.id}</span>
                              <ContractStatusBadge status={c.status} />
                            </div>
                            <span style={{ fontSize: 11, color: M3.textLow }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
                          </div>
                          <div style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                              {[{ label: 'Crop', value: c.cropType }, { label: 'Qty/mo', value: `${c.monthlyQuantity} units` }, { label: 'Price/mo', value: `$${c.monthlyPrice}` }, { label: 'Duration', value: `${c.durationMonths} months` }].map((item, i) => (
                                <div key={i}><p style={{ fontSize: 10, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{item.label}</p><p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{item.value}</p></div>
                              ))}
                            </div>
                            {c.farmerUsername && (
                              <div style={{ padding: '10px 14px', borderRadius: 12, background: `${M3.buyer}10`, border: `1px solid ${M3.buyer}33`, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                  <p style={{ fontSize: 11, color: M3.textLow, marginBottom: 2 }}>{c.status === 'APPLIED' ? '🙋 Farmer applied' : c.status === 'ACTIVE' ? '✅ Hired farmer' : 'Farmer'}</p>
                                  <p style={{ fontSize: 14, fontWeight: 700, color: M3.buyer }}>{c.farmerUsername}</p>
                                </div>
                                {c.status === 'ACTIVE' && c.startDate && (
                                  <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 10, color: M3.textLow }}>Contract period</p>
                                    <p style={{ fontSize: 11, fontWeight: 600, color: M3.textMed }}>{new Date(c.startDate).toLocaleDateString([], { day: '2-digit', month: 'short' })} → {new Date(c.endDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            {c.notes && <p style={{ fontSize: 12, color: M3.textLow, fontStyle: 'italic', marginBottom: 12 }}>"{c.notes}"</p>}
                            <div style={{ display: 'flex', gap: 8 }}>
                              {c.status === 'APPLIED' && (
                                <>
                                  <button onClick={() => handleAccept(c.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><CheckCircle size={13} /> Accept Farmer</button>
                                  <button onClick={() => handleReject(c.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: `${M3.errorCont}44`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><X size={13} /> Reject</button>
                                </>
                              )}
                              {(c.status === 'ACTIVE' || c.status === 'PENDING' || c.status === 'APPLIED') && (
                                <button onClick={() => handleCancelContract(c.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: M3.outlineVar, border: `1px solid ${M3.outline}`, color: M3.textLow, fontSize: 12, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}>Cancel</button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* ── Analytics ── */}
          {activeTab === 'analytics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[{ label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, sub: 'Across all orders', accent: M3.buyer, icon: TrendingUp }, { label: 'Orders Placed', value: orders.length, sub: 'Total purchases made', accent: M3.green, icon: ClipboardList }, { label: 'Unique Products', value: Object.keys(productMap).length, sub: 'Different items purchased', accent: M3.primary, icon: Package }].map((s, i) => (
                  <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '20px 20px 0 0' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.accent}22`, border: `1px solid ${s.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={18} color={s.accent} /></div><div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#163420', border: '1px solid #1a4a2a', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}><ArrowUpRight size={10} />Active</div></div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px' }}>{s.value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed, marginTop: 5 }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Most Purchased Products</p>
                  <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 20 }}>Units bought per product</p>
                  {topProducts.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, padding: 40, fontSize: 13 }}>No orders yet</p> : (<ResponsiveContainer width="100%" height={220}><BarChart data={topProducts} barSize={32}><XAxis dataKey="name" tick={{ fill: M3.textLow, fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: M3.textLow, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} cursor={{ fill: `${M3.buyer}10` }} /><Bar dataKey="units" name="Units" fill={M3.buyer} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>)}
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Spending by Category</p>
                  <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 20 }}>Total amount spent per category</p>
                  {categorySpendData.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, padding: 40, fontSize: 13 }}>No orders yet</p> : (<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}><ResponsiveContainer width={180} height={180}><PieChart><Pie data={categorySpendData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="amount">{categorySpendData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{categorySpendData.map((d, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} /><div><p style={{ fontSize: 12, fontWeight: 700, color: M3.text }}>${d.amount}</p><p style={{ fontSize: 11, color: M3.textLow }}>{d.name}</p></div></div>))}</div></div>)}
                </div>
              </div>
              {(() => {
                const favFarmerMap = allItems.reduce((acc, i) => { acc[i.farmerUsername] = (acc[i.farmerUsername] || 0) + (i.quantity || 0); return acc; }, {});
                const favFarmer = Object.entries(favFarmerMap).sort((a, b) => b[1] - a[1])[0];
                const mostExpensive = allItems.reduce((max, i) => (i.priceAtPurchase || 0) > (max?.priceAtPurchase || 0) ? i : max, null);
                const totalItems = allItems.reduce((s, i) => s + (i.quantity || 0), 0);
                const avgOrderValue = orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : '0.00';
                const mostBought = topProducts[0];
                const insights = [
                  { label: 'Favourite Farmer', value: favFarmer ? favFarmer[0] : '—', sub: favFarmer ? `${favFarmer[1]} units bought from them` : 'No orders yet', color: M3.buyer, icon: '🌾' },
                  { label: 'Most Bought Product', value: mostBought ? mostBought.name : '—', sub: mostBought ? `${mostBought.units} units total` : 'No purchases yet', color: M3.green, icon: '🛒' },
                  { label: 'Most Expensive Purchase', value: mostExpensive ? `$${Number(mostExpensive.priceAtPurchase).toFixed(2)}` : '—', sub: mostExpensive ? mostExpensive.productName : 'No purchases yet', color: M3.yellow, icon: '💰' },
                  { label: 'Total Items Bought', value: totalItems, sub: `Across ${orders.length} orders`, color: M3.primary, icon: '📦' },
                  { label: 'Avg Order Value', value: `$${avgOrderValue}`, sub: 'Per order average', color: '#e6b9d8', icon: '📊' },
                  { label: 'Farmers Supported', value: Object.keys(favFarmerMap).length, sub: 'Unique farmers ordered from', color: M3.green, icon: '🤝' },
                ];
                return (
                  <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ padding: '20px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: 12, background: `${M3.buyer}18`, border: `1px solid ${M3.buyer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div><div><p style={{ fontSize: 15, fontWeight: 700, color: M3.text }}>Shopping Insights</p><p style={{ fontSize: 12, color: M3.textLow, marginTop: 1 }}>Your personal buying habits</p></div></div>
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                      {insights.map((ins, i) => (<div key={i} style={{ padding: '16px 18px', borderRadius: 16, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, transition: 'border-color 0.15s' }} onMouseEnter={e => e.currentTarget.style.borderColor = ins.color + '55'} onMouseLeave={e => e.currentTarget.style.borderColor = M3.outline}><div style={{ fontSize: 22, marginBottom: 10 }}>{ins.icon}</div><p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>{ins.label}</p><p style={{ fontSize: 17, fontWeight: 800, color: ins.color, letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.value}</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 4, lineHeight: 1.4 }}>{ins.sub}</p></div>))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── Settings ── */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start', maxWidth: 900 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ height: 80, background: `linear-gradient(135deg, ${M3.buyerCont}cc, #0369a188, #082f49)`, borderBottom: `1px solid ${M3.outline}` }} />
                  <div style={{ padding: '0 24px 24px' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${M3.buyerCont}, #0369a1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: M3.buyer, border: `3px solid ${M3.surface}`, marginTop: -36, marginBottom: 12, boxShadow: `0 4px 20px ${M3.buyerCont}99` }}>{user?.username?.substring(0, 2).toUpperCase() || 'BU'}</div>
                    <p style={{ fontSize: 18, fontWeight: 800, color: M3.text }}>{user?.username || 'Buyer'}</p>
                    <p style={{ fontSize: 12, color: M3.textLow, marginTop: 3 }}>{user?.username}@directroot.com</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: M3.buyerCont, color: M3.buyer, border: `1px solid ${M3.buyer}44` }}>BUYER</span><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 6, height: 6, background: M3.green, borderRadius: '50%', boxShadow: `0 0 6px ${M3.green}` }} /><span style={{ fontSize: 11, color: M3.green, fontWeight: 600 }}>Active</span></div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, marginTop: 18, background: M3.outline, borderRadius: 14, overflow: 'hidden' }}>{[{ label: 'Orders', value: orders.length }, { label: 'Spent', value: `$${totalSpent.toFixed(0)}` }, { label: 'Contracts', value: activeContracts }].map((s, i) => (<div key={i} style={{ background: M3.surfaceVar, padding: '12px 0', textAlign: 'center' }}><p style={{ fontSize: 17, fontWeight: 800, color: M3.buyer }}>{s.value}</p><p style={{ fontSize: 10, color: M3.textLow, marginTop: 2 }}>{s.label}</p></div>))}</div>
                  </div>
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: `${M3.buyer}18`, border: `1px solid ${M3.buyer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={15} color={M3.buyer} /></div><div><p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>Change Password</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Update your account password</p></div></div>
                  <div style={{ padding: 22 }}>
                    {pwError && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}><AlertTriangle size={13} />{pwError}</div>}
                    {pwSuccess && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}><CheckCircle size={13} />{pwSuccess}</div>}
                    <BuyerPwInput label="Current Password" placeholder="Enter current password" value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))} show={showPw.current} onToggleShow={() => setShowPw(s => ({ ...s, current: !s.current }))} />
                    <BuyerPwInput label="New Password" placeholder="Min. 6 characters" value={pwForm.newPw} onChange={v => setPwForm(f => ({ ...f, newPw: v }))} show={showPw.newPw} onToggleShow={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))} />
                    <BuyerPwInput label="Confirm New Password" placeholder="Re-enter new password" value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))} show={showPw.confirm} onToggleShow={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))} />
                    <button onClick={handleChangePassword} disabled={isPwLoading} style={{ width: '100%', padding: '12px', borderRadius: 14, background: isPwLoading ? M3.outlineVar : M3.buyerCont, border: `1px solid ${M3.buyer}44`, color: M3.buyer, fontSize: 13, fontWeight: 700, cursor: isPwLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{isPwLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}{isPwLoading ? 'Updating...' : 'Update Password'}</button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: 22 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, marginBottom: 16 }}>Account Information</p>
                  {[{ label: 'Username', value: user?.username || '—' }, { label: 'Role', value: 'Buyer' }, { label: 'Orders Placed', value: orders.length }, { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}` }].map((row, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < 4 ? `1px solid ${M3.outlineVar}` : 'none' }}><span style={{ fontSize: 12, color: M3.textLow }}>{row.label}</span><span style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{row.value}</span></div>))}
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.error}55`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 22px', borderBottom: `1px solid ${M3.error}22`, background: `linear-gradient(135deg, ${M3.errorCont}44, ${M3.errorCont}11)`, display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 10, background: `${M3.error}18`, border: `1px solid ${M3.error}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={14} color={M3.error} /></div><div><p style={{ fontSize: 13, fontWeight: 700, color: M3.error }}>Danger Zone</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Irreversible actions</p></div></div>
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ borderRadius: 14, border: `1px solid ${M3.outline}`, overflow: 'hidden' }}><div style={{ padding: '13px 16px', background: M3.outlineVar }}><p style={{ fontSize: 13, fontWeight: 600, color: M3.text }}>Sign Out</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 3 }}>End your current session.</p></div><div style={{ padding: '10px 16px', borderTop: `1px solid ${M3.outline}`, display: 'flex', justifyContent: 'flex-end' }}><button onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: `1px solid ${M3.outline}`, background: M3.outlineVar, color: M3.textMed, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><LogOut size={12} /> Sign Out</button></div></div>
                    <div style={{ borderRadius: 14, border: `1px solid ${M3.error}44`, overflow: 'hidden' }}><div style={{ padding: '13px 16px', background: `${M3.errorCont}22` }}><p style={{ fontSize: 13, fontWeight: 700, color: M3.error }}>Delete My Account</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 3, lineHeight: 1.5 }}>Permanently delete your account <strong style={{ color: M3.textMed }}>({user?.username})</strong>. Your order history will be preserved.</p></div><div style={{ padding: '10px 16px', borderTop: `1px solid ${M3.error}22`, display: 'flex', justifyContent: 'flex-end' }}><button onClick={handleDeleteAccount} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: `1px solid ${M3.error}55`, background: `${M3.errorCont}66`, color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><AlertTriangle size={12} /> Delete My Account</button></div></div>
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