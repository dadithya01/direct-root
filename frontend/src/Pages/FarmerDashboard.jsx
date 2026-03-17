import React, { useState, useEffect } from 'react';
import {
  Sprout, LogOut, Plus, Package, List, Loader2,
  AlertCircle, CheckCircle, X, DollarSign, Hash,
  Tag, FileText, RefreshCw, Wheat,
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api/v1";

const CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Other'];

const FarmerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('listings');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    name: '', category: '', price: '', quantity: '', description: '',
  });

  const fetchMyProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/my`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const result = await response.json();
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setError('Failed to load your products.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price || !form.quantity) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          description: form.description,
        }),
      });
      if (!response.ok) throw new Error('Failed to post product.');
      setSuccess('Product listed successfully!');
      setForm({ name: '', category: '', price: '', quantity: '', description: '' });
      fetchMyProducts();
      setTimeout(() => setActiveTab('listings'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (category) => {
    const map = {
      vegetables: 'bg-green-900/20 text-green-400 border-green-700',
      fruits: 'bg-orange-900/20 text-orange-400 border-orange-700',
      grains: 'bg-yellow-900/20 text-yellow-400 border-yellow-700',
      dairy: 'bg-blue-900/20 text-blue-400 border-blue-700',
      meat: 'bg-red-900/20 text-red-400 border-red-700',
      other: 'bg-slate-700/40 text-slate-400 border-slate-600',
    };
    return map[category?.toLowerCase()] || 'bg-slate-700/40 text-slate-400 border-slate-600';
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans text-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <Sprout size={24} />
          </div>
          <span className="font-black tracking-tight text-xl">
            Direct Root
            <span className="text-emerald-400 text-[10px] block font-mono">FARMER_ACCESS</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {[
            { tab: 'listings', icon: List,    label: 'My Listings' },
            { tab: 'post',     icon: Plus,    label: 'Post New Item' },
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-bold text-sm">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-700/40 rounded-2xl p-4 mb-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-xs font-black">
                {user?.username?.substring(0, 2).toUpperCase() || 'FA'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{user?.username || 'Farmer'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">FARMER</p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-black tracking-tight">
            {activeTab === 'listings' ? 'My Listings' : 'Post New Item'}
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            {activeTab === 'listings'
              ? `You have ${products.length} product${products.length !== 1 ? 's' : ''} listed.`
              : 'Fill in the details to list a new product on the marketplace.'}
          </p>
        </header>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-2xl flex items-center justify-between text-red-400 font-bold text-sm">
            <div className="flex items-center gap-3"><AlertCircle size={18} />{error}</div>
            <button onClick={() => setError(null)}><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-700 rounded-2xl flex items-center justify-between text-emerald-400 font-bold text-sm">
            <div className="flex items-center gap-3"><CheckCircle size={18} />{success}</div>
            <button onClick={() => setSuccess(null)}><X size={16} /></button>
          </div>
        )}

        {/* ── LISTINGS TAB ── */}
        {activeTab === 'listings' && (
          <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden">
            <div className="p-8 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-900/40 text-emerald-400 rounded-2xl">
                  <Wheat size={22} />
                </div>
                <h3 className="font-black text-xl">My Products</h3>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchMyProducts}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-2xl text-slate-400 hover:text-emerald-400 transition-all"
                >
                  <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => setActiveTab('post')}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-sm transition-all"
                >
                  <Plus size={16} /> Post New
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-emerald-400" size={36} />
                <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Loading...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-24 text-center">
                <Wheat size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-500 font-mono uppercase text-sm tracking-widest">No products listed yet</p>
                <button
                  onClick={() => setActiveTab('post')}
                  className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-sm transition-all"
                >
                  Post Your First Item
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
                      <th className="px-8 py-5">Product</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Price</th>
                      <th className="px-8 py-5">Qty Left</th>
                      <th className="px-8 py-5 text-right">Listed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-700/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-900/30 border border-emerald-800/40 flex items-center justify-center text-emerald-400 font-black group-hover:bg-emerald-600 group-hover:text-white transition-all">
                              {p.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100">{p.name}</p>
                              {p.description && (
                                <p className="text-[10px] text-slate-500 max-w-[200px] truncate">{p.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${getCategoryColor(p.category)}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-emerald-400 font-black">${Number(p.price).toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`font-bold ${p.quantity > 0 ? 'text-slate-200' : 'text-red-400'}`}>
                            {p.quantity}
                            {p.quantity === 0 && (
                              <span className="ml-2 text-[9px] border border-red-700 rounded px-1 py-0.5 text-red-400">OUT</span>
                            )}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-400">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── POST TAB ── */}
        {activeTab === 'post' && (
          <div className="max-w-2xl">
            <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden">
              <div className="p-8 border-b border-slate-700 flex items-center gap-4">
                <div className="p-3 bg-emerald-900/40 text-emerald-400 rounded-2xl">
                  <Plus size={22} />
                </div>
                <h3 className="font-black text-xl">New Product Listing</h3>
              </div>

              <div className="p-8 space-y-6">

                {/* Name */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Product Name *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Fresh Tomatoes"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-700 border border-slate-600 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-100 placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Category *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-700 border border-slate-600 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-100 appearance-none"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price + Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Price (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-700 border border-slate-600 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                      Quantity *
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input
                        name="quantity"
                        type="number"
                        min="1"
                        value={form.quantity}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-700 border border-slate-600 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                    Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-slate-500" size={16} />
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe your product..."
                      rows={3}
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-700 border border-slate-600 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-100 placeholder:text-slate-500 resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {isSubmitting ? 'Posting...' : 'Post to Marketplace'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerDashboard;