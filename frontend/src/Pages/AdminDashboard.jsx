// import React, { useState, useEffect } from 'react';
// import {
//   Sprout,
//   LayoutDashboard,
//   Users,
//   TrendingUp,
//   Package,
//   LogOut,
//   Search,
//   Settings,
//   Activity,
//   Loader2,
//   AlertCircle,
//   BarChart3,
//   ShieldAlert,
//   MoreVertical,
//   Clock,
// } from 'lucide-react';

// const API_BASE_URL = "http://localhost:8080/api/v1";

// const AdminDashboard = ({ user, onLogout }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [users, setUsers] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLogsLoading, setIsLogsLoading] = useState(false);
//   const [fetchError, setFetchError] = useState(null);

//   const fetchActivities = async () => {
//     setIsLogsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/activity`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${user?.token}`,
//         },
//       });
//       const result = await response.json();
//       setActivities(result.data || (Array.isArray(result) ? result : []));
//     } catch (error) {
//       console.error("Activity Fetch Error:", error);
//       setActivities([]);
//     } finally {
//       setIsLogsLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     if (!user?.token) return;
//     setIsLoading(true);
//     setFetchError(null);

//     try {
//       const response = await fetch(`${API_BASE_URL}/admin`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
//       });
//       if (!response.ok) throw new Error('Failed to fetch users');
//       const result = await response.json();
//       setUsers(result.data || []);
//     } catch (error) {
//       setFetchError(error.message);
//       setUsers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchActivities();
//   }, []);

//   const stats = [
//     { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20' },
//     { label: 'Active Logs', value: activities.length.toString(), icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-900/20' }
//   ];

//   const filteredUsers = users.filter(u =>
//     u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     u.role?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const admins = filteredUsers.filter(u => u.role === "ADMIN");
//   const farmers = filteredUsers.filter(u => u.role === "FARMER");
//   const buyers = filteredUsers.filter(u => u.role === "BUYER");

//   const deleteUser = async (id) => {
//     await fetch(`${API_BASE_URL}/admin/users/${id}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     });

//     fetchUsers();
//     fetchActivities();
//   };

//   const renderUserGroup = (title, list) => (
//     <>
//       <tr>
//         <td colSpan="4" className="px-6 py-4 text-xs font-black uppercase text-slate-400">
//           {title} ({list.length})
//         </td>
//       </tr>

//       {list.map((u) => (
//         <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
//           <td className="px-6 py-5">
//             <div className="flex items-center gap-3 ">
//               <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm">
//                 {u.username ? u.username[0] : '?'}
//               </div>
//               <div>
//                 <p className="font-bold text-slate-100">{u.username}</p>
//               </div>
//             </div>
//           </td>

//           <td className="px-8 py-5">
//             <span
//               className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
//                 u.role === 'FARMER'
//                   ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700'
//                   : u.role === 'ADMIN'
//                   ? 'bg-indigo-900/20 text-indigo-400 border-indigo-700'
//                   : 'bg-blue-900/20 text-blue-400 border-blue-700'
//               }`}
//             >
//               {u.role}
//             </span>
//           </td>

//           <td className="px-8 py-5 flex gap-2">
//             {u.role !== "ADMIN" || u.username === user.username ? (
//               <>
//                 <button
//                   onClick={() => { if (confirm(`Delete ${u.username}? This cannot be undone!`)) deleteUser(u.id); }}
//                   className="px-3 py-1 rounded-lg bg-red-700 text-red-300 hover:bg-red-600 transition"
//                 >
//                   Delete
//                 </button>
//               </>
//             ) : (
//               <span className="text-gray-400">Protected</span>
//             )}
//           </td>
//         </tr>
//       ))}
//     </>
//   );

//   return (
//     <div className="min-h-screen bg-slate-900 flex font-sans animate-in fade-in duration-500 text-slate-100">
//       <aside className="w-64 bg-slate-800 text-slate-100 flex flex-col fixed h-full shadow-2xl z-20">
//         <div className="p-6 flex items-center gap-3 border-b border-slate-700">
//           <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
//             <Sprout size={24} />
//           </div>
//           <span className="font-black tracking-tight text-xl">
//             Direct Root<span className="text-blue-400 text-[10px] block font-mono">ROOT_ACCESS</span>
//           </span>
//         </div>

//         <nav className="flex-1 p-4 space-y-1.5 mt-4">
//           {[
//             { tab: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
//             { tab: 'users', icon: Users, label: 'User Database' },
//             { tab: null, icon: Package, label: 'Marketplace' },
//             { tab: null, icon: BarChart3, label: 'Analytics' },
//           ].map(({ tab, icon: Icon, label }) => (
//             <button
//               key={label}
//               onClick={() => tab && setActiveTab(tab)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
//                 activeTab === tab
//                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
//                   : 'text-slate-400 hover:bg-slate-700 hover:text-white'
//               }`}
//               disabled={!tab}
//             >
//               <Icon size={18} />
//               <span className="font-bold text-sm">{label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-slate-700">
//           <div className="bg-slate-700/40 rounded-2xl p-4 mb-4 border border-slate-700">
//             <div className="flex items-center gap-3">
//               <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xs font-black shadow-inner">
//                 {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
//               </div>
//               <div className="overflow-hidden">
//                 <p className="text-xs font-black truncate">{user?.username || 'Administrator'}</p>
//                 <p className="text-[10px] text-emerald-400 font-mono">{user?.username ? `${user.username}@directroot.com` : 'Admin@directroot.com'}</p>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={onLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm group"
//           >
//             <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
//             End Session
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 ml-64 p-8">
//         <header className="flex items-center justify-between mb-10">
//           <div>
//             <h1 className="text-4xl font-black tracking-tight">
//               {activeTab === 'overview' ? 'Command Center' : 'User Management'}
//             </h1>
//             <p className="text-slate-400 font-medium mt-1">
//               {activeTab === 'overview'
//                 ? 'AgriNet Core Node is responding normally.'
//                 : `Managing ${users.length} registered system entities.`}
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative group">
//               <Search
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors"
//                 size={18}
//               />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search database..."
//                 className="pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-72 shadow-sm font-medium text-slate-200 placeholder:text-slate-500"
//               />
//             </div>
//             <button
//               onClick={() => { fetchUsers(); fetchActivities(); }}
//               className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-blue-400 hover:border-blue-700 transition-all shadow-sm"
//             >
//               <Activity size={20} className={isLoading ? 'animate-spin' : ''} />
//             </button>
//           </div>
//         </header>

//         {fetchError && (
//           <div className="mb-8 p-4 bg-red-900/20 border border-red-700 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm animate-in slide-in-from-top-4">
//             <AlertCircle size={20} />
//             {fetchError}
//           </div>
//         )}

//         {/* Overview Tab */}
//         {activeTab === 'overview' ? (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//               {stats.map((stat, i) => (
//                 <div
//                   key={i}
//                   className="p-6 rounded-[2rem] shadow-sm border border-slate-700 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-800"
//                 >
//                   <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
//                     <stat.icon size={26} />
//                   </div>
//                   <div>
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
//                     <p className="text-2xl font-black text-slate-100">{stat.value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Recent Users Table */}
//             <div className="bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden min-h-[400px] mb-10">
//               <div className="p-8 border-b border-slate-700 flex justify-between items-center">
//                 <div>
//                   <h3 className="font-black text-slate-100 text-xl tracking-tight">Recent Users</h3>
//                 </div>
//               </div>
//               <div className="overflow-x-auto">
//                 {isLoading ? (
//                   <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
//                     <Loader2 className="animate-spin text-blue-400" size={40} />
//                     <p className="text-sm font-mono tracking-widest uppercase font-bold">Querying MySQL...</p>
//                   </div>
//                 ) : (
//                   <table className="w-full text-left">
//                     <thead>
//                       <tr className="bg-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
//                         <th className="px-8 py-5">User</th>
//                         <th className="px-8 py-5">Role</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-700">
//                       {filteredUsers.slice(0, 8).map((u) => (
//                         <tr key={u.id} className="hover:bg-slate-700/50 transition-colors group">
//                           <td className="px-8 py-5">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
//                                 {u.username?.charAt(0).toUpperCase()}
//                               </div>
//                               <div>
//                                 <p className="font-bold text-slate-100 tracking-tight">{u.username}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-8 py-5">
//                             <span
//                               className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
//                                 u.role === 'FARMER'
//                                   ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700'
//                                   : u.role === 'ADMIN'
//                                   ? 'bg-indigo-900/20 text-indigo-400 border-indigo-700'
//                                   : 'bg-blue-900/20 text-blue-400 border-blue-700'
//                               }`}
//                             >
//                               {u.role}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>

//             {/* Activity Log */}
//             <div className="bg-[#1e293b] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
//               <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
//                 <h3 className="font-black text-white text-lg uppercase tracking-tight">System Activity Log</h3>
//                 <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-mono border border-blue-500/20">SQL_LIVE</span>
//               </div>

//               <div className="overflow-x-auto min-h-[400px]">
//                 {isLogsLoading ? (
//                   <div className="py-20 flex flex-col items-center justify-center gap-3">
//                     <Loader2 className="animate-spin text-blue-500" size={32} />
//                     <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Scanning Logs...</p>
//                   </div>
//                 ) : (
//                   <table className="w-full text-left">
//                     <thead>
//                       <tr className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] border-b border-slate-800">
//                         <th className="px-8 py-5">User</th>
//                         <th className="px-8 py-5">Action</th>
//                         <th className="px-8 py-5">Performed By</th>
//                         <th className="px-8 py-5">Role</th>
//                         <th className="px-8 py-5 text-right">Time</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-800">
//                       {activities.length > 0 ? (
//                         activities.map((activity) => (
//                           <tr key={activity.id} className="hover:bg-slate-700/30 transition-colors group">
//                             <td className="px-8 py-5">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
//                                   {activity.username?.[0]?.toUpperCase() || 'U'}
//                                 </div>
//                                 <span className="font-bold text-slate-200">{activity.username}</span>
//                               </div>
//                             </td>
//                             <td className="px-8 py-5">
//                               <span className={`text-xs ${activity.action?.toLowerCase().includes('delete') ? 'text-red-400' : 'text-slate-400'}`}>
//                                 {activity.action}
//                               </span>
//                             </td>

//                             <td className="px-8 py-5">
//                               <span className="text-xs text-slate-500">
//                                 {activity.performedBy }
//                               </span>
//                             </td>
//                             <td className="px-8 py-5">
//                               <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
//                                 activity.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
//                                 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
//                               }`}>
//                                 {activity.role}
//                               </span>
//                             </td>
//                             <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-500">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Clock size={12} />
//                                 {activity.timestamp
//                                   ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//                                   : 'N/A'}
//                               </div>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan="4" className="py-20 text-center text-slate-500 text-xs italic font-mono uppercase tracking-tighter">
//                             No logs found in directroot.activities
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             </div>
//           </>
//         ) : (
//           /* User Management Tab */
//           <div className="rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden bg-slate-800">
//             <div className="p-8 border-b border-slate-700 flex justify-between items-center bg-slate-700/30">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-900 text-blue-400 rounded-2xl">
//                   <Users size={24} />
//                 </div>
//                 <div>
//                   <h3 className="font-black text-slate-100 text-xl tracking-tight">User Database</h3>
//                   <p className="text-xs text-slate-400 font-medium">Real-time database records</p>
//                 </div>
//               </div>
//             </div>
//             <div className="overflow-x-auto px-4 pb-4">
//               {isLoading ? (
//                 <div className="py-20 flex justify-center">
//                   <Loader2 className="animate-spin text-blue-400" size={30} />
//                 </div>
//               ) : (
//                 <table className="w-full text-left">
//                   <thead>
//                     <tr className="bg-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
//                       <th className="px-8 py-5">User</th>
//                       <th className="px-8 py-5">Role</th>
//                       <th className="px-8 py-5">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-transparent">
//                     {renderUserGroup("Administrators", admins)}
//                     {renderUserGroup("Farmers", farmers)}
//                     {renderUserGroup("Buyers", buyers)}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import {
  Sprout, LayoutDashboard, Users, Package, LogOut, Search,
  Activity, Loader2, AlertCircle, BarChart3, Clock, Wheat,
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api/v1";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchActivities = async () => {
    setIsLogsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/activity`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      });
      const result = await response.json();
      setActivities(result.data || (Array.isArray(result) ? result : []));
    } catch (error) {
      console.error("Activity Fetch Error:", error);
      setActivities([]);
    } finally {
      setIsLogsLoading(false);
    }
  };

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

  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      });
      const result = await response.json();
      setProducts(Array.isArray(result) ? result : result.data || []);
    } catch (error) {
      console.error("Products Fetch Error:", error);
      setProducts([]);
    } finally {
      setIsProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchActivities();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'items') fetchProducts();
  }, [activeTab]);

  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { label: 'Active Logs', value: activities.length.toString(), icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
    { label: 'Listed Items', value: products.length.toString(), icon: Wheat, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
  ];

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.farmerUsername?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const admins = filteredUsers.filter(u => u.role === "ADMIN");
  const farmers = filteredUsers.filter(u => u.role === "FARMER");
  const buyers = filteredUsers.filter(u => u.role === "BUYER");

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      await fetchUsers();
      await fetchActivities();
    }
  };

  const getCategoryColor = (category) => {
    const map = {
      vegetables: 'bg-green-900/20 text-green-400 border-green-700',
      fruits: 'bg-orange-900/20 text-orange-400 border-orange-700',
      grains: 'bg-yellow-900/20 text-yellow-400 border-yellow-700',
      dairy: 'bg-blue-900/20 text-blue-400 border-blue-700',
      meat: 'bg-red-900/20 text-red-400 border-red-700',
    };
    return map[category?.toLowerCase()] || 'bg-slate-700/40 text-slate-400 border-slate-600';
  };

  const renderUserGroup = (title, list) => (
    <>
      <tr>
        <td colSpan="3" className="px-6 py-4 text-xs font-black uppercase text-slate-400">
          {title} ({list.length})
        </td>
      </tr>
      {list.map((u) => (
        <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
          <td className="px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-black text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm">
                {u.username ? u.username[0].toUpperCase() : '?'}
              </div>
              <p className="font-bold text-slate-100">{u.username}</p>
            </div>
          </td>
          <td className="px-8 py-5">
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
              u.role === 'FARMER' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700'
              : u.role === 'ADMIN' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-700'
              : 'bg-blue-900/20 text-blue-400 border-blue-700'
            }`}>
              {u.role}
            </span>
          </td>
          <td className="px-8 py-5">
            {u.role !== "ADMIN" ? (
              <button
                onClick={() => { if (confirm(`Delete ${u.username}? This cannot be undone!`)) deleteUser(u.id); }}
                className="px-3 py-1 rounded-lg bg-red-700 text-red-300 hover:bg-red-600 transition text-xs font-bold"
              >
                Delete
              </button>
            ) : u.username === user.username ? (
              <button
                onClick={() => { if (confirm(`Delete your own account? You will be logged out!`)) { deleteUser(u.id); onLogout(); } }}
                className="px-3 py-1 rounded-lg bg-orange-700 text-orange-300 hover:bg-orange-600 transition text-xs font-bold"
              >
                Delete Mine
              </button>
            ) : (
              <span className="text-gray-500 text-xs">Protected</span>
            )}
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans text-slate-100">

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
            { tab: 'users',    icon: Users,           label: 'User Database' },
            { tab: 'items',    icon: Wheat,           label: 'Farmer Items' },
            { tab: null,       icon: BarChart3,       label: 'Analytics' },
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
                <p className="text-[10px] text-emerald-400 font-mono">
                  {user?.username ? `${user.username}@directroot.com` : 'admin@directroot.com'}
                </p>
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
              {activeTab === 'overview' ? 'Command Center'
                : activeTab === 'users' ? 'User Management'
                : 'Farmer Items'}
            </h1>
            <p className="text-slate-400 font-medium mt-1">
              {activeTab === 'overview' ? 'AgriNet Core Node is responding normally.'
                : activeTab === 'users' ? `Managing ${users.length} registered system entities.`
                : `${products.length} products listed by farmers.`}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-72 shadow-sm font-medium text-slate-200 placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={() => { fetchUsers(); fetchActivities(); fetchProducts(); }}
              className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-blue-400 hover:border-blue-700 transition-all shadow-sm"
            >
              <Activity size={20} className={isLoading || isProductsLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {fetchError && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-700 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm">
            <AlertCircle size={20} />
            {fetchError}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="p-6 rounded-[2rem] shadow-sm border border-slate-700 flex items-center gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-slate-800">
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

            {/* Recent Users */}
            <div className="bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden mb-10">
              <div className="p-8 border-b border-slate-700">
                <h3 className="font-black text-slate-100 text-xl tracking-tight">Recent Users</h3>
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-400" size={40} />
                    <p className="text-sm font-mono tracking-widest uppercase font-bold text-slate-400">Querying MySQL...</p>
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
                              <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <p className="font-bold text-slate-100 tracking-tight">{u.username}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                              u.role === 'FARMER' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-700'
                              : u.role === 'ADMIN' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-700'
                              : 'bg-blue-900/20 text-blue-400 border-blue-700'
                            }`}>
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

            {/* Activity Log */}
            <div className="bg-[#1e293b] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                <h3 className="font-black text-white text-lg uppercase tracking-tight">System Activity Log</h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-mono border border-blue-500/20">SQL_LIVE</span>
              </div>
              <div className="overflow-x-auto min-h-[300px]">
                {isLogsLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Scanning Logs...</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] border-b border-slate-800">
                        <th className="px-8 py-5">User</th>
                        <th className="px-8 py-5">Action</th>
                        <th className="px-8 py-5">Performed By</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {activities.length > 0 ? activities.map((activity) => (
                        <tr key={activity.id} className="hover:bg-slate-700/30 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                {activity.username?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <span className="font-bold text-slate-200">{activity.username}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`text-xs font-semibold ${activity.action?.toLowerCase().includes('delete') ? 'text-red-400' : 'text-slate-400'}`}>
                              {activity.action}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-xs text-slate-500">{activity.performedBy}</span>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                              activity.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              {activity.role}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-500">
                            <div className="flex items-center justify-end gap-2">
                              <Clock size={12} />
                              {activity.timestamp
                                ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'N/A'}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="py-20 text-center text-slate-500 text-xs italic font-mono uppercase">
                            No logs found in directroot.activities
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden bg-slate-800">
            <div className="p-8 border-b border-slate-700 flex items-center gap-4 bg-slate-700/30">
              <div className="p-3 bg-blue-900 text-blue-400 rounded-2xl">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-100 text-xl tracking-tight">User Database</h3>
                <p className="text-xs text-slate-400 font-medium">Real-time database records</p>
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
                  <tbody className="divide-y divide-transparent">
                    {renderUserGroup("Administrators", admins)}
                    {renderUserGroup("Farmers", farmers)}
                    {renderUserGroup("Buyers", buyers)}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── ITEMS TAB ── */}
        {activeTab === 'items' && (
          <div className="rounded-[2.5rem] shadow-sm border border-slate-700 overflow-hidden bg-slate-800">
            <div className="p-8 border-b border-slate-700 flex items-center justify-between bg-slate-700/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-900/40 text-yellow-400 rounded-2xl">
                  <Wheat size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-100 text-xl tracking-tight">Farmer Items</h3>
                  <p className="text-xs text-slate-400 font-medium">{products.length} products listed in the marketplace</p>
                </div>
              </div>
              <button
                onClick={fetchProducts}
                className="p-3 bg-slate-700 border border-slate-600 rounded-2xl text-slate-400 hover:text-yellow-400 hover:border-yellow-700 transition-all"
              >
                <Activity size={18} className={isProductsLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="overflow-x-auto px-4 pb-4">
              {isProductsLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-yellow-400" size={36} />
                  <p className="text-sm font-mono tracking-widest uppercase font-bold text-slate-400">Loading Products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-20 text-center">
                  <Wheat size={40} className="mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-500 text-sm font-mono uppercase tracking-widest">No products found</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-700">
                      <th className="px-8 py-5">Product</th>
                      <th className="px-8 py-5">Category</th>
                      <th className="px-8 py-5">Price</th>
                      <th className="px-8 py-5">Quantity</th>
                      <th className="px-8 py-5">Farmer</th>
                      <th className="px-8 py-5 text-right">Listed At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-700/50 transition-colors group">

                        {/* Product Name + Description */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-yellow-900/30 border border-yellow-800/40 flex items-center justify-center text-yellow-400 font-black text-sm group-hover:bg-yellow-600 group-hover:text-white transition-all duration-300">
                              {product.name?.[0]?.toUpperCase() || 'P'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100">{product.name}</p>
                              {product.description && (
                                <p className="text-[10px] text-slate-500 max-w-[180px] truncate">{product.description}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-8 py-5">
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${getCategoryColor(product.category)}`}>
                            {product.category || 'N/A'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-8 py-5">
                          <span className="text-emerald-400 font-black text-sm">
                            ${product.price != null ? Number(product.price).toFixed(2) : '—'}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="px-8 py-5">
                          <span className={`font-bold text-sm ${product.quantity > 0 ? 'text-slate-200' : 'text-red-400'}`}>
                            {product.quantity != null ? product.quantity : '—'}
                            {product.quantity === 0 && (
                              <span className="ml-2 text-[9px] text-red-400 border border-red-700 rounded px-1 py-0.5">OUT</span>
                            )}
                          </span>
                        </td>

                        {/* Farmer */}
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-900/30 border border-emerald-800/40 flex items-center justify-center text-[10px] font-black text-emerald-400">
                              {product.farmerUsername?.[0]?.toUpperCase() || 'F'}
                            </div>
                            <span className="text-sm text-slate-300 font-medium">{product.farmerUsername || 'Unknown'}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td className="px-8 py-5 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-mono text-[10px] text-slate-400">
                              {product.createdAt
                                ? new Date(product.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
                                : 'N/A'}
                            </span>
                            <span className="font-mono text-[10px] text-slate-600 flex items-center gap-1">
                              <Clock size={10} />
                              {product.createdAt
                                ? new Date(product.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : ''}
                            </span>
                          </div>
                        </td>

                      </tr>
                    ))}
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