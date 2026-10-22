"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { X, Building2, MapPin, User, Bike, Package, CheckCircle, Clock, Phone } from "lucide-react";

type Rider = {
  id: string;
  name: string;
  phone: string | null;
  vehicle_type: string;
  is_available: boolean;
};

type HubDetails = {
  id: string;
  name: string;
  city: string;
  address: string;
  manager_name: string | null;
  manager_phone: string | null;
  riders_count: number;
  riders: Rider[];
  total_parcels: number;
  pending_parcels: number;
  delivered_parcels: number;
};

export default function HubDetailsModal({
  isOpen,
  onClose,
  hubId,
}: {
  isOpen: boolean;
  onClose: () => void;
  hubId: string | null;
}) {
  const [details, setDetails] = useState<HubDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && hubId) {
      const fetchDetails = async () => {
        try {
          const res = await api.get(`/hubs/${hubId}/details`);
          setDetails(res.data);
        } catch (error) {
          console.error("Failed to fetch hub details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, hubId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-600" /> Hub Details
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : details ? (
            <>
              {/* Hub Info */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="text-2xl font-bold text-blue-900 mb-2">{details.name}</h4>
                <p className="text-blue-700 font-semibold flex items-center mb-1">
                  <MapPin className="w-4 h-4 mr-1" /> {details.city}
                </p>
                <p className="text-blue-600/80 text-sm">{details.address}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                  <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bike className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Riders</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.riders_count}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                  <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Total Parcels</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.total_parcels}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                  <div className="bg-yellow-50 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Pending</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.pending_parcels}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                  <div className="bg-green-50 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase">Delivered</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.delivered_parcels}</p>
                </div>
              </div>

              {/* Manager Info */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Hub Manager</h5>
                {details.manager_name ? (
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-600 mr-4">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{details.manager_name}</p>
                      <p className="text-gray-500 text-sm flex items-center">
                        <Phone className="w-3 h-3 mr-1" /> {details.manager_phone || "No phone"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">No manager assigned to this hub.</p>
                )}
              </div>

              {/* Riders List */}
              <div>
                <h5 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Riders in this Hub ({details.riders_count})</h5>
                {details.riders && details.riders.length > 0 ? (
                  <div className="space-y-3">
                    {details.riders.map((rider) => (
                      <div key={rider.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-3">
                            <Bike className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{rider.name}</p>
                            <p className="text-xs text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" /> {rider.phone || "No phone"} • {rider.vehicle_type}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${rider.is_available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                          {rider.is_available ? "Online" : "Offline"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center">No riders assigned to this hub yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="text-center text-red-500 py-8">Failed to load hub details.</div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}