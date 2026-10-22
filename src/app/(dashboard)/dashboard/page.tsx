"use client";

import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Package, Truck, Clock, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, delivered: 0, inTransit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/parcels");
        const parcels = res.data;
        setStats({
          total: parcels.length,
          delivered: parcels.filter((p: any) => p.status === "DELIVERED").length,
          inTransit: parcels.filter((p: any) => !["DELIVERED", "CANCELLED", "PENDING"].includes(p.status)).length,
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-8 md:p-10 text-white shadow-2xl shadow-blue-900/20 group">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Welcome back, {user?.name.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100/90 mb-8 max-w-xl text-lg">Manage your parcels, track deliveries, and book new shipments all from one central place.</p>
          <Link href="/dashboard/book" className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-lg">
            <Truck className="w-5 h-5 mr-2" /> Book New Parcel
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Parcels */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl mr-5">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Parcels</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            )}
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl mr-5">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Delivered</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{stats.delivered}</p>
            )}
          </div>
        </div>

        {/* In Transit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl mr-5">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">In Transit</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{stats.inTransit}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}