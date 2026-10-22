"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Package, Users, Truck, MapPin, Building2, Phone, Bike, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

type Stats = {
  total_parcels: number;
  delivered: number;
  pending: number;
};

type Parcel = {
  id: string;
  tracking_id: string;
  receiver_name: string;
  status: string;
  delivery_city: string;
  hub_id: string;
};

type Rider = {
  id: string;
  name: string;
  phone: string | null;
  vehicle_type: string;
  rider_type: string;
  is_available: boolean;
};

type Hub = {
  id: string;
  name: string;
  city: string;
  address: string;
  manager_id: string | null;
};

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [myHub, setMyHub] = useState<Hub | null>(null);
  const [recentParcels, setRecentParcels] = useState<Parcel[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, parcelsRes, ridersRes, hubsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/parcels"),
          api.get("/riders"),
          api.get("/hubs"),
        ]);
        
        setStats(statsRes.data);
        setRecentParcels(parcelsRes.data.slice(0, 5));
        setRiders(ridersRes.data);
        
        // Manager er hub ta ber koro
        const myHubData = hubsRes.data.find((h: Hub) => h.manager_id === user?.id);
        setMyHub(myHubData || null);
        
      } catch (error) {
        console.error("Failed to fetch manager data", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-yellow-600 bg-yellow-50";
      case "DELIVERED": return "text-green-600 bg-green-50";
      case "AT_HUB": return "text-purple-600 bg-purple-50";
      case "IN_TRANSIT": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hub Info Banner */}
      {myHub ? (
        <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-blue-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-blue-200 font-semibold mb-1 flex items-center">
              <Building2 className="w-4 h-4 mr-2" /> Managing Hub
            </p>
            <h2 className="text-3xl font-extrabold mb-2">{myHub.name}</h2>
            <p className="text-blue-100 flex items-center mb-1">
              <MapPin className="w-4 h-4 mr-1" /> {myHub.city} • {myHub.address}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
          <p className="text-red-700 font-bold">⚠️ You are not assigned to any hub. Please contact admin.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl mr-5">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Total Parcels</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.total_parcels || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl mr-5">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Pending</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.pending || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl mr-5">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold uppercase mb-1">Delivered</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.delivered || 0}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/parcels" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center group">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 mr-4 group-hover:scale-110 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Parcels</h3>
            <p className="text-sm text-gray-500">Assign riders and update statuses.</p>
          </div>
        </Link>
        <Link href="/admin/riders" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center group">
          <div className="bg-green-100 p-4 rounded-full text-green-600 mr-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">My Riders</h3>
            <p className="text-sm text-gray-500">View your hub's riders.</p>
          </div>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Parcels */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Recent Parcels</h3>
            <Link href="/admin/parcels" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentParcels.map((parcel) => (
              <div key={parcel.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-lg"><Package className="w-5 h-5 text-gray-500" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{parcel.tracking_id}</p>
                    <p className="text-xs text-gray-500">To: {parcel.receiver_name} • {parcel.delivery_city}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${getStatusColor(parcel.status)}`}>
                  {parcel.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
            {recentParcels.length === 0 && (
              <div className="p-8 text-center text-gray-500">No parcels in your hub yet.</div>
            )}
          </div>
        </div>

        {/* My Riders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">My Riders</h3>
            <Link href="/admin/riders" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {riders.map((rider) => (
              <div key={rider.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600"><Bike className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{rider.name}</p>
                    <p className="text-xs text-gray-500">{rider.phone || "No phone"} • {rider.rider_type}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${rider.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {rider.is_available ? "Online" : "Offline"}
                </span>
              </div>
            ))}
            {riders.length === 0 && (
              <div className="p-8 text-center text-gray-500">No riders in your hub yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}