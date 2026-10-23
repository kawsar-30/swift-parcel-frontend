"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DashboardData = {
  stats: { total_parcels: number; delivered: number; pending: number; total_revenue: number };
  daily_volume: { date: string; count: number }[];
  daily_revenue: { date: string; revenue: number }[];
  success_rate: { total_parcels: number; delivered_parcels: number; success_rate: number };
  top_cities: { city: string; count: number }[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/dashboard-stats?days=${days}`);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-10 text-gray-500">No data available.</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                  days === d ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl"><Package className="w-6 h-6" /></div>
            <TrendingUp className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-blue-100 text-sm font-medium">Total Parcels</p>
          <p className="text-3xl font-extrabold mt-1">{data.stats.total_parcels}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-xl"><CheckCircle className="w-6 h-6 text-green-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Delivered</p>
          <p className="text-3xl font-extrabold text-gray-800 mt-1">{data.stats.delivered}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-yellow-50 rounded-xl"><Clock className="w-6 h-6 text-yellow-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Pending</p>
          <p className="text-3xl font-extrabold text-gray-800 mt-1">{data.stats.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-xl"><TrendingUp className="w-6 h-6 text-purple-600" /></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-extrabold text-gray-800 mt-1">৳ {data.stats.total_revenue}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Daily Volume & Revenue</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.daily_volume.map((v, i) => ({ ...v, revenue: data.daily_revenue[i]?.revenue || 0 }))}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" /> Top Cities
          </h3>
          <div className="space-y-4">
            {data.top_cities.map((city, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">{idx + 1}</span>
                  <span className="font-medium text-gray-700">{city.city}</span>
                </div>
                <span className="font-bold text-gray-900">{city.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Delivery Success Rate</h4>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-extrabold text-green-600">{data.success_rate.success_rate}%</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">{data.success_rate.delivered_parcels} out of {data.success_rate.total_parcels} parcels delivered.</p>
          </div>
        </div>
      </div>
    </div>
  );
}