"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Package, Search, ExternalLink, Truck, CheckCircle, Clock, XCircle, ChevronRight, ArrowRight, CreditCard, AlertCircle } from "lucide-react";
import Link from "next/link";

type Parcel = {
  id: string;
  tracking_id: string;
  receiver_name: string;
  delivery_city: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_status: string | null; // <-- Payment status add koro
};

type FilterType = "all" | "transit" | "delivered" | "pending";

export default function MyParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await api.get("/parcels");
        setParcels(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch parcels", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, []);

  const handlePayment = async (parcelId: string, amount: number) => {
    setPayingId(parcelId);
    try {
      const res = await api.post(`/payments/${parcelId}/initiate`, {
        method: "bkash",
        amount: amount,
      });
      
      if (res.data.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else {
        alert("Payment initiated but no redirect URL found.");
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to initiate payment.");
    } finally {
      setPayingId(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING": return { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock };
      case "PICKUP_ASSIGNED": return { label: "Assigned", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck };
      case "PICKED_UP": return { label: "Picked Up", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Package };
      case "AT_HUB": return { label: "At Hub", color: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Package };
      case "IN_TRANSIT": return { label: "In Transit", color: "bg-cyan-100 text-cyan-700 border-cyan-200", icon: Truck };
      case "OUT_FOR_DELIVERY": return { label: "Out for Delivery", color: "bg-orange-100 text-orange-700 border-orange-200", icon: Truck };
      case "DELIVERED": return { label: "Delivered", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle };
      case "CANCELLED": return { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200", icon: XCircle };
      default: return { label: status.replace(/_/g, " "), color: "bg-gray-100 text-gray-700 border-gray-200", icon: Package };
    }
  };

  const filteredParcels = parcels.filter(p => {
    const matchesSearch = 
      p.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiver_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === "pending") return ["PENDING", "PICKUP_ASSIGNED"].includes(p.status);
    if (activeFilter === "transit") return ["PICKED_UP", "AT_HUB", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(p.status);
    if (activeFilter === "delivered") return p.status === "DELIVERED";
    
    return true;
  });

  const stats = {
    total: parcels.length,
    transit: parcels.filter(p => ["PICKED_UP", "AT_HUB", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(p.status)).length,
    delivered: parcels.filter(p => p.status === "DELIVERED").length,
  };

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Parcels</h2>
          <p className="text-gray-500 mt-1">Track and manage all your shipments.</p>
        </div>
        <Link 
          href="/dashboard/book" 
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-0.5"
        >
          + Book New Parcel
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><Truck className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Transit</p>
            <p className="text-2xl font-black text-gray-900">{stats.transit}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivered</p>
            <p className="text-2xl font-black text-gray-900">{stats.delivered}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by Tracking ID or Receiver..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { label: "All", value: "all" },
            { label: "Pending", value: "pending" },
            { label: "In Transit", value: "transit" },
            { label: "Delivered", value: "delivered" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value as FilterType)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === opt.value 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filteredParcels.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No parcels found</h3>
          <p className="text-gray-500 mb-6">You haven't booked any parcel matching this filter.</p>
          <Link href="/dashboard/book" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
            Book New Parcel <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tracking ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receiver</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredParcels.map((parcel) => {
                  const statusInfo = getStatusInfo(parcel.status);
                  const showPayButton = parcel.status === "PENDING" && parcel.payment_status !== "paid";
                  
                  return (
                    <tr key={parcel.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900">{parcel.tracking_id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(parcel.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{parcel.receiver_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{parcel.delivery_city}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${statusInfo.color}`}>
                          <statusInfo.icon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">৳ {parcel.total_amount}</span>
                          {parcel.payment_status === "paid" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md mt-1 w-fit">
                              <CheckCircle className="w-3 h-3" /> PAID
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md mt-1 w-fit">
                              <AlertCircle className="w-3 h-3" /> UNPAID
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right flex justify-end gap-2">
                        {showPayButton && (
                          <button 
                            onClick={() => handlePayment(parcel.id, parcel.total_amount)}
                            disabled={payingId === parcel.id}
                            className="inline-flex items-center gap-1.5 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                          >
                            <CreditCard className="w-4 h-4" /> {payingId === parcel.id ? "..." : "Pay Now"}
                          </button>
                        )}
                        <Link 
                          href={`/track/${parcel.tracking_id}`} 
                          className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                        >
                          Track <ExternalLink className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden space-y-4">
            {filteredParcels.map((parcel) => {
              const statusInfo = getStatusInfo(parcel.status);
              const showPayButton = parcel.status === "PENDING" && parcel.payment_status !== "paid";
              
              return (
                <div key={parcel.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{parcel.tracking_id}</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{new Date(parcel.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border uppercase ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Receiver</span>
                      <span className="text-sm font-bold text-gray-800">{parcel.receiver_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">City</span>
                      <span className="text-sm font-medium text-gray-700">{parcel.delivery_city}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-500">Total Amount</span>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-gray-900">৳ {parcel.total_amount}</span>
                        {parcel.payment_status === "paid" ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">PAID</span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">UNPAID</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0 flex gap-2">
                    {showPayButton && (
                      <button 
                        onClick={() => handlePayment(parcel.id, parcel.total_amount)}
                        disabled={payingId === parcel.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
                      >
                        <CreditCard className="w-4 h-4" /> {payingId === parcel.id ? "..." : "Pay"}
                      </button>
                    )}
                    <Link 
                      href={`/track/${parcel.tracking_id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-transform"
                    >
                      Track <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}