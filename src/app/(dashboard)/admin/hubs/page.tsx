"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { MapPin, Plus, Building2, X } from "lucide-react";
import HubDetailsModal from "@/components/admin/HubDetailsModal";

type Hub = {
  id: string;
  name: string;
  city: string;
  address: string;
  manager_id: string | null;
};

export default function AdminHubsPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  // Details Modal State
  const [selectedHubId, setSelectedHubId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchHubs = async () => {
    try {
      const res = await api.get("/hubs");
      setHubs(res.data);
    } catch (error) {
      console.error("Failed to fetch hubs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/hubs", formData);
      setIsModalOpen(false);
      setFormData({ name: "", city: "", address: "" });
      fetchHubs();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to create hub");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium";

  if (loading) return <div className="p-8 text-center text-gray-500">Loading hubs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Hubs</h2>
          <p className="text-sm text-gray-500 mt-1">View and add new delivery hubs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Hub
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hubs.map((hub) => (
          <div 
            key={hub.id} 
            onClick={() => {
              setSelectedHubId(hub.id);
              setIsDetailsModalOpen(true);
            }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 hover:border-blue-200 cursor-pointer transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{hub.name}</h3>
              <p className="text-sm text-blue-600 font-semibold mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {hub.city}
              </p>
              <p className="text-sm text-gray-500 border-t pt-3 border-gray-100">{hub.address}</p>
            </div>
          </div>
        ))}
        {hubs.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hubs created yet.</p>
          </div>
        )}
      </div>

      {/* Create Hub Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-xl font-extrabold text-gray-800">Add New Hub</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Hub Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dhaka Central Hub" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">City</label>
                <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Dhaka" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Full Address</label>
                <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="e.g. Mirpur 10, Dhaka" className={`${inputClass} h-24 resize-none`}></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30">
                {submitting ? "Creating..." : "Create Hub"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hub Details Modal */}
      <HubDetailsModal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        hubId={selectedHubId}
      />
    </div>
  );
}