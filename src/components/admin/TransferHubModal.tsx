"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { X, Truck } from "lucide-react";

export default function TransferHubModal({
  isOpen,
  onClose,
  parcelId,
  currentHubId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  parcelId: string;
  currentHubId: string | null;
  onSuccess: () => void;
}) {
  const [hubs, setHubs] = useState<{ id: string; name: string; city: string }[]>([]);
  const [selectedHub, setSelectedHub] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchHubs = async () => {
        try {
          const res = await api.get("/hubs");
          setHubs(res.data);
        } catch (error) {
          console.error("Failed to fetch hubs", error);
        } finally {
          setFetching(false);
        }
      };
      fetchHubs();
    }
  }, [isOpen]);

  const handleTransfer = async () => {
    if (!selectedHub) return;
    setLoading(true);
    try {
      await api.patch(`/admin/parcels/${parcelId}/transfer-hub`, {
        new_hub_id: selectedHub,
        note: note || "Parcel transferred to new hub",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to transfer hub");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-extrabold text-gray-800 flex items-center">
            <span className="bg-indigo-100 p-2 rounded-lg mr-3"><Truck className="w-5 h-5 text-indigo-600" /></span>
            Transfer Hub
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Destination Hub</label>
                <select 
                  value={selectedHub} 
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a Hub</option>
                  {hubs.map((hub) => (
                    <option key={hub.id} value={hub.id} disabled={hub.id === currentHubId}>
                      {hub.name} ({hub.city}) {hub.id === currentHubId ? " - Current" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Note (Optional)</label>
                <textarea 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Transferring to Chittagong Hub for final delivery" 
                  className={`${inputClass} h-24 resize-none`}
                ></textarea>
              </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedHub || loading || fetching}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/30"
          >
            {loading ? "Transferring..." : "Transfer Hub"}
          </button>
        </div>
      </div>
    </div>
  );
}