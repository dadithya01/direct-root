import React, { useState, useEffect } from 'react';
import {
  Sprout,
  LayoutDashboard,
  Users,
  TrendingUp,
  Package,
  LogOut,
  Search,
  Settings,
  Activity,
  Loader2,
  AlertCircle,
  BarChart3,
  ShieldAlert,
  MoreVertical,
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api/v1";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchUsers = async () => {
    if (!user?.token) return;
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const result = await response.json();
      setUsers(result.data || []);
    } catch (error) {
      setFetchError(error.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20' },
  ];

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins = filteredUsers.filter(u => u.role === "ADMIN");
const farmers = filteredUsers.filter(u => u.role === "FARMER");
const buyers = filteredUsers.filter(u => u.role === "BUYER");


const renderUserGroup = (title, list) => (
  <>
    <tr>
      <td colSpan="4" className="px-6 py-4 text-xs font-black uppercase text-slate-400">
        {title} ({list.length})
      </td>
    </tr>

    {list.map((u) => (
      <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-slate-400">
              {u.username ? u.username[0] : '?'}
            </div>
            <div>
              <p className="font-bold text-slate-100">{u.username}</p>
            </div>
          </div>
        </td>

        <td className="px-8 py-5">
                            <span
                              className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                                u.role === 'FARMER'
                                  ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700'
                                  : u.role === 'ADMIN'
                                  ? 'bg-indigo-900/20 text-indigo-400 border-indigo-700'
                                  : 'bg-blue-900/20 text-blue-400 border-blue-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="px-8 py-5 flex gap-2">
            {u.role !== "ADMIN" || u.username === user.username ? (
              <>
                <button
                  onClick={() => {if (confirm(`Delete ${u.username}? This cannot be undone!`)) deleteUser(u.id);}}
                  className="px-3 py-1 rounded-lg bg-red-700 text-red-300 hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </>
            ) : (
              <span className="text-gray-400">Protected</span>
            )}
          </td>
      </tr>

    ))}
  </>
);

const deleteUser = async (id) => {
  await fetch(`${API_BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  fetchUsers();
};

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans animate-in fade-in duration-500 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col fixed h-full shadow-2xl z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Sprout size={24} />
          </div>
          <span className="font-black tracking-tight text-xl">
            Direct Root<span className="text-blue-400 text-[10px] block font-mono">ROOT_ACCESS</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {[
            { tab: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
            { tab: 'users', icon: Users, label: 'User Database' },
            { tab: null, icon: Package, label: 'Marketplace' },
            { tab: null, icon: BarChart3, label: 'Analytics' },
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => tab && setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              disabled={!tab}
            >
              <Icon size={18} />
              <span className="font-bold text-sm">{label}</span>
            </button>
          ))}
          
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-700/40 rounded-2xl p-4 mb-4 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xs font-black shadow-inner">
                {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">{user?.username || 'Administrator'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">{user?.username ? `${user.username}@directroot.com` : 'Admin@directroot.com'}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {activeTab === 'overview' ? 'Command Center' : 'User Management'}
            </h1>
            <p className="text-slate-400 font-medium mt-1">
              {activeTab === 'overview'
                ? 'AgriNet Core Node is responding normally.'
                : `Managing ${users.length} registered system entities.`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors"
                size={18}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search database..."
                className="pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-72 shadow-sm font-medium text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={fetchUsers}
              className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-blue-400 hover:border-blue-700 transition-all shadow-sm"
            >
              <Activity size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {fetchError && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-700 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm animate-in slide-in-from-top-4">
            <AlertCircle size={20} />
            {fetchError}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-[2rem] shadow-sm border border-slate-700 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-800"
                >
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                    <stat.icon size={26} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-100">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent user Table */}
            <div className="bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden min-h-[400px]">
              <div className="p-8 border-b border-slate-700 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-slate-100 text-xl tracking-tight">Recent Activity</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                    <Loader2 className="animate-spin text-blue-400" size={40} />
                    <p className="text-sm font-mono tracking-widest uppercase font-bold">Querying MySQL...</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
                        <th className="px-8 py-5">User</th>
                        <th className="px-8 py-5">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredUsers.slice(0, 8).map((u) => (
                        <tr key={u.id} className="hover:bg-slate-700/50 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-100 tracking-tight">{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span
                              className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                                u.role === 'FARMER'
                                  ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700'
                                  : u.role === 'ADMIN'
                                  ? 'bg-indigo-900/20 text-indigo-400 border-indigo-700'
                                  : 'bg-blue-900/20 text-blue-400 border-blue-700'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        ) : (
          /* User Management Tab */
          <div className="rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden bg-slate-800">
            <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-700/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-900 text-blue-400 rounded-2xl">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-100 text-xl tracking-tight">User Database</h3>
                  <p className="text-xs text-slate-400 font-medium">Real-time database records</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto px-4 pb-4">
              {isLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-blue-400" size={30} />
                </div>
              ) : (
                <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
                        <th className="px-8 py-5">User</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
  {renderUserGroup("Administrators", admins)}
  {renderUserGroup("Farmers", farmers)}
  {renderUserGroup("Buyers", buyers)}
</tbody>
                  </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;