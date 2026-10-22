"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { MapPin, Plus, Building2, X } from "lucide-react";

type Zone = {
  id: string;
  name: string;
  city: string;
  hub_id: string | null;
};

type Hub = {
  id: string;
  name: string;
  city: string;
};

export default function AdminZonesPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", hub_id: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [zonesRes, hubsRes] = await Promise.all([
        api.get("/zones"),
        api.get("/hubs"),
      ]);
      setZones(zonesRes.data);
      setHubs(hubsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        city: formData.city,
      };
      if (formData.hub_id) payload.hub_id = formData.hub_id;

      await api.post("/zones", payload);
      setIsModalOpen(false);
      setFormData({ name: "", city: "", hub_id: "" });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to create zone");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium";

  if (loading) return <div className="p-8 text-center text-gray-500">Loading zones...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Zones</h2>
          <p className="text-sm text-gray-500 mt-1">Create delivery zones and assign them to hubs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Zone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => {
          const hub = hubs.find(h => h.id === zone.hub_id);
          return (
            <div key={zone.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{zone.name}</h3>
                <p className="text-sm text-purple-600 font-semibold mb-3 uppercase">{zone.city}</p>
                
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center">
                  <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 font-medium">
                    {hub ? hub.name : "No Hub Assigned"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Zone Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-extrabold text-gray-800">Add New Zone</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Zone Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Uttara" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">City</label>
                <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Dhaka" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Assign to Hub</label>
                <select value={formData.hub_id} onChange={e => setFormData({...formData, hub_id: e.target.value})} className={inputClass}>
                  <option value="">Select a Hub (Optional)</option>
                  {hubs.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30">
                {submitting ? "Creating..." : "Create Zone"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}