"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { X, Bike, MapPin, Phone, Mail, User, Package, CheckCircle, Clock, Shield } from "lucide-react";

type RiderDetails = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_picture: string | null;
  nid_number: string | null;
  address: string | null;
  hub_name: string | null;
  hub_city: string | null;
  vehicle_type: string;
  rider_type: string;
  is_available: boolean;
  total_tasks: number;
  delivered_tasks: number;
  pending_tasks: number;
};

export default function RiderDetailsModal({
  isOpen,
  onClose,
  riderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  riderId: string | null;
}) {
  const [details, setDetails] = useState<RiderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && riderId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/riders/${riderId}/details`);
          setDetails(res.data);
        } catch (error) {
          console.error("Failed to fetch rider details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, riderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <Bike className="w-6 h-6 mr-2 text-blue-600" /> Rider Details
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : details ? (
            <>
              {/* Profile Banner */}
              <div className="flex flex-col md:flex-row items-center gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl overflow-hidden border-4 border-white shadow-lg">
                  {details.profile_picture ? (
                    <img src={details.profile_picture} alt={details.name} className="w-full h-full object-cover" />
                  ) : (
                    details.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-2xl font-bold text-gray-900">{details.name}</h4>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {details.rider_type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${details.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {details.is_available ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Tasks</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.total_tasks}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-green-50 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Delivered</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.delivered_tasks}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-yellow-50 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pending</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.pending_tasks}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h5 className="font-bold text-gray-800">Contact Information</h5>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-700">{details.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-700">{details.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-700">NID: {details.nid_number || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-700">{details.address || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Hub Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                  <h5 className="font-bold text-gray-800">Assigned Hub</h5>
                </div>
                <div className="p-4">
                  {details.hub_name ? (
                    <div>
                      <p className="font-bold text-gray-900">{details.hub_name}</p>
                      <p className="text-sm text-gray-500">{details.hub_city}</p>
                      <p className="text-xs text-gray-400 mt-1">Vehicle: {details.vehicle_type}</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No hub assigned</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-red-500 py-8">Failed to load rider details.</div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}