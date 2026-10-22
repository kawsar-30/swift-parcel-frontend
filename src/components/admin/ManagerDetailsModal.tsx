"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { X, User, Mail, Phone, MapPin, Shield, Package, Bike, CheckCircle, Clock } from "lucide-react";

type ManagerDetails = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profile_picture: string | null;
  nid_number: string | null;
  address: string | null;
  hub_name: string | null;
  hub_city: string | null;
  hub_address: string | null;
  riders_count: number;
  total_parcels: number;
  delivered_parcels: number;
  pending_parcels: number;
};

export default function ManagerDetailsModal({
  isOpen,
  onClose,
  managerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  managerId: string | null;
}) {
  const [details, setDetails] = useState<ManagerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && managerId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/admin/managers/${managerId}/details`);
          setDetails(res.data);
        } catch (error) {
          console.error("Failed to fetch manager details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, managerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-purple-600" /> Manager Details
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
              {/* Manager Info */}
              <div className="flex items-center gap-4 bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-3xl overflow-hidden border-4 border-white shadow-md">
                  {details.profile_picture ? (
                    <img src={details.profile_picture} alt={details.name} className="w-full h-full object-cover" />
                  ) : (
                    details.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-purple-900">{details.name}</h4>
                  <p className="text-purple-700 text-sm flex items-center mt-1"><Mail className="w-4 h-4 mr-1"/> {details.email}</p>
                  <p className="text-purple-700 text-sm flex items-center mt-0.5"><Phone className="w-4 h-4 mr-1"/> {details.phone || "No phone"}</p>
                </div>
              </div>

              {/* Hub Info */}
              {details.hub_name ? (
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> Assigned Hub
                  </h4>
                  <p className="text-lg font-bold text-gray-800">{details.hub_name}</p>
                  <p className="text-sm text-gray-600">{details.hub_city}</p>
                  <p className="text-xs text-gray-500 mt-1">{details.hub_address}</p>
                </div>
              ) : (
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                  <p className="text-red-700 font-bold">⚠️ No hub assigned to this manager.</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bike className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Riders</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.riders_count}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-purple-50 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Parcels</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.total_parcels}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-yellow-50 text-yellow-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Pending</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.pending_parcels}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                  <div className="bg-green-50 text-green-600 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Delivered</p>
                  <p className="text-2xl font-extrabold text-gray-900">{details.delivered_parcels}</p>
                </div>
              </div>

              {/* Other Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">NID Number</p>
                  <p className="font-semibold text-gray-800">{details.nid_number || "Not provided"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-bold mb-1">Address</p>
                  <p className="font-semibold text-gray-800">{details.address || "Not provided"}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-red-500 py-8">Failed to load manager details.</div>
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