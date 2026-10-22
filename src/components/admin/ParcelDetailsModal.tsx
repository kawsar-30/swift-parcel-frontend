"use client";

import { X, Package, MapPin, Phone, User } from "lucide-react";

type Parcel = {
  id: string;
  tracking_id: string;
  sender_name: string;
  sender_phone: string;
  pickup_address: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_address: string;
  delivery_city: string;
  parcel_type: string;
  weight_kg: number;
  delivery_type: string;
  cod_amount: number;
  delivery_charge: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: { id: string; item_name: string; quantity: number; unit_price: number }[];
  // Fallback properties for Pydantic underscore output
  _pickup_zone_name?: string;
  _delivery_zone_name?: string;
  _pickup_hub_name?: string;
  _delivery_hub_name?: string;
  pickup_zone_name?: string;
  delivery_zone_name?: string;
  pickup_hub_name?: string;
  delivery_hub_name?: string;
};

export default function ParcelDetailsModal({
  isOpen,
  onClose,
  parcel,
}: {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel | null;
}) {
  if (!isOpen || !parcel) return null;

  // Mapping function to handle both underscore and normal keys
  const getPickupZone = () => parcel.pickup_zone_name || parcel._pickup_zone_name || "N/A";
  const getDeliveryZone = () => parcel.delivery_zone_name || parcel._delivery_zone_name || "N/A";
  const getPickupHub = () => parcel.pickup_hub_name || parcel._pickup_hub_name || "N/A";
  const getDeliveryHub = () => parcel.delivery_hub_name || parcel._delivery_hub_name || "N/A";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-600" /> {parcel.tracking_id}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Booked on {new Date(parcel.created_at).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status & Amount Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">Status</p>
              <p className="text-lg font-extrabold text-blue-900">{parcel.status.replace(/_/g, " ")}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <p className="text-xs font-bold text-purple-800 uppercase mb-1">Total Amount</p>
              <p className="text-lg font-extrabold text-purple-900">৳ {parcel.total_amount}</p>
            </div>
          </div>

          {/* Addresses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                <User className="w-4 h-4 mr-2 text-gray-500" /> Sender
              </h4>
              <p className="font-semibold text-gray-900">{parcel.sender_name}</p>
              <p className="text-sm text-gray-600 flex items-center mt-1 mb-2"><Phone className="w-3 h-3 mr-1" /> {parcel.sender_phone}</p>
              <p className="text-sm text-gray-500 flex items-start"><MapPin className="w-4 h-4 mr-1 shrink-0 mt-0.5" /> {parcel.pickup_address}</p>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center border-b pb-2">
                <MapPin className="w-4 h-4 mr-2 text-green-500" /> Receiver
              </h4>
              <p className="font-semibold text-gray-900">{parcel.receiver_name}</p>
              <p className="text-sm text-gray-600 flex items-center mt-1 mb-2"><Phone className="w-3 h-3 mr-1" /> {parcel.receiver_phone}</p>
              <p className="text-sm text-gray-500 flex items-start"><MapPin className="w-4 h-4 mr-1 shrink-0 mt-0.5" /> {parcel.delivery_address}, <span className="font-bold text-gray-700 ml-1">{parcel.delivery_city}</span></p>
            </div>
          </div>

          {/* Routing Info Section */}
          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-blue-600" /> Routing Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Route */}
              <div>
                <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wider">Pickup Route</p>
                <p className="text-sm font-semibold text-gray-800 bg-white p-2 rounded-lg border border-blue-100 flex items-center">
                  <span className="text-gray-500 mr-2">Zone:</span> {getPickupZone()}
                </p>
                <div className="h-2 w-0.5 bg-blue-200 ml-4 my-1"></div>
                <p className="text-sm font-semibold text-gray-800 bg-white p-2 rounded-lg border border-blue-100 flex items-center">
                  <span className="text-gray-500 mr-2">Hub:</span> {getPickupHub()}
                </p>
              </div>
              {/* Delivery Route */}
              <div>
                <p className="text-xs font-bold text-green-800 mb-1 uppercase tracking-wider">Delivery Route</p>
                <p className="text-sm font-semibold text-gray-800 bg-white p-2 rounded-lg border border-green-100 flex items-center">
                  <span className="text-gray-500 mr-2">Hub:</span> {getDeliveryHub()}
                </p>
                <div className="h-2 w-0.5 bg-green-200 ml-4 my-1"></div>
                <p className="text-sm font-semibold text-gray-800 bg-white p-2 rounded-lg border border-green-100 flex items-center">
                  <span className="text-gray-500 mr-2">Zone:</span> {getDeliveryZone()}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold mb-1">Type</p>
              <p className="font-semibold text-gray-800 text-sm">{parcel.parcel_type}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold mb-1">Weight</p>
              <p className="font-semibold text-gray-800 text-sm">{parcel.weight_kg} kg</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold mb-1">Delivery</p>
              <p className="font-semibold text-gray-800 text-sm uppercase">{parcel.delivery_type}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold mb-1">COD Amount</p>
              <p className="font-semibold text-gray-800 text-sm">৳ {parcel.cod_amount}</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-bold">Delivery Charge</p>
              <p className="font-semibold text-gray-800">৳ {parcel.delivery_charge}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-bold">Total (with COD fee)</p>
              <p className="font-extrabold text-lg text-blue-700">৳ {parcel.total_amount}</p>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <Package className="w-4 h-4 mr-2 text-orange-500" /> Items ({parcel.items?.length || 0})
            </h4>
            {parcel.items && parcel.items.length > 0 ? (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-500">Item Name</th>
                      <th className="px-4 py-2 text-center text-xs font-bold text-gray-500">Qty</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-gray-500">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {parcel.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.item_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">৳ {item.unit_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg text-center">No items added for this parcel.</p>
            )}
          </div>
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