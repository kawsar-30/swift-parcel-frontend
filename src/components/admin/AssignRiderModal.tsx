"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { X, User, Bike, UserPlus, Wifi, WifiOff } from "lucide-react";

type Rider = {
  id: string;
  name: string;
  phone: string | null;
  vehicle_type: string;
  rider_type: string;
  is_available: boolean;
};

export default function AssignRiderModal({
  isOpen,
  onClose,
  parcel,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  parcel: any;
  onSuccess: () => void;
}) {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [selectedRider, setSelectedRider] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (isOpen && parcel) {
      const fetchRiders = async () => {
        setFetching(true);
        try {
          let hubId = null;
          let requiredRiderType = null;

          if (parcel.status === "PENDING") {
            hubId = parcel.pickup_hub_id;
            requiredRiderType = "pickup";
          } else if (["AT_HUB", "IN_TRANSIT", "OUT_FOR_DELIVERY", "RECEIVED_AT_"].includes(parcel.status) || parcel.status.startsWith("RECEIVED_AT_")) {
            hubId = parcel.delivery_hub_id || parcel.hub_id;
            requiredRiderType = "delivery";
          } else {
            hubId = parcel.hub_id || parcel.pickup_hub_id || parcel.delivery_hub_id;
          }

          if (!hubId) {
            setRiders([]);
            setFetching(false);
            return;
          }

          let url = `/riders/by-hub/${hubId}`;
          if (requiredRiderType) url += `?rider_type=${requiredRiderType}`;
          
          const res = await api.get(url);
          
          // Online rider age, offline pore
          const sortedRiders = (res.data || []).sort((a: Rider, b: Rider) => {
            if (a.is_available === b.is_available) return a.name.localeCompare(b.name);
            return a.is_available ? -1 : 1;
          });
          
          setRiders(sortedRiders);
        } catch (error) {
          console.error("❌ Failed to fetch riders:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchRiders();
    }
  }, [isOpen, parcel]);

  const handleAssign = async () => {
    if (!selectedRider) return;
    setLoading(true);
    try {
      await api.patch(`/admin/parcels/${parcel.id}/assign-rider`, {
        rider_id: selectedRider,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to assign rider");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const onlineRiders = riders.filter(r => r.is_available);
  const offlineRiders = riders.filter(r => !r.is_available);
  const selectedRiderData = riders.find(r => r.id === selectedRider);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-xl font-extrabold text-gray-800 flex items-center">
            <span className="bg-blue-100 p-2 rounded-lg mr-3"><UserPlus className="w-5 h-5 text-blue-600" /></span>
            Assign Rider
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : riders.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              No riders available for this hub.
            </div>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              
              {/* Online Riders */}
              {onlineRiders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <Wifi className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Online ({onlineRiders.length})</p>
                  </div>
                  <div className="space-y-2">
                    {onlineRiders.map((rider) => (
                      <RiderCard key={rider.id} rider={rider} selectedRider={selectedRider} setSelectedRider={setSelectedRider} />
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Riders */}
              {offlineRiders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 px-1 mt-4">
                    <WifiOff className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Offline ({offlineRiders.length})</p>
                  </div>
                  <div className="space-y-2 opacity-60">
                    {offlineRiders.map((rider) => (
                      <RiderCard key={rider.id} rider={rider} selectedRider={selectedRider} setSelectedRider={setSelectedRider} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedRider || loading}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg shadow-blue-600/30"
          >
            {loading ? "Assigning..." : selectedRiderData?.is_available === false ? "Assign (Offline)" : "Assign Rider"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RiderCard({ rider, selectedRider, setSelectedRider }: { rider: Rider; selectedRider: string; setSelectedRider: (id: string) => void }) {
  return (
    <label
      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
        selectedRider === rider.id
          ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-100 scale-[1.02]"
          : "border-gray-100 hover:border-blue-200 hover:bg-gray-50"
      }`}
    >
      <input
        type="radio"
        name="rider"
        value={rider.id}
        checked={selectedRider === rider.id}
        onChange={(e) => setSelectedRider(e.target.value)}
        className="w-5 h-5 text-blue-600 mr-4 focus:ring-blue-500 border-gray-300"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-gray-800 text-lg">{rider.name}</p>
          {rider.is_available ? (
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Online"></span>
          ) : (
            <span className="w-2 h-2 bg-gray-400 rounded-full" title="Offline"></span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs font-medium text-gray-500 flex items-center">
            <Bike className="w-3.5 h-3.5 mr-1 text-blue-400" /> {rider.vehicle_type}
          </p>
          <p className="text-xs font-medium text-gray-500 flex items-center">
            <User className="w-3.5 h-3.5 mr-1 text-gray-400" /> {rider.phone || "No phone"}
          </p>
        </div>
        <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${
          rider.rider_type === 'pickup' ? 'bg-purple-100 text-purple-700' :
          rider.rider_type === 'delivery' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {rider.rider_type}
        </span>
      </div>
    </label>
  );
}