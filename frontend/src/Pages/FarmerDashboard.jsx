import React, { useState, useEffect } from 'react';
import {
  Sprout, LogOut, Plus, Package, List, Loader2,
  AlertCircle, CheckCircle, X, DollarSign, Hash,
  Tag, FileText, RefreshCw, Wheat, TrendingUp,
  ShoppingBag, ChevronRight, ArrowUpRight, Search,
  Pencil, Save, XCircle, Settings, Lock, Eye, EyeOff, AlertTriangle, BarChart3,
  FileSignature,
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
  farmer:      '#34d399',
  farmerCont:  '#064e3b',
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

const inputStyle = () => ({
  width: '100%', padding: '11px 11px 11px 38px', borderRadius: 12,
  background: M3.surfaceVar, border: `1px solid ${M3.outline}`,
  color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
});

const FarmerPwInput = ({ label, placeholder, value, onChange, show, onToggleShow }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
        onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline}
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

export default function FarmerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab]       = useState('listings');
  const [products, setProducts]         = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState(null);
  const [success, setSuccess]           = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [form, setForm]                 = useState({ name: '', category: '', price: '', quantity: '', description: '' });
  const [editingId, setEditingId]       = useState(null);
  const [editForm, setEditForm]         = useState({});
  const [isSaving, setIsSaving]         = useState(false);
  const [pwForm, setPwForm]             = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw]             = useState({ current: false, newPw: false, confirm: false });
  const [pwError, setPwError]           = useState(null);
  const [pwSuccess, setPwSuccess]       = useState(null);
  const [isPwLoading, setIsPwLoading]   = useState(false);
  const [orders, setOrders]             = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // ── Contracts state ──
  const [openRequests, setOpenRequests]         = useState([]);
  const [myContracts, setMyContracts]           = useState([]);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [contractError, setContractError]       = useState(null);
  const [contractSuccess, setContractSuccess]   = useState(null);
  const [contractsSubTab, setContractsSubTab]   = useState('browse');

  const fetchMyOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/farmer`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setOrders(Array.isArray(result) ? result : result.data || []);
    } catch { setOrders([]); }
    finally { setIsOrdersLoading(false); }
  };

  const fetchOpenRequests = async () => {
    setIsRequestsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/contracts/open`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setOpenRequests(Array.isArray(result) ? result : result.data || []);
    } catch { setOpenRequests([]); }
    finally { setIsRequestsLoading(false); }
  };

  const fetchMyFarmerContracts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contracts/my/farmer`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setMyContracts(Array.isArray(result) ? result : result.data || []);
    } catch { setMyContracts([]); }
  };

  const handleApply = async (contractId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/contracts/${contractId}/apply`, { method: 'PUT', headers: { Authorization: `Bearer ${user?.token}` } });
      if (!res.ok) throw new Error('Failed to apply.');
      setContractSuccess('Application submitted! The buyer will review it.');
      fetchOpenRequests(); fetchMyFarmerContracts();
    } catch (e) { setContractError(e.message); }
  };

  const handleFarmerCancel = async (contractId) => {
    if (!confirm('Cancel this contract?')) return;
    try {
      await fetch(`${API_BASE_URL}/contracts/${contractId}/cancel`, { method: 'PUT', headers: { Authorization: `Bearer ${user?.token}` } });
      setContractSuccess('Contract cancelled.');
      fetchMyFarmerContracts();
    } catch { setContractError('Failed to cancel.'); }
  };

  useEffect(() => { if (activeTab === 'analytics') fetchMyOrders(); }, [activeTab]);
  useEffect(() => { if (activeTab === 'contracts') { fetchOpenRequests(); fetchMyFarmerContracts(); } }, [activeTab]);
  useEffect(() => { fetchMyProducts(); }, []);

  const fetchMyProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/my`, { headers: { Authorization: `Bearer ${user?.token}` } });
      const result = await res.json();
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch { setError('Failed to load your products.'); }
    finally { setIsLoading(false); }
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price || !form.quantity) { setError('Please fill in all required fields.'); return; }
    setIsSubmitting(true); setError(null); setSuccess(null);
    try {
      const res = await fetch(`${API_BASE_URL}/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ name: form.name, category: form.category, price: parseFloat(form.price), quantity: parseInt(form.quantity), description: form.description }) });
      if (!res.ok) throw new Error('Failed to post product.');
      setSuccess('Product listed successfully!');
      setForm({ name: '', category: '', price: '', quantity: '', description: '' });
      fetchMyProducts();
      setTimeout(() => setActiveTab('listings'), 1000);
    } catch (err) { setError(err.message); }
    finally { setIsSubmitting(false); }
  };

  const startEdit = (p) => { setEditingId(p.id); setEditForm({ name: p.name || '', category: p.category || '', price: p.price || '', quantity: p.quantity || '', description: p.description || '' }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

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
      setPwSuccess('Password updated! Please sign in again.');
      setPwForm({ current: '', newPw: '', confirm: '' });
      setTimeout(() => onLogout(), 2000);
    } catch (e) { setPwError(e.message); }
    finally { setIsPwLoading(false); }
  };

  const saveEdit = async (id) => {
    if (!editForm.name || !editForm.category || !editForm.price || !editForm.quantity) { setError('All required fields must be filled.'); return; }
    setIsSaving(true); setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` }, body: JSON.stringify({ name: editForm.name, category: editForm.category, price: parseFloat(editForm.price), quantity: parseInt(editForm.quantity), description: editForm.description }) });
      if (!res.ok) throw new Error('Failed to update product.');
      setSuccess('Product updated successfully!');
      setEditingId(null); setEditForm({});
      fetchMyProducts();
    } catch (err) { setError(err.message); }
    finally { setIsSaving(false); }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = products.reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0);
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const lowStock   = products.filter(p => p.quantity > 0 && p.quantity < 5).length;

  const alreadyApplied = (contractId) => myContracts.some(c => c.id === contractId);

  const activeContracts     = myContracts.filter(c => c.status === 'ACTIVE');
  const pendingApplications = myContracts.filter(c => c.status === 'APPLIED');
  const totalEarnings       = myContracts.filter(c => c.status === 'ACTIVE' || c.status === 'COMPLETED').reduce((s, c) => s + (c.monthlyPrice || 0) * (c.durationMonths || 0), 0);

  const inlineInput = (field, placeholder, type = 'text') => (
    <input type={type} value={editForm[field] ?? ''} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))} placeholder={placeholder}
      style={{ width: '100%', padding: '7px 10px', borderRadius: 8, background: M3.bg, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
      onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline}
    />
  );

  const headerTitle = {
    listings: 'My Listings', post: 'Post New Item', analytics: 'Analytics',
    contracts: 'Contracts', settings: 'Settings',
  };
  const headerSub = {
    listings: `${products.length} product${products.length !== 1 ? 's' : ''} listed`,
    post: 'Fill in the details to list a new product',
    analytics: 'Your performance overview',
    contracts: `${openRequests.length} open requests · ${myContracts.length} my contracts`,
    settings: 'Manage your account',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: M3.bg, fontFamily: "'Google Sans', 'Roboto', system-ui, sans-serif", color: M3.text }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 256, background: M3.surface, borderRight: `1px solid ${M3.outline}`, display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 20 }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: `1px solid ${M3.outlineVar}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${M3.farmerCont}, #059669)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 1px ${M3.farmer}44, 0 4px 12px #05966944` }}>
              <Sprout size={20} color={M3.farmer} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: M3.text, letterSpacing: '-0.3px' }}>DirectRoot</p>
              <p style={{ fontSize: 11, color: M3.farmer, fontWeight: 600, marginTop: 1 }}>Farmer Portal</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 8px', marginBottom: 6 }}>Menu</p>
          {[
            { tab: 'listings',   icon: List,          label: 'My Listings' },
            { tab: 'post',       icon: Plus,          label: 'Post New Item' },
            { tab: 'contracts',  icon: FileSignature, label: 'Contracts' },
            { tab: 'analytics',  icon: BarChart3,     label: 'Analytics' },
            { tab: 'settings',   icon: Settings,      label: 'Settings' },
          ].map(({ tab, icon: Icon, label }) => {
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', borderRadius: 14, border: 'none', cursor: 'pointer', background: active ? `${M3.farmer}18` : 'transparent', color: active ? M3.farmer : M3.textMed, fontSize: 14, fontWeight: active ? 700 : 500, borderLeft: active ? `2px solid ${M3.farmer}` : '2px solid transparent', transition: 'all 0.15s', textAlign: 'left' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = M3.outlineVar; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} /><span>{label}</span>
                {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            );
          })}

          <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: M3.outlineVar, border: `1px solid ${M3.outline}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Quick Stats</p>
            {[
              { label: 'Listed',       value: products.length,          color: M3.farmer },
              { label: 'Low Stock',    value: lowStock,                 color: M3.yellow },
              { label: 'Out of Stock', value: outOfStock,               color: M3.error },
              { label: 'Contracts',    value: activeContracts.length,   color: M3.primary },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < 3 ? 10 : 0 }}>
                <span style={{ fontSize: 12, color: M3.textLow }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </nav>

        <div style={{ padding: '16px 12px', borderTop: `1px solid ${M3.outlineVar}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: M3.outlineVar, marginBottom: 8, border: `1px solid ${M3.outline}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: `linear-gradient(135deg, ${M3.farmerCont}, #059669)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: M3.farmer }}>
              {user?.username?.substring(0, 2).toUpperCase() || 'FA'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username || 'Farmer'}</p>
              <p style={{ fontSize: 11, color: M3.farmer }}>Farmer</p>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'transparent', color: M3.error, fontSize: 13, fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.background = `${M3.errorCont}66`}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} /> Sign out
          </button>
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
            {activeTab === 'listings' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: '8px 14px', width: 220 }}>
                  <Search size={14} color={M3.textLow} />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." style={{ background: 'none', border: 'none', outline: 'none', color: M3.text, fontSize: 13, flex: 1, fontFamily: 'inherit' }} />
                  {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.textLow, display: 'flex' }}><X size={12} /></button>}
                </div>
                <button onClick={fetchMyProducts} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}>
                  <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </>
            )}
            {activeTab === 'contracts' && (
              <button onClick={() => { fetchOpenRequests(); fetchMyFarmerContracts(); }} style={{ width: 40, height: 40, borderRadius: 20, background: M3.surfaceVar, border: `1px solid ${M3.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: M3.textMed }}>
                <RefreshCw size={15} className={isRequestsLoading ? 'animate-spin' : ''} />
              </button>
            )}
            {(activeTab === 'listings' || activeTab === 'post') && (
              <button onClick={() => { setActiveTab(activeTab === 'listings' ? 'post' : 'listings'); cancelEdit(); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 20, background: activeTab === 'listings' ? M3.farmerCont : M3.outlineVar, border: `1px solid ${activeTab === 'listings' ? M3.farmer + '44' : M3.outline}`, color: activeTab === 'listings' ? M3.farmer : M3.textMed, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {activeTab === 'listings' ? <><Plus size={15} /> Post New</> : <><List size={15} /> My Listings</>}
              </button>
            )}
          </div>
        </header>

        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 14, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertCircle size={15} />{error}</div>
              <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.error }}><X size={15} /></button>
            </div>
          )}
          {success && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 14, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={15} />{success}</div>
              <button onClick={() => setSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.green }}><X size={15} /></button>
            </div>
          )}

          {/* ── Listings ── */}
          {activeTab === 'listings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Total Listed',      value: products.length,             sub: 'Products on marketplace', icon: Wheat,      accent: M3.farmer },
                  { label: 'Marketplace Value', value: `$${totalValue.toFixed(2)}`, sub: 'Price × quantity',        icon: TrendingUp, accent: M3.primary },
                  { label: 'Needs Attention',   value: outOfStock + lowStock,       sub: `${outOfStock} out · ${lowStock} low`, icon: ShoppingBag, accent: outOfStock + lowStock > 0 ? M3.error : M3.green },
                ].map((s, i) => (
                  <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '20px 20px 0 0' }} />
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.accent}22`, border: `1px solid ${s.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={18} color={s.accent} /></div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#163420', border: '1px solid #1a4a2a', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}><ArrowUpRight size={10} />Active</div>
                    </div>
                    <p style={{ fontSize: 28, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px' }}>{s.value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed, marginTop: 5 }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>All Products{searchQuery && <span style={{ fontSize: 12, color: M3.textLow, fontWeight: 400, marginLeft: 8 }}>— {filteredProducts.length} results for "{searchQuery}"</span>}</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{products.length} total listings</p></div>
                  <button onClick={() => setActiveTab('post')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 20, background: M3.farmerCont, border: `1px solid ${M3.farmer}44`, color: M3.farmer, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><Plus size={14} /> Post New</button>
                </div>
                {isLoading ? <div style={{ padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}><Loader2 size={28} color={M3.farmer} className="animate-spin" /><p style={{ fontSize: 12, color: M3.textLow }}>Loading...</p></div>
                  : filteredProducts.length === 0 ? <div style={{ padding: 64, textAlign: 'center' }}><Wheat size={40} color={M3.textLow} style={{ margin: '0 auto 14px' }} /><p style={{ fontSize: 14, color: M3.textLow, fontWeight: 600 }}>{searchQuery ? `No products matching "${searchQuery}"` : 'No products listed yet'}</p>{!searchQuery && <button onClick={() => setActiveTab('post')} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 20, background: M3.farmerCont, border: `1px solid ${M3.farmer}44`, color: M3.farmer, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}><Plus size={14} /> Post First Item</button>}</div>
                  : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead><tr style={{ background: M3.surfaceVar }}>{['Product','Category','Price','Stock','Listed','Actions'].map((h, i) => <th key={h} style={{ padding: '11px 20px', textAlign: i === 4 ? 'right' : 'left', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filteredProducts.map((p, i) => {
                          const isEditing = editingId === p.id;
                          return (
                            <tr key={p.id ?? i} style={{ borderTop: `1px solid ${M3.outlineVar}`, background: isEditing ? `${M3.farmer}08` : 'transparent', transition: 'background 0.15s' }} onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = M3.outlineVar; }} onMouseLeave={e => { if (!isEditing) e.currentTarget.style.background = 'transparent'; }}>
                              <td style={{ padding: '14px 20px' }}>{isEditing ? <div style={{ position: 'relative' }}><Package size={13} color={M3.textLow} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />{inlineInput('name', 'Product name')}</div> : <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: `${M3.farmer}18`, border: `1px solid ${M3.farmer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: M3.farmer }}>{p.name?.[0]?.toUpperCase()}</div><div><p style={{ fontWeight: 700, color: M3.text }}>{p.name}</p>{p.description && <p style={{ fontSize: 11, color: M3.textLow, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</p>}</div></div>}</td>
                              <td style={{ padding: '14px 20px' }}>{isEditing ? <select value={editForm.category || ''} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} style={{ padding: '7px 10px', borderRadius: 8, background: M3.bg, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 12, outline: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select> : <CatChip category={p.category} />}</td>
                              <td style={{ padding: '14px 20px' }}>{isEditing ? <div style={{ position: 'relative', width: 90 }}><DollarSign size={12} color={M3.textLow} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }} /><input type="number" min="0" step="0.01" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} style={{ width: '100%', padding: '7px 8px 7px 24px', borderRadius: 8, background: M3.bg, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline} /></div> : <span style={{ fontSize: 14, fontWeight: 800, color: M3.farmer }}>${Number(p.price).toFixed(2)}</span>}</td>
                              <td style={{ padding: '14px 20px' }}>{isEditing ? <div style={{ position: 'relative', width: 80 }}><Hash size={12} color={M3.textLow} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }} /><input type="number" min="0" value={editForm.quantity || ''} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} style={{ width: '100%', padding: '7px 8px 7px 24px', borderRadius: 8, background: M3.bg, border: `1px solid ${M3.outline}`, color: M3.text, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline} /></div> : p.quantity === 0 ? <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${M3.errorCont}66`, color: M3.error, border: `1px solid ${M3.error}33` }}>Out of stock</span> : p.quantity < 5 ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 13, fontWeight: 700, color: M3.yellow }}>{p.quantity}</span><span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: `${M3.yellow}18`, color: M3.yellow, border: `1px solid ${M3.yellow}33` }}>LOW</span></div> : <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{p.quantity}</span><div style={{ width: 44, height: 3, background: M3.outlineVar, borderRadius: 99, overflow: 'hidden' }}><div style={{ width: `${Math.min((p.quantity / 100) * 100, 100)}%`, height: '100%', background: M3.farmer, borderRadius: 99 }} /></div></div>}</td>
                              <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: 11, color: M3.textLow }}>{isEditing ? <span style={{ fontSize: 11, color: M3.textLow }}>Editing...</span> : p.createdAt ? new Date(p.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</td>
                              <td style={{ padding: '14px 20px' }}>{isEditing ? <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><button onClick={() => saveEdit(p.id)} disabled={isSaving} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, background: M3.farmerCont, border: `1px solid ${M3.farmer}44`, color: M3.farmer, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>{isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}{isSaving ? 'Saving' : 'Save'}</button><button onClick={cancelEdit} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, background: M3.outlineVar, border: `1px solid ${M3.outline}`, color: M3.textMed, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><XCircle size={12} /> Cancel</button></div> : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><button onClick={() => startEdit(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, background: `${M3.primary}18`, border: `1px solid ${M3.primary}30`, color: M3.primary, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><Pencil size={12} /> Edit</button><button onClick={async () => { if (!confirm(`Delete "${p.name}"?`)) return; try { const res = await fetch(`${API_BASE_URL}/products/${p.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } }); if (!res.ok) throw new Error('Failed to delete product.'); setSuccess(`"${p.name}" deleted.`); fetchMyProducts(); } catch (err) { setError(err.message); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 10, background: `${M3.errorCont}44`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><XCircle size={12} /> Delete</button></div>}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
              </div>
            </div>
          )}

          {/* ── Post ── */}
          {activeTab === 'post' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
              <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 12, background: `${M3.farmer}18`, border: `1px solid ${M3.farmer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} color={M3.farmer} /></div>
                  <div><p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>New Product Listing</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Fill in all required fields</p></div>
                </div>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    { label: 'Product Name *', name: 'name', icon: Package, placeholder: 'e.g. Fresh Tomatoes', type: 'text' },
                  ].map(field => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{field.label}</label>
                      <div style={{ position: 'relative' }}><field.icon size={15} color={M3.textLow} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} /><input name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} style={inputStyle()} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline} /></div>
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Category *</label>
                    <div style={{ position: 'relative' }}><Tag size={15} color={M3.textLow} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} /><select name="category" value={form.category} onChange={handleChange} style={{ ...inputStyle(), appearance: 'none', cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline}><option value="">Select a category</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[{ label: 'Price (USD) *', name: 'price', icon: DollarSign, placeholder: '0.00', type: 'number' }, { label: 'Quantity *', name: 'quantity', icon: Hash, placeholder: '0', type: 'number' }].map(field => (
                      <div key={field.name}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{field.label}</label>
                        <div style={{ position: 'relative' }}><field.icon size={15} color={M3.textLow} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} /><input name={field.name} type={field.type} min="0" step={field.name === 'price' ? '0.01' : '1'} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} style={inputStyle()} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline} /></div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Description</label>
                    <div style={{ position: 'relative' }}><FileText size={15} color={M3.textLow} style={{ position: 'absolute', left: 12, top: 13 }} /><textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your product..." rows={4} style={{ ...inputStyle(), padding: '12px 12px 12px 38px', resize: 'none', lineHeight: 1.6 }} onFocus={e => e.target.style.borderColor = M3.farmer} onBlur={e => e.target.style.borderColor = M3.outline} /></div>
                  </div>
                  <button onClick={handleSubmit} disabled={isSubmitting} style={{ width: '100%', padding: '13px', borderRadius: 14, border: `1px solid ${M3.farmer}44`, background: isSubmitting ? M3.outlineVar : M3.farmerCont, color: M3.farmer, fontSize: 14, fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}{isSubmitting ? 'Posting...' : 'Post to Marketplace'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${M3.outlineVar}` }}><p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>Live Preview</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>How buyers will see your product</p></div>
                  <div style={{ padding: 16 }}>
                    <div style={{ borderRadius: 16, border: `1px solid ${M3.outline}`, overflow: 'hidden', background: M3.surfaceVar }}>
                      <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${M3.outlineVar}` }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: `${M3.farmer}18`, border: `1px solid ${M3.farmer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: M3.farmer }}>{form.name?.[0]?.toUpperCase() || '?'}</div>{form.category && <CatChip category={form.category} />}</div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: form.name ? M3.text : M3.textLow }}>{form.name || 'Product name...'}</p>
                        {form.description && <p style={{ fontSize: 12, color: M3.textLow, marginTop: 4, lineHeight: 1.5 }}>{form.description}</p>}
                      </div>
                      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div><p style={{ fontSize: 20, fontWeight: 800, color: form.price ? M3.farmer : M3.textLow }}>{form.price ? `$${parseFloat(form.price || 0).toFixed(2)}` : '$0.00'}</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{form.quantity ? `${form.quantity} available` : 'Qty not set'}</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ fontSize: 10, color: M3.textLow }}>by</p><p style={{ fontSize: 12, fontWeight: 700, color: M3.farmer }}>{user?.username}</p></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, marginBottom: 12 }}>💡 Tips for better listings</p>
                  {['Use clear, descriptive product names', 'Add freshness & origin info in description', 'Keep quantity updated regularly', 'Price competitively to attract buyers'].map((tip, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < 3 ? 10 : 0 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: M3.farmer, marginTop: 5, flexShrink: 0 }} />
                      <p style={{ fontSize: 12, color: M3.textLow, lineHeight: 1.5 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CONTRACTS TAB ── */}
          {activeTab === 'contracts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {contractError && (
                <div style={{ padding: '12px 16px', borderRadius: 14, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertCircle size={15} />{contractError}</div>
                  <button onClick={() => setContractError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.error }}><X size={15} /></button>
                </div>
              )}
              {contractSuccess && (
                <div style={{ padding: '12px 16px', borderRadius: 14, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={15} />{contractSuccess}</div>
                  <button onClick={() => setContractSuccess(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: M3.green }}><X size={15} /></button>
                </div>
              )}

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Active Contracts',     value: activeContracts.length,     sub: 'Currently running',   accent: M3.farmer },
                  { label: 'Pending Applications', value: pendingApplications.length,  sub: 'Waiting for buyer',   accent: M3.yellow },
                  { label: 'Total Earnings',       value: `$${totalEarnings.toFixed(0)}`, sub: 'From all contracts', accent: M3.primary },
                ].map((s, i) => (
                  <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '20px 20px 0 0' }} />
                    <p style={{ fontSize: 28, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: 6 }}>{s.value}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Sub-tab toggle */}
              <div style={{ display: 'flex', gap: 4, background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 16, padding: 4, alignSelf: 'flex-start' }}>
                {[
                  { key: 'browse', label: `Browse Requests (${openRequests.length})` },
                  { key: 'mine',   label: `My Contracts (${myContracts.length})` },
                ].map(t => (
                  <button key={t.key} onClick={() => setContractsSubTab(t.key)} style={{ padding: '9px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, background: contractsSubTab === t.key ? M3.farmerCont : 'transparent', color: contractsSubTab === t.key ? M3.farmer : M3.textMed, transition: 'all 0.15s' }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Browse open requests */}
              {contractsSubTab === 'browse' && (
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', borderBottom: `1px solid ${M3.outlineVar}` }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>Open Hiring Requests</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>Buyers looking for farmers — apply to get hired</p>
                  </div>
                  {isRequestsLoading ? (
                    <div style={{ padding: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}><Loader2 size={28} color={M3.farmer} className="animate-spin" /><p style={{ fontSize: 12, color: M3.textLow }}>Loading requests...</p></div>
                  ) : openRequests.length === 0 ? (
                    <div style={{ padding: 64, textAlign: 'center' }}>
                      <FileSignature size={40} color={M3.textLow} style={{ margin: '0 auto 14px' }} />
                      <p style={{ fontSize: 14, color: M3.textLow, fontWeight: 600 }}>No open requests right now</p>
                      <p style={{ fontSize: 12, color: M3.textLow, marginTop: 6 }}>Check back later — buyers post new requests regularly.</p>
                    </div>
                  ) : (
                    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                      {openRequests.map(req => {
                        const applied = alreadyApplied(req.id);
                        return (
                          <div key={req.id} style={{ background: M3.surfaceVar, border: `1px solid ${applied ? M3.farmer + '55' : M3.outline}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                            {applied && <div style={{ height: 3, background: M3.farmer }} />}
                            <div style={{ padding: '16px 18px' }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div><p style={{ fontSize: 15, fontWeight: 700, color: M3.text }}>{req.cropType}</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>by {req.buyerUsername}</p></div>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: '#713f1222', color: '#fde047', border: '1px solid #713f1255' }}>Open</span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                                {[{ label: 'Monthly Qty', value: `${req.monthlyQuantity} units` }, { label: 'Price/month', value: `$${req.monthlyPrice}` }, { label: 'Duration', value: `${req.durationMonths} months` }, { label: 'Delivery', value: req.deliveryFrequency }].map((item, i) => (
                                  <div key={i} style={{ padding: '8px 10px', background: M3.outlineVar, borderRadius: 10 }}>
                                    <p style={{ fontSize: 10, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.label}</p>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: M3.text }}>{item.value}</p>
                                  </div>
                                ))}
                              </div>
                              <div style={{ padding: '10px 12px', borderRadius: 12, background: `${M3.farmer}10`, border: `1px solid ${M3.farmer}33`, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 11, color: M3.textLow }}>Total contract value</span>
                                <span style={{ fontSize: 16, fontWeight: 800, color: M3.farmer }}>${((req.monthlyPrice || 0) * (req.durationMonths || 0)).toFixed(0)}</span>
                              </div>
                              {req.notes && <p style={{ fontSize: 11, color: M3.textLow, fontStyle: 'italic', marginBottom: 12 }}>"{req.notes}"</p>}
                              <button onClick={() => !applied && handleApply(req.id)} disabled={applied} style={{ width: '100%', padding: '11px', borderRadius: 12, background: M3.farmerCont, border: `1px solid ${M3.farmer}44`, color: M3.farmer, fontSize: 13, fontWeight: 700, cursor: applied ? 'not-allowed' : 'pointer', opacity: applied ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                                {applied ? <><CheckCircle size={14} /> Applied</> : 'Apply Now'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* My contracts */}
              {contractsSubTab === 'mine' && (
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', borderBottom: `1px solid ${M3.outlineVar}` }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: M3.text }}>My Contracts</p>
                    <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>Contracts you applied for or are working on</p>
                  </div>
                  {myContracts.length === 0 ? (
                    <div style={{ padding: 64, textAlign: 'center' }}>
                      <FileSignature size={40} color={M3.textLow} style={{ margin: '0 auto 14px' }} />
                      <p style={{ fontSize: 14, color: M3.textLow, fontWeight: 600 }}>No contracts yet</p>
                      <p style={{ fontSize: 12, color: M3.textLow, marginTop: 6 }}>Browse open requests and apply to get your first contract!</p>
                      <button onClick={() => setContractsSubTab('browse')} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 20, background: M3.farmerCont, border: `1px solid ${M3.farmer}44`, color: M3.farmer, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Browse Requests</button>
                    </div>
                  ) : (
                    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[...myContracts].reverse().map(c => (
                        <div key={c.id} style={{ borderRadius: 16, border: `1px solid ${M3.outline}`, overflow: 'hidden', background: M3.surfaceVar }}>
                          <div style={{ padding: '13px 18px', background: M3.outlineVar, borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: M3.textLow, fontFamily: 'monospace' }}>CONTRACT #{c.id}</span>
                              <ContractStatusBadge status={c.status} />
                            </div>
                            <span style={{ fontSize: 11, color: M3.textLow }}>Buyer: <strong style={{ color: M3.text }}>{c.buyerUsername}</strong></span>
                          </div>
                          <div style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                              {[{ label: 'Crop', value: c.cropType }, { label: 'Qty/month', value: `${c.monthlyQuantity} units` }, { label: 'Price/month', value: `$${c.monthlyPrice}` }, { label: 'Duration', value: `${c.durationMonths} months` }].map((item, i) => (
                                <div key={i}>
                                  <p style={{ fontSize: 10, fontWeight: 700, color: M3.textLow, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{item.label}</p>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{item.value}</p>
                                </div>
                              ))}
                            </div>
                            {c.status === 'ACTIVE' && c.startDate && (
                              <div style={{ padding: '10px 14px', borderRadius: 12, background: `${M3.farmer}10`, border: `1px solid ${M3.farmer}33`, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <p style={{ fontSize: 10, color: M3.textLow, marginBottom: 2 }}>Contract period</p>
                                  <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed }}>{new Date(c.startDate).toLocaleDateString([], { day: '2-digit', month: 'short' })} → {new Date(c.endDate).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <p style={{ fontSize: 10, color: M3.textLow }}>Total value</p>
                                  <p style={{ fontSize: 16, fontWeight: 800, color: M3.farmer }}>${((c.monthlyPrice || 0) * (c.durationMonths || 0)).toFixed(0)}</p>
                                </div>
                              </div>
                            )}
                            {c.notes && <p style={{ fontSize: 12, color: M3.textLow, fontStyle: 'italic', marginBottom: 12 }}>"{c.notes}"</p>}
                            {(c.status === 'ACTIVE' || c.status === 'APPLIED') && (
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => handleFarmerCancel(c.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: M3.outlineVar, border: `1px solid ${M3.outline}`, color: M3.textLow, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Analytics ── */}
          {activeTab === 'analytics' && (() => {
            const farmerItems = orders.flatMap(o => (o.items || []).filter(i => i.farmerUsername === user?.username));
            const totalRevenue   = farmerItems.reduce((s, i) => s + (i.priceAtPurchase || 0) * (i.quantity || 0), 0);
            const totalOrders    = orders.filter(o => (o.items || []).some(i => i.farmerUsername === user?.username)).length;
            const totalUnitsSold = farmerItems.reduce((s, i) => s + (i.quantity || 0), 0);
            const salesMap = farmerItems.reduce((acc, i) => { acc[i.productName] = (acc[i.productName] || 0) + (i.quantity || 0); return acc; }, {});
            const bestSelling = Object.entries(salesMap).map(([name, units]) => ({ name, units })).sort((a, b) => b.units - a.units).slice(0, 6);
            const catMap = products.reduce((acc, p) => { const c = p.category || 'Other'; acc[c] = (acc[c] || 0) + 1; return acc; }, {});
            const categoryData = Object.entries(catMap).map(([name, count]) => ({ name, count }));
            const stockData = products.map(p => ({ name: p.name?.length > 10 ? p.name.slice(0, 10) + '…' : p.name, stock: p.quantity }));
            const DONUT_COLORS = ['#34d399', '#c3c6ff', '#f5c518', '#ffb4ab', '#7dd3fc', '#fdba74'];
            const ChartTooltip = ({ active, payload, label }) => { if (!active || !payload?.length) return null; return (<div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 10, padding: '8px 12px' }}>{label && <p style={{ fontSize: 11, color: M3.textLow, marginBottom: 3 }}>{label}</p>}{payload.map((p, i) => (<p key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color || M3.farmer }}>{p.name}: {p.value}</p>))}</div>); };
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {[{ label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, sub: 'From all orders', accent: M3.farmer, icon: TrendingUp }, { label: 'Orders Received', value: totalOrders, sub: 'Containing your products', accent: M3.primary, icon: ShoppingBag }, { label: 'Units Sold', value: totalUnitsSold, sub: 'Total items purchased', accent: M3.yellow, icon: Package }].map((s, i) => (
                    <div key={i} style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.accent, borderRadius: '20px 20px 0 0' }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}><div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.accent}22`, border: `1px solid ${s.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={18} color={s.accent} /></div><div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#163420', border: '1px solid #1a4a2a', padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: M3.green }}><ArrowUpRight size={10} />Live</div></div>
                      {isOrdersLoading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}><Loader2 size={20} color={s.accent} className="animate-spin" /></div> : <p style={{ fontSize: 28, fontWeight: 800, color: M3.text, lineHeight: 1, letterSpacing: '-0.5px' }}>{s.value}</p>}
                      <p style={{ fontSize: 12, fontWeight: 600, color: M3.textMed, marginTop: 5 }}>{s.label}</p>
                      <p style={{ fontSize: 11, color: M3.textLow, marginTop: 2 }}>{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Best Selling Products</p>
                    <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 20 }}>Units sold per product</p>
                    {isOrdersLoading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Loader2 size={24} color={M3.farmer} className="animate-spin" /></div> : bestSelling.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, padding: 40, fontSize: 13 }}>No orders yet</p> : (<ResponsiveContainer width="100%" height={220}><BarChart data={bestSelling} barSize={32}><XAxis dataKey="name" tick={{ fill: M3.textLow, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: M3.textLow, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} cursor={{ fill: `${M3.farmer}10` }} /><Bar dataKey="units" name="Units Sold" fill={M3.farmer} radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>)}
                  </div>
                  <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Category Breakdown</p>
                    <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 20 }}>Products listed per category</p>
                    {categoryData.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, padding: 40, fontSize: 13 }}>No products listed</p> : (<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}><ResponsiveContainer width={180} height={180}><PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="count">{categoryData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />)}</Pie><Tooltip content={<ChartTooltip />} /></PieChart></ResponsiveContainer><div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{categoryData.map((d, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} /><div><p style={{ fontSize: 12, fontWeight: 700, color: M3.text }}>{d.count} products</p><p style={{ fontSize: 11, color: M3.textLow }}>{d.name}</p></div></div>))}</div></div>)}
                  </div>
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 20, padding: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: M3.text, marginBottom: 4 }}>Stock Levels</p>
                  <p style={{ fontSize: 12, color: M3.textLow, marginBottom: 20 }}>Current quantity available per product</p>
                  {stockData.length === 0 ? <p style={{ textAlign: 'center', color: M3.textLow, padding: 40, fontSize: 13 }}>No products listed</p> : (<><ResponsiveContainer width="100%" height={220}><BarChart data={stockData} barSize={36}><XAxis dataKey="name" tick={{ fill: M3.textLow, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: M3.textLow, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} cursor={{ fill: `${M3.primary}10` }} /><Bar dataKey="stock" name="Stock" radius={[8, 8, 0, 0]}>{stockData.map((entry, i) => <Cell key={i} fill={entry.stock === 0 ? M3.error : entry.stock < 5 ? M3.yellow : M3.farmer} />)}</Bar></BarChart></ResponsiveContainer><div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 12 }}>{[{ color: M3.farmer, label: 'Good stock' }, { color: M3.yellow, label: 'Low stock (< 5)' }, { color: M3.error, label: 'Out of stock' }].map((l, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} /><span style={{ fontSize: 11, color: M3.textLow }}>{l.label}</span></div>))}</div></>)}
                </div>
              </div>
            );
          })()}

          {/* ── Settings ── */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start', maxWidth: 900 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ height: 80, background: `linear-gradient(135deg, ${M3.farmerCont}cc, #065f4688, #022c22)`, borderBottom: `1px solid ${M3.outline}` }} />
                  <div style={{ padding: '0 24px 24px', position: 'relative' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: `linear-gradient(135deg, ${M3.farmerCont}, #059669)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: M3.farmer, border: `3px solid ${M3.surface}`, marginTop: -36, marginBottom: 12, boxShadow: `0 4px 20px ${M3.farmerCont}99` }}>{user?.username?.substring(0, 2).toUpperCase() || 'FA'}</div>
                    <p style={{ fontSize: 18, fontWeight: 800, color: M3.text }}>{user?.username || 'Farmer'}</p>
                    <p style={{ fontSize: 12, color: M3.textLow, marginTop: 3 }}>{user?.username}@directroot.com</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: M3.farmerCont, color: M3.farmer, border: `1px solid ${M3.farmer}44` }}>FARMER</span><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 6, height: 6, background: M3.green, borderRadius: '50%', boxShadow: `0 0 6px ${M3.green}` }} /><span style={{ fontSize: 11, color: M3.green, fontWeight: 600 }}>Active</span></div></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, marginTop: 18, background: M3.outline, borderRadius: 14, overflow: 'hidden' }}>{[{ label: 'Products', value: products.length }, { label: 'Low Stock', value: lowStock }, { label: 'Out of Stock', value: outOfStock }].map((s, i) => (<div key={i} style={{ background: M3.surfaceVar, padding: '12px 0', textAlign: 'center' }}><p style={{ fontSize: 18, fontWeight: 800, color: i === 0 ? M3.farmer : i === 1 ? M3.yellow : M3.error }}>{s.value}</p><p style={{ fontSize: 10, color: M3.textLow, marginTop: 2 }}>{s.label}</p></div>))}</div>
                  </div>
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 22px', borderBottom: `1px solid ${M3.outlineVar}`, display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 34, height: 34, borderRadius: 11, background: `${M3.farmer}18`, border: `1px solid ${M3.farmer}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={15} color={M3.farmer} /></div><div><p style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>Change Password</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Update your account password</p></div></div>
                  <div style={{ padding: 22 }}>
                    {pwError && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: `${M3.errorCont}88`, border: `1px solid ${M3.error}44`, color: M3.error, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}><AlertTriangle size={13} /> {pwError}</div>}
                    {pwSuccess && <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: `${M3.greenCont}88`, border: `1px solid ${M3.green}44`, color: M3.green, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}><CheckCircle size={13} /> {pwSuccess}</div>}
                    <FarmerPwInput label="Current Password" placeholder="Enter current password" value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))} show={showPw.current} onToggleShow={() => setShowPw(s => ({ ...s, current: !s.current }))} />
                    <FarmerPwInput label="New Password" placeholder="Min. 6 characters" value={pwForm.newPw} onChange={v => setPwForm(f => ({ ...f, newPw: v }))} show={showPw.newPw} onToggleShow={() => setShowPw(s => ({ ...s, newPw: !s.newPw }))} />
                    <FarmerPwInput label="Confirm New Password" placeholder="Re-enter new password" value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))} show={showPw.confirm} onToggleShow={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))} />
                    <button onClick={handleChangePassword} disabled={isPwLoading} style={{ width: '100%', padding: '12px', borderRadius: 14, background: isPwLoading ? M3.outlineVar : M3.farmerCont, border: `1px solid ${M3.farmer}44`, color: M3.farmer, fontSize: 13, fontWeight: 700, cursor: isPwLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>{isPwLoading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}{isPwLoading ? 'Updating...' : 'Update Password'}</button>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: 22 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, marginBottom: 16 }}>Account Information</p>
                  {[{ label: 'Username', value: user?.username || '—' }, { label: 'Role', value: 'Farmer' }, { label: 'Total Products', value: products.length }, { label: 'Total Value', value: `$${totalValue.toFixed(2)}` }].map((row, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < 4 ? `1px solid ${M3.outlineVar}` : 'none' }}><span style={{ fontSize: 12, color: M3.textLow }}>{row.label}</span><span style={{ fontSize: 13, fontWeight: 700, color: M3.text }}>{row.value}</span></div>))}
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.outline}`, borderRadius: 24, padding: 22 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: M3.text, marginBottom: 14 }}>🔒 Password Security Tips</p>
                  {['Use at least 8 characters', 'Mix uppercase, lowercase and numbers', 'Avoid using your username as password', 'Change your password regularly'].map((tip, i) => (<div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < 3 ? 10 : 0 }}><div style={{ width: 5, height: 5, borderRadius: '50%', background: M3.farmer, marginTop: 5, flexShrink: 0 }} /><p style={{ fontSize: 12, color: M3.textLow, lineHeight: 1.5 }}>{tip}</p></div>))}
                </div>
                <div style={{ background: M3.surface, border: `1px solid ${M3.error}55`, borderRadius: 24, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 22px', borderBottom: `1px solid ${M3.error}22`, background: `linear-gradient(135deg, ${M3.errorCont}44, ${M3.errorCont}11)`, display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 10, background: `${M3.error}18`, border: `1px solid ${M3.error}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={14} color={M3.error} /></div><div><p style={{ fontSize: 13, fontWeight: 700, color: M3.error }}>Danger Zone</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 1 }}>Irreversible actions</p></div></div>
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ borderRadius: 14, border: `1px solid ${M3.outline}`, overflow: 'hidden' }}><div style={{ padding: '13px 16px', background: M3.outlineVar }}><p style={{ fontSize: 13, fontWeight: 600, color: M3.text }}>Sign Out</p><p style={{ fontSize: 11, color: M3.textLow, marginTop: 3 }}>End your current session.</p></div><div style={{ padding: '10px 16px', borderTop: `1px solid ${M3.outline}`, display: 'flex', justifyContent: 'flex-end' }}><button onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: `1px solid ${M3.outline}`, background: M3.outlineVar, color: M3.textMed, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}><LogOut size={12} /> Sign Out</button></div></div>
                    <div style={{ borderRadius: 14, border: `1px solid ${M3.error}44`, overflow: 'hidden' }}>
                      <div style={{ padding: '13px 16px', background: `${M3.errorCont}22` }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: M3.error }}>Delete My Account</p>
                        <p style={{ fontSize: 11, color: M3.textLow, marginTop: 3, lineHeight: 1.5 }}>Permanently delete your account <strong style={{ color: M3.textMed }}>({user?.username})</strong> and all your listings.</p>
                        <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: `${M3.error}11`, border: `1px solid ${M3.error}22` }}><p style={{ fontSize: 11, color: M3.error, fontWeight: 600 }}>{products.length > 0 ? `⚠ You must remove all ${products.length} product${products.length !== 1 ? 's' : ''} before deleting your account.` : '✓ No products listed. You can safely delete your account.'}</p></div>
                      </div>
                      <div style={{ padding: '10px 16px', borderTop: `1px solid ${M3.error}22`, display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={async () => { if (products.length > 0) { setError(`Remove all ${products.length} products first.`); setActiveTab('listings'); return; } if (!confirm(`Delete "${user?.username}"? Permanent.`)) return; try { const res = await fetch(`${API_BASE_URL}/auth/delete-account`, { method: 'DELETE', headers: { Authorization: `Bearer ${user?.token}` } }); if (!res.ok) { setError('Failed to delete account.'); return; } onLogout(); } catch { setError('Failed to delete account.'); } }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: `1px solid ${M3.error}55`, background: `${M3.errorCont}66`, color: M3.error, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                          <AlertTriangle size={12} /> Delete My Account
                        </button>
                      </div>
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