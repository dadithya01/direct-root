import React, { useState, useEffect } from 'react';
import {
  Sprout, LogOut, ShoppingCart, Store, ClipboardList,
  Loader2, AlertCircle, CheckCircle, X, Plus, Minus,
  Trash2, ShoppingBag, RefreshCw, Search,
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api/v1";

const BuyerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('shop');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]); // { product, quantity }
  const [isLoading, setIsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const result = await response.json();
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setError('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    setIsOrdersLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const result = await response.json();
      setOrders(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMyOrders();
  }, []);

  // ── CART HELPERS ──
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev; // max stock
        return prev.map(i => i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId, delta) => {
    setCart(prev => prev
      .map(i => {
        if (i.product.id !== productId) return i;
        const newQty = i.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > i.product.quantity) return i;
        return { ...i, quantity: newQty };
      })
      .filter(Boolean)
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const getCartQty = (productId) => {
    return cart.find(i => i.product.id === productId)?.quantity || 0;
  };

  // ── CHECKOUT ──
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setError(null);
    setSuccess(null);
    try {
      const orderItems = cart.map(i => {
        const productId = i.product.id ?? i.product.productId;
        console.log('product object:', i.product); // ← see what fields exist
        console.log('productId being sent:', productId);
        return { productId, quantity: i.quantity };
      });

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ items: orderItems }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Order failed.');
      }
      setSuccess('Order placed successfully!');
      setCart([]);
      fetchProducts();
      fetchMyOrders();
      setTimeout(() => setActiveTab('orders'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCheckingOut(false);
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

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmerUsername?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans text-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Sprout size={24} />
          </div>
          <span className="font-black tracking-tight text-xl">
            Direct Root
            <span className="text-blue-400 text-[10px] block font-mono">BUYER_ACCESS</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {[
            { tab: 'shop',   icon: Store,         label: 'Shop' },
            { tab: 'orders', icon: ClipboardList,  label: 'My Orders' },
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-bold text-sm">{label}</span>
            </button>
          ))}
        </nav>

        {/* Cart Summary in Sidebar */}
        {cart.length > 0 && (
          <div className="mx-4 mb-4 bg-blue-900/20 border border-blue-700/40 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
                <ShoppingCart size={16} />
                Cart ({cartCount})
              </div>
              <span className="text-emerald-400 font-black text-sm">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto mb-3">
              {cart.map(i => (
                <div key={i.product.id} className="flex justify-between text-[10px] text-slate-400">
                  <span className="truncate max-w-[120px]">{i.product.name}</span>
                  <span>x{i.quantity}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2"
            >
              {isCheckingOut ? <Loader2 size={14} className="animate-spin" /> : <ShoppingBag size={14} />}
              {isCheckingOut ? 'Placing...' : 'Checkout'}
            </button>
          </div>
        )}

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-700/40 rounded-2xl p-4 mb-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xs font-black">
                {user?.username?.substring(0, 2).toUpperCase() || 'BU'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{user?.username || 'Buyer'}</p>
                <p className="text-[10px] text-blue-400 font-mono">BUYER</p>
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
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {activeTab === 'shop' ? 'Marketplace' : 'My Orders'}
            </h1>
            <p className="text-slate-400 font-medium mt-1">
              {activeTab === 'shop'
                ? `${filteredProducts.length} products available from farmers.`
                : `You have placed ${orders.length} order${orders.length !== 1 ? 's' : ''}.`}
            </p>
          </div>
          {activeTab === 'shop' && (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-64 font-medium text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <button
                onClick={fetchProducts}
                className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-blue-400 transition-all"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
              {cart.length > 0 && (
                <button
                  onClick={() => setActiveTab('shop')}
                  className="relative p-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-all"
                >
                  <ShoppingCart size={18} />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
              )}
            </div>
          )}
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

        {/* ── SHOP TAB ── */}
        {activeTab === 'shop' && (
          <div className="flex gap-8">
            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-blue-400" size={36} />
                  <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Loading marketplace...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-24 text-center">
                  <Store size={48} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-500 font-mono uppercase text-sm tracking-widest">No products available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredProducts.map((p) => {
                    const inCart = getCartQty(p.id);
                    const outOfStock = p.quantity === 0;
                    return (
                      <div
                        key={p.id}
                        className={`bg-slate-800 rounded-[2rem] border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          outOfStock ? 'border-slate-700 opacity-60' : 'border-slate-700 hover:border-blue-600/50'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="p-6 border-b border-slate-700">
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-blue-400 font-black text-lg">
                              {p.name?.[0]?.toUpperCase()}
                            </div>
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-xl border ${getCategoryColor(p.category)}`}>
                              {p.category}
                            </span>
                          </div>
                          <h4 className="font-black text-slate-100 text-lg leading-tight">{p.name}</h4>
                          {p.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                          )}
                        </div>

                        {/* Card Footer */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-2xl font-black text-emerald-400">${Number(p.price).toFixed(2)}</p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                {outOfStock ? 'Out of stock' : `${p.quantity} available`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500">by</p>
                              <p className="text-xs font-bold text-emerald-400">{p.farmerUsername}</p>
                            </div>
                          </div>

                          {/* Add to Cart Controls */}
                          {outOfStock ? (
                            <div className="w-full py-3 bg-slate-700 rounded-2xl text-center text-slate-500 font-bold text-sm">
                              Out of Stock
                            </div>
                          ) : inCart === 0 ? (
                            <button
                              onClick={() => addToCart(p)}
                              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                            >
                              <Plus size={16} /> Add to Cart
                            </button>
                          ) : (
                            <div className="flex items-center justify-between bg-slate-700 rounded-2xl p-1">
                              <button
                                onClick={() => updateQty(p.id, -1)}
                                className="w-10 h-10 rounded-xl bg-slate-600 hover:bg-red-600/40 text-slate-300 hover:text-red-400 flex items-center justify-center transition-all"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="font-black text-slate-100">{inCart}</span>
                              <button
                                onClick={() => updateQty(p.id, 1)}
                                disabled={inCart >= p.quantity}
                                className="w-10 h-10 rounded-xl bg-slate-600 hover:bg-blue-600/40 text-slate-300 hover:text-blue-400 disabled:opacity-40 flex items-center justify-center transition-all"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cart Panel */}
            {cart.length > 0 && (
              <div className="w-80 shrink-0">
                <div className="bg-slate-800 rounded-[2rem] border border-slate-700 overflow-hidden sticky top-8">
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-lg">
                      <ShoppingCart size={20} className="text-blue-400" />
                      Cart
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full font-mono border border-blue-500/20">
                      {cartCount} item{cartCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    {cart.map(i => (
                      <div key={i.product.id} className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-2xl border border-slate-700">
                        <div className="w-9 h-9 rounded-xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-blue-400 font-black text-sm shrink-0">
                          {i.product.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-100 truncate">{i.product.name}</p>
                          <p className="text-[10px] text-slate-500">${Number(i.product.price).toFixed(2)} × {i.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => updateQty(i.product.id, -1)} className="w-7 h-7 rounded-lg bg-slate-600 hover:bg-slate-500 flex items-center justify-center transition-all">
                            <Minus size={10} />
                          </button>
                          <span className="font-black text-xs w-5 text-center">{i.quantity}</span>
                          <button onClick={() => updateQty(i.product.id, 1)} disabled={i.quantity >= i.product.quantity} className="w-7 h-7 rounded-lg bg-slate-600 hover:bg-slate-500 disabled:opacity-40 flex items-center justify-center transition-all">
                            <Plus size={10} />
                          </button>
                          <button onClick={() => removeFromCart(i.product.id)} className="w-7 h-7 rounded-lg bg-red-900/30 hover:bg-red-600/40 text-red-400 flex items-center justify-center transition-all ml-1">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-t border-slate-700">
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-black text-slate-400 uppercase text-xs tracking-widest">Total</span>
                      <span className="font-black text-2xl text-emerald-400">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
                      {isCheckingOut ? 'Placing Order...' : 'Place Order'}
                    </button>
                    <button
                      onClick={() => setCart([])}
                      className="w-full mt-2 py-2.5 text-slate-500 hover:text-red-400 font-bold text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={12} /> Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800 rounded-[2.5rem] border border-slate-700 overflow-hidden">
            <div className="p-8 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900/40 text-blue-400 rounded-2xl">
                  <ClipboardList size={22} />
                </div>
                <h3 className="font-black text-xl">Order History</h3>
              </div>
              <button onClick={fetchMyOrders} className="p-3 bg-slate-700 border border-slate-600 rounded-2xl text-slate-400 hover:text-blue-400 transition-all">
                <RefreshCw size={16} className={isOrdersLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {isOrdersLoading ? (
              <div className="py-24 flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-400" size={36} />
                <p className="text-sm font-mono uppercase tracking-widest text-slate-400">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-24 text-center">
                <ClipboardList size={48} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-500 font-mono uppercase text-sm tracking-widest">No orders yet</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-slate-700/30 rounded-[1.5rem] border border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-500">ORDER #{order.id}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] text-slate-500">
                          {order.orderedAt ? new Date(order.orderedAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </span>
                        <span className="font-black text-emerald-400">${Number(order.totalPrice).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-900/30 border border-blue-800/40 flex items-center justify-center text-[10px] font-black text-blue-400">
                              {item.productName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-100">{item.productName}</p>
                              <p className="text-[10px] text-slate-500">by {item.farmerUsername}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm text-emerald-400">${Number(item.priceAtPurchase).toFixed(2)}</p>
                            <p className="text-[10px] text-slate-500">qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerDashboard;