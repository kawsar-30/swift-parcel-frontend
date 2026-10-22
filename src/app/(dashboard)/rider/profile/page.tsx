"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User, Mail, Phone, Bike, MapPin, Package, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth";

type RiderProfile = {
  id: string;
  user_id: string;
  hub_id: string | null;
  vehicle_type: string;
  rider_type: string;
  is_available: boolean;
};

type Stats = {
  total_tasks: number;
  total_delivered: number;
  today_picked: number;
  today_delivered: number;
  week_picked: number;
  week_delivered: number;
};

export default function RiderProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RiderProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get("/riders/me"),
          api.get("/riders/me/stats"),
        ]);
        setProfile(profileRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">{user?.name}</h2>
        <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
          <Mail className="w-3.5 h-3.5 mr-1" /> {user?.email}
        </p>
        <p className="text-sm text-gray-500 flex items-center justify-center mt-1">
          <Phone className="w-3.5 h-3.5 mr-1" /> {user?.phone || "No phone"}
        </p>
        
        <div className="flex justify-center gap-2 mt-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${profile?.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {profile?.is_available ? 'Online' : 'Offline'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-700">
            {profile?.rider_type}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
            <Bike className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Vehicle</p>
            <p className="font-bold text-gray-900 text-sm">{profile?.vehicle_type}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-orange-50 p-2.5 rounded-lg text-orange-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase">Hub</p>
            <p className="font-bold text-gray-900 text-sm">Assigned</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Performance</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2"><Package className="w-4 h-4 text-blue-500"/> Total Tasks</span>
            <span className="font-bold text-gray-900">{stats?.total_tasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Total Delivered</span>
            <span className="font-bold text-gray-900">{stats?.total_delivered}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500"/> This Week</span>
            <span className="font-bold text-gray-900">{stats?.week_delivered} delivered</span>
          </div>
        </div>
      </div>
    </div>
  );
}