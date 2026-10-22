"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { X, Activity, MapPin } from "lucide-react";

export default function StatusUpdateModal({
  isOpen,
  onClose,
  parcelId,
  currentStatus,
  isDeliveryRider = false,
  isRider = false,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  parcelId: string;
  currentStatus: string;
  isDeliveryRider?: boolean;
  isRider?: boolean;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [hubs, setHubs] = useState<{ id: string; name: string }[]>([]);
  const [selectedHub, setSelectedHub] = useState("");

  const BASE_TRANSITIONS: Record<string, string[]> = {
    PENDING: ["PICKUP_ASSIGNED", "CANCELLED"],
    PICKUP_ASSIGNED: ["PICKED_UP", "PENDING"],
    PICKED_UP: ["AT_HUB"],
    AT_HUB: ["IN_TRANSIT", "OUT_FOR_DELIVERY"],
    IN_TRANSIT: ["AT_HUB", "OUT_FOR_DELIVERY"],
    OUT_FOR_DELIVERY: ["DELIVERED", "FAILED_ATTEMPT"],
    FAILED_ATTEMPT: ["OUT_FOR_DELIVERY", "RETURNED"],
    DELIVERED: [],
    RETURNED: [],
    CANCELLED: []
  };

  const getTransitions = () => {
    let transitions = BASE_TRANSITIONS[currentStatus] || [];
    
    // Jodi status RECEIVED_AT_ diye shuru hoy, tahole OUT_FOR_DELIVERY allow koro
    if (currentStatus.startsWith("RECEIVED_AT_")) {
      return ["OUT_FOR_DELIVERY"];
    }
    
    // Rider hole AT_HUB ba IN_TRANSIT korar permission nai
    if (isRider) {
      transitions = transitions.filter(s => !["AT_HUB", "IN_TRANSIT"].includes(s));
    }
    
    // Pickup rider er jonno: PICKED_UP -> AT_HUB
    if (isRider && currentStatus === "PICKED_UP" && !isDeliveryRider) {
      return ["AT_HUB"];
    }
    
    // Delivery rider er jonno: PICKED_UP -> OUT_FOR_DELIVERY
    if (isRider && currentStatus === "PICKED_UP" && isDeliveryRider) {
      return ["OUT_FOR_DELIVERY"];
    }
    
    return transitions;
  };

  const allowedStatuses = getTransitions();

  useEffect(() => {
    if (isOpen) {
      if (allowedStatuses.length > 0) {
        setStatus(allowedStatuses[0]);
      } else {
        setStatus(currentStatus);
      }
      setNote("");
      setLocation("");
      setSelectedHub("");

      const fetchHubs = async () => {
        try {
          const res = await api.get("/hubs");
          setHubs(res.data);
        } catch (error) {
          // Rider hole hubs fetch korle 403 error ashe, seta ignore koro
        }
      };
      fetchHubs();
    }
  }, [isOpen, currentStatus, isDeliveryRider, isRider]);

  const handleUpdate = async () => {
    if (!status) return;
    setLoading(true);
    try {
      // Jodi IN_TRANSIT hoy ar hub select kora thake, tahole RECEIVED_AT_ pathao
      if (currentStatus === "IN_TRANSIT" && selectedHub && !isRider) {
        const selectedHubData = hubs.find(h => h.id === selectedHub);
        const hubName = selectedHubData ? selectedHubData.name : "Hub";
        
        await api.patch(`/admin/parcels/${parcelId}/status`, {
          status: `RECEIVED_AT_${hubName.replace(/\s+/g, '_').toUpperCase()}`,
          note: note || `Received at ${hubName}`,
          location: hubName,
        });
      } else {
        // Normal status update
        await api.patch(`/admin/parcels/${parcelId}/status`, {
          status,
          note,
          location,
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 font-medium";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-extrabold text-gray-800 flex items-center">
            <span className="bg-purple-100 p-2 rounded-lg mr-3"><Activity className="w-5 h-5 text-purple-600" /></span>
            Update Status
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Current Status</label>
            <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-bold">
              {currentStatus.replace(/_/g, " ")}
            </div>
          </div>

          {currentStatus === "IN_TRANSIT" && !isRider ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-red-500" /> Receive at Hub *
              </label>
              <select 
                value={selectedHub} 
                onChange={(e) => setSelectedHub(e.target.value)}
                className={inputClass}
              >
                <option value="">Select Hub</option>
                {hubs.map((hub) => (
                  <option key={hub.id} value={hub.id}>{hub.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Parcel status will be updated to "RECEIVED AT [HUB NAME]"</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Status</label>
              {allowedStatuses.length > 0 ? (
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  {allowedStatuses.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold">
                  {isRider && currentStatus === "PICKED_UP" 
                    ? "Please use 'Drop at Hub' button to complete the pickup process."
                    : "This parcel has reached a final state or you don't have permission to update."}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Note (Optional)</label>
            <textarea 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Parcel received at hub" 
              className={`${inputClass} h-24 resize-none`}
              disabled={allowedStatuses.length === 0 && currentStatus !== "IN_TRANSIT"}
            ></textarea>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading || (currentStatus === "IN_TRANSIT" && !selectedHub && !isRider)}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-blue-600/30"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}