"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Package, Truck, DollarSign, Clock, TrendingUp, MapPin, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Stats = {
  total_parcels: number;
  delivered: number;
  pending: number;
  total_revenue: number;
};

type DailyVolume = { date: string; count: number };
type DailyRevenue = { date: string; revenue: number };
type SuccessRate = { total_parcels: number; delivered_parcels: number; success_rate: number };
type TopCity = { city: string; count: number };

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [volume, setVolume] = useState<DailyVolume[]>([]);
  const [revenue, setRevenue] = useState<DailyRevenue[]>([]);
  const [success, setSuccess] = useState<SuccessRate | null>(null);
  const [cities, setCities] = useState<TopCity[]>([]);
  const [recentParcels, setRecentParcels] = useState<any[]>([]);
  const [hubName, setHubName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [datePreset, setDatePreset] = useState<"7d" | "14d" | "30d" | "custom">("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      let days = 7;
      let start = "";
      let end = "";
      if (datePreset === "14d") days = 14;
      else if (datePreset === "30d") days = 30;
      else if (datePreset === "custom") {
        start = customStart;
        end = customEnd;
      }

      let volUrl = `/analytics/daily-volume?days=${days}`;
      let revUrl = `/analytics/daily-revenue?days=${days}`;
      if (datePreset === "custom" && start && end) {
        volUrl += `&start_date=${start}&end_date=${end}`;
        revUrl += `&start_date=${start}&end_date=${end}`;
      }

      const hubsRes = await api.get("/hubs");
      const myHub = hubsRes.data.find((h: any) => h.manager_id === user?.id);
      if (myHub) setHubName(myHub.name);

      const [statsRes, volRes, revRes, sucRes, cityRes, parcelsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get(volUrl),
        api.get(revUrl),
        api.get("/analytics/success-rate"),
        api.get("/analytics/top-cities?limit=5"),
        api.get("/admin/parcels"),
      ]);
      setStats(statsRes.data);
      setVolume(volRes.data);
      setRevenue(revRes.data);
      setSuccess(sucRes.data);
      setCities(cityRes.data);
      setRecentParcels(parcelsRes.data.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [datePreset]);

  const isManager = user?.role === "manager";
  const pageTitle = isManager ? "Manager Overview" : "Admin Overview";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const cards = [
    { title: "Total Parcels", value: stats?.total_parcels || 0, icon: Package, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
    { title: "Delivered", value: stats?.delivered || 0, icon: Truck, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-600" },
    { title: "Pending", value: stats?.pending || 0, icon: Clock, color: "from-amber-500 to-amber-600", bg: "bg-amber-50", text: "text-amber-600" },
    { title: "Total Revenue", value: `৳ ${(stats?.total_revenue || 0).toLocaleString('en-BD', { minimumFractionDigits: 0 })}`, icon: DollarSign, color: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Hero Header with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10">
          {isManager && hubName && (
            <p className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">Managing Hub</p>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {isManager ? hubName : pageTitle}
          </h1>
          <p className="text-blue-200 mt-3 text-lg">Welcome back, <span className="font-bold text-white">{user?.name}</span></p>
        </div>
      </div>

      {/* Date Range Filter - Pill Style */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-bold text-gray-800">Date Range</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "7 Days", value: "7d" },
            { label: "14 Days", value: "14d" },
            { label: "30 Days", value: "30d" },
            { label: "Custom", value: "custom" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDatePreset(opt.value as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                datePreset === opt.value 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
          {datePreset === "custom" && (
            <div className="flex items-center gap-2 ml-2">
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <span className="text-gray-400">-</span>
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={fetchAllData} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Apply</button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform`}></div>
            <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.text} flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">{card.title}</p>
            <p className="text-3xl font-black text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" /> Daily Volume
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">PARCELS</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Daily Revenue
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">BDT</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-500" /> Delivery Success Rate
          </h3>
          <div className="flex items-center gap-8">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Delivered", value: success?.delivered_parcels || 0 },
                      { name: "Pending", value: (success?.total_parcels || 0) - (success?.delivered_parcels || 0) },
                    ]}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-gray-900">{success?.success_rate || 0}%</span>
              </div>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm font-medium text-emerald-800 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"/>Delivered</span>
                <span className="font-bold text-emerald-900">{success?.delivered_parcels || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full"/>Pending</span>
                <span className="font-bold text-gray-800">{(success?.total_parcels || 0) - (success?.delivered_parcels || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" /> Top Delivery Cities
          </h3>
          <div className="space-y-4">
            {cities.map((city, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-400 w-5">{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-700">{city.city}</span>
                    <span className="font-bold text-gray-500">{city.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${(city.count / Math.max(...cities.map(c => c.count), 1)) * 100}%`,
                        backgroundColor: COLORS[idx % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {cities.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No city data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Parcels - Premium Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Recent Parcels</h3>
          <Link href="/admin/parcels" className="text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receiver</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rider</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentParcels.map((p, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{p.tracking_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.receiver_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {p.assigned_rider_name ? (
                      <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-md">
                        {p.assigned_rider_name}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${
                      p.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                      p.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      p.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {p.status.replace(/_/g, " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {recentParcels.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No recent parcels available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}