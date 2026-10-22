"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Search,
  UserPlus,
  Activity,
  Truck,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  PackageSearch,
  Loader2,
} from "lucide-react";
import AssignRiderModal from "@/components/admin/AssignRiderModal";
import StatusUpdateModal from "@/components/admin/StatusUpdateModal";
import TransferHubModal from "@/components/admin/TransferHubModal";
import ParcelDetailsModal from "@/components/admin/ParcelDetailsModal";

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
  assigned_rider_id: string | null;
  assigned_rider_name: string | null;
  hub_id: string | null;
  pickup_hub_id: string | null;
  delivery_hub_id: string | null;
  payment_status: string | null;
  items: { id: string; item_name: string; quantity: number; unit_price: number }[];
};

type FilterType = "all" | "pending" | "picked_up" | "in_transit" | "delivered";

export default function AdminParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  
  // Custom Loading States
  const [isInitialLoading, setIsInitialLoading] = useState(true); // প্রথমবার পেজ লোডের জন্য
  const [isFetching, setIsFetching] = useState(false); // পেজ পরিবর্তনের জন্য

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  const [page, setPage] = useState(0);
  const [totalParcels, setTotalParcels] = useState(0);
  const limit = 15;

  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchParcels = async (isInitial = false) => {
    if (isInitial) setIsInitialLoading(true);
    else setIsFetching(true);

    try {
      const skip = page * limit;
      const res = await api.get(`/admin/parcels?skip=${skip}&limit=${limit}`);
      
      setParcels(Array.isArray(res.data.data) ? res.data.data : []);
      setTotalParcels(res.data.total || 0);
    } catch (error) {
      console.error("❌ Failed to fetch parcels", error);
      setParcels([]);
    } finally {
      if (isInitial) setIsInitialLoading(false);
      else setIsFetching(false);
    }
  };

  useEffect(() => {
    // প্রথমবার এবং পেজ পরিবর্তনের সময় কল হবে
    fetchParcels(page === 0 && parcels.length === 0); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setPage(0);
  }, [activeFilter, searchTerm, dateFrom, dateTo]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <span className="px-2.5 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-md whitespace-nowrap">Pending</span>;
      case "DELIVERED": return <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-md whitespace-nowrap">Delivered</span>;
      case "CANCELLED": return <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-md whitespace-nowrap">Cancelled</span>;
      case "PICKED_UP": return <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-md whitespace-nowrap">Picked Up</span>;
      case "IN_TRANSIT": return <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-md whitespace-nowrap">In Transit</span>;
      case "AT_HUB": return <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-800 rounded-md whitespace-nowrap">At Hub</span>;
      default: return <span className="px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-800 rounded-md whitespace-nowrap">{status.replace(/_/g, " ")}</span>;
    }
  };

  const filteredParcels = Array.isArray(parcels)
    ? parcels.filter((p) => {
        const matchesSearch =
          p.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.delivery_city.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter !== "all") {
          if (activeFilter === "pending" && !(p.status === "PENDING" || p.status === "PICKUP_ASSIGNED")) return false;
          if (activeFilter === "picked_up" && !(p.status === "PICKED_UP" || p.status === "AT_HUB")) return false;
          if (activeFilter === "in_transit" && !(p.status === "IN_TRANSIT" || p.status.startsWith("RECEIVED_AT_"))) return false;
          if (activeFilter === "delivered" && p.status !== "DELIVERED") return false;
        }

        if (dateFrom) {
          const parcelDate = new Date(p.created_at);
          const fromDate = new Date(dateFrom);
          if (parcelDate < fromDate) return false;
        }
        if (dateTo) {
          const parcelDate = new Date(p.created_at);
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (parcelDate > toDate) return false;
        }

        return true;
      })
    : [];

  const totalPages = Math.ceil(totalParcels / limit);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Parcels</h2>
          <p className="text-sm text-gray-500 mt-1">Assign riders, transfer hubs, and update delivery statuses.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Tracking ID, Receiver..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-shadow shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-20 bg-gray-50/95 backdrop-blur-sm py-2">
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex-1 flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Parcels", color: "bg-blue-600" },
              { id: "pending", label: "Pending", color: "bg-yellow-500" },
              { id: "picked_up", label: "Picked Up / At Hub", color: "bg-purple-600" },
              { id: "in_transit", label: "In Transit", color: "bg-indigo-600" },
              { id: "delivered", label: "Delivered", color: "bg-green-600" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as FilterType)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeFilter === f.id
                    ? `${f.color} text-white shadow-md transform scale-105`
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input type="date" className="text-sm font-medium text-gray-600 bg-transparent outline-none" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <span className="text-gray-400">-</span>
            <input type="date" className="text-sm font-medium text-gray-600 bg-transparent outline-none" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        
        {/* Overlay Loader for Page Transitions (Keeps previous data visible) */}
        {isFetching && !isInitialLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center transition-all duration-300">
            <div className="bg-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border border-gray-100">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-bold text-gray-700 text-sm">Loading page {page + 1}...</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Receiver</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Rider</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              
              {/* SKELETON LOADING (Only on first load) */}
              {isInitialLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-md w-32 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded-md w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded-md w-28 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded-md w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-md w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-md w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                        <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                /* ACTUAL DATA */
                filteredParcels.map((parcel, index) => (
                  <tr 
                    key={parcel.id} 
                    className="hover:bg-blue-50/40 transition-colors group animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'both' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">{parcel.tracking_id}</p>
                      <p className="text-xs text-gray-500">{new Date(parcel.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {parcel.receiver_name} <span className="text-xs text-gray-400 block">{parcel.delivery_city}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.assigned_rider_name ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-md border border-blue-100">
                          {parcel.assigned_rider_name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Not Assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {parcel.payment_status === "paid" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
                          <CheckCircle className="w-3 h-3" /> PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
                          <XCircle className="w-3 h-3" /> UNPAID
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(parcel.status)}</td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => { setSelectedParcel(parcel); setIsDetailsModalOpen(true); }} className="inline-flex items-center text-gray-600 hover:text-gray-900 bg-white shadow-sm border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all">
                          <Eye className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:inline">Details</span>
                        </button>
                        <button onClick={() => { setSelectedParcel(parcel); setIsAssignModalOpen(true); }} className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 border border-blue-100 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all">
                          <UserPlus className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:inline">Assign</span>
                        </button>
                        <button onClick={() => { setSelectedParcel(parcel); setIsStatusModalOpen(true); }} className="inline-flex items-center text-purple-600 hover:text-purple-900 bg-purple-50 border border-purple-100 hover:border-purple-200 px-3 py-1.5 rounded-lg transition-all">
                          <Activity className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:inline">Status</span>
                        </button>
                        <button onClick={() => { setSelectedParcel(parcel); setIsTransferModalOpen(true); }} className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 border border-indigo-100 hover:border-indigo-200 px-3 py-1.5 rounded-lg transition-all">
                          <Truck className="w-4 h-4 md:mr-1.5" /> <span className="hidden md:inline">Transfer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {/* EMPTY STATE */}
              {!isInitialLoading && filteredParcels.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <PackageSearch className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-bold text-gray-800">No parcels found</p>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination UI --- */}
        {!isInitialLoading && totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{page * limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min((page + 1) * limit, totalParcels)}</span> of <span className="font-bold text-gray-900">{totalParcels}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))} 
                disabled={page === 0 || isFetching} 
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center px-4 font-bold text-sm text-gray-700 bg-white border border-gray-200 py-2 rounded-lg shadow-sm">
                Page {page + 1} of {totalPages}
              </div>

              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} 
                disabled={page === totalPages - 1 || isFetching} 
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedParcel && (
        <>
          <ParcelDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} parcel={selectedParcel} />
          <AssignRiderModal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} parcel={selectedParcel} onSuccess={() => fetchParcels(false)} />
          <StatusUpdateModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} parcelId={selectedParcel.id} currentStatus={selectedParcel.status} onSuccess={() => fetchParcels(false)} />
          <TransferHubModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} parcelId={selectedParcel.id} currentHubId={selectedParcel.hub_id} onSuccess={() => fetchParcels(false)} />
        </>
      )}
    </div>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import api from "@/lib/api";
// import {
//   Search,
//   UserPlus,
//   Activity,
//   Truck,
//   Eye,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import AssignRiderModal from "@/components/admin/AssignRiderModal";
// import StatusUpdateModal from "@/components/admin/StatusUpdateModal";
// import TransferHubModal from "@/components/admin/TransferHubModal";
// import ParcelDetailsModal from "@/components/admin/ParcelDetailsModal";

// type Parcel = {
//   id: string;
//   tracking_id: string;
//   sender_name: string;
//   sender_phone: string;
//   pickup_address: string;
//   receiver_name: string;
//   receiver_phone: string;
//   delivery_address: string;
//   delivery_city: string;
//   parcel_type: string;
//   weight_kg: number;
//   delivery_type: string;
//   cod_amount: number;
//   delivery_charge: number;
//   total_amount: number;
//   status: string;
//   created_at: string;
//   assigned_rider_id: string | null;
//   assigned_rider_name: string | null;
//   hub_id: string | null;
//   pickup_hub_id: string | null;
//   delivery_hub_id: string | null;
//   payment_status: string | null;
//   items: { id: string; item_name: string; quantity: number; unit_price: number }[];
// };

// type FilterType = "all" | "pending" | "picked_up" | "in_transit" | "delivered";

// export default function AdminParcelsPage() {
//   const [parcels, setParcels] = useState<Parcel[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeFilter, setActiveFilter] = useState<FilterType>("all");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [page, setPage] = useState(0);
//   const limit = 15;

//   const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
//   const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
//   const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
//   const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
//   const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

//   const fetchParcels = async () => {
//     try {
//       const res = await api.get("/admin/parcels");
//       console.log("🔍 Admin Parcels API Response:", res.data);
//       setParcels(Array.isArray(res.data) ? res.data : []);
//     } catch (error) {
//       console.error("❌ Failed to fetch parcels", error);
//       setParcels([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchParcels();
//   }, []);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "PENDING":
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-md">
//             Pending
//           </span>
//         );
//       case "DELIVERED":
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-md">
//             Delivered
//           </span>
//         );
//       case "CANCELLED":
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-md">
//             Cancelled
//           </span>
//         );
//       case "PICKED_UP":
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-md">
//             Picked Up
//           </span>
//         );
//       case "IN_TRANSIT":
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-md">
//             In Transit
//           </span>
//         );
//       case "AT_HUB":
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-800 rounded-md">
//             At Hub
//           </span>
//         );
//       default:
//         return (
//           <span className="px-2.5 py-1 text-xs font-bold bg-gray-100 text-gray-800 rounded-md">
//             {status.replace(/_/g, " ")}
//           </span>
//         );
//     }
//   };

//   const filteredParcels = Array.isArray(parcels)
//     ? parcels.filter((p) => {
//         const matchesSearch =
//           p.tracking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           p.delivery_city.toLowerCase().includes(searchTerm.toLowerCase());

//         if (!matchesSearch) return false;

//         if (activeFilter !== "all") {
//           if (
//             activeFilter === "pending" &&
//             !(p.status === "PENDING" || p.status === "PICKUP_ASSIGNED")
//           )
//             return false;
//           if (
//             activeFilter === "picked_up" &&
//             !(p.status === "PICKED_UP" || p.status === "AT_HUB")
//           )
//             return false;
//           if (
//             activeFilter === "in_transit" &&
//             !(p.status === "IN_TRANSIT" || p.status.startsWith("RECEIVED_AT_"))
//           )
//             return false;
//           if (activeFilter === "delivered" && p.status !== "DELIVERED")
//             return false;
//         }

//         if (dateFrom) {
//           const parcelDate = new Date(p.created_at);
//           const fromDate = new Date(dateFrom);
//           if (parcelDate < fromDate) return false;
//         }
//         if (dateTo) {
//           const parcelDate = new Date(p.created_at);
//           const toDate = new Date(dateTo);
//           toDate.setHours(23, 59, 59, 999);
//           if (parcelDate > toDate) return false;
//         }

//         return true;
//       })
//     : [];

//   const totalPages = Math.ceil(filteredParcels.length / limit);
//   const paginatedParcels = filteredParcels.slice(page * limit, (page + 1) * limit);

//   useEffect(() => {
//     setPage(0);
//   }, [activeFilter, searchTerm, dateFrom, dateTo]);

//   if (loading)
//     return <div className="p-8 text-center text-gray-500">Loading parcels...</div>;

//   return (
//     <div className="space-y-6 pb-10">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
//             Manage Parcels
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Assign riders, transfer hubs, and update delivery statuses.
//           </p>
//         </div>
//         <div className="relative w-full md:w-80">
//           <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//           <input
//             type="text"
//             placeholder="Search by Tracking ID, Receiver..."
//             className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="sticky top-16 z-20 bg-gray-50/95 backdrop-blur-sm py-2">
//         <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
//           <div className="flex-1 flex flex-wrap gap-2">
//             <button
//               onClick={() => setActiveFilter("all")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
//                 activeFilter === "all"
//                   ? "bg-blue-600 text-white shadow-md"
//                   : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               All Parcels
//             </button>
//             <button
//               onClick={() => setActiveFilter("pending")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
//                 activeFilter === "pending"
//                   ? "bg-yellow-500 text-white shadow-md"
//                   : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => setActiveFilter("picked_up")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
//                 activeFilter === "picked_up"
//                   ? "bg-purple-600 text-white shadow-md"
//                   : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               Picked Up / At Hub
//             </button>
//             <button
//               onClick={() => setActiveFilter("in_transit")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
//                 activeFilter === "in_transit"
//                   ? "bg-indigo-600 text-white shadow-md"
//                   : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               In Transit
//             </button>
//             <button
//               onClick={() => setActiveFilter("delivered")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
//                 activeFilter === "delivered"
//                   ? "bg-green-600 text-white shadow-md"
//                   : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
//               }`}
//             >
//               Delivered
//             </button>
//           </div>

//           <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4">
//             <Calendar className="w-4 h-4 text-gray-400" />
//             <input
//               type="date"
//               className="text-sm font-medium text-gray-600 bg-transparent outline-none"
//               value={dateFrom}
//               onChange={(e) => setDateFrom(e.target.value)}
//             />
//             <span className="text-gray-400">-</span>
//             <input
//               type="date"
//               className="text-sm font-medium text-gray-600 bg-transparent outline-none"
//               value={dateTo}
//               onChange={(e) => setDateTo(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50/50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                   Tracking ID
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                   Receiver
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                   Assigned Rider
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                   Payment
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {paginatedParcels.map((parcel) => (
//                 <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <p className="font-bold text-gray-900">{parcel.tracking_id}</p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(parcel.created_at).toLocaleDateString()}
//                     </p>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {parcel.receiver_name}{" "}
//                     <span className="text-xs text-gray-400 block">
//                       {parcel.delivery_city}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {parcel.assigned_rider_name ? (
//                       <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-md">
//                         {parcel.assigned_rider_name}
//                       </span>
//                     ) : (
//                       <span className="text-xs text-gray-400 italic">
//                         Not Assigned
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {parcel.payment_status === "paid" ? (
//                       <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-full">
//                         <CheckCircle className="w-3 h-3" /> PAID
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full">
//                         <XCircle className="w-3 h-3" /> UNPAID
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(parcel.status)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-2">
//                     <button
//                       onClick={() => {
//                         setSelectedParcel(parcel);
//                         setIsDetailsModalOpen(true);
//                       }}
//                       className="inline-flex items-center text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       <Eye className="w-4 h-4 mr-1.5" /> Details
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedParcel(parcel);
//                         setIsAssignModalOpen(true);
//                       }}
//                       className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       <UserPlus className="w-4 h-4 mr-1.5" /> Assign
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedParcel(parcel);
//                         setIsStatusModalOpen(true);
//                       }}
//                       className="inline-flex items-center text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       <Activity className="w-4 h-4 mr-1.5" /> Status
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedParcel(parcel);
//                         setIsTransferModalOpen(true);
//                       }}
//                       className="inline-flex items-center text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
//                     >
//                       <Truck className="w-4 h-4 mr-1.5" /> Transfer
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {paginatedParcels.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
//                     No parcels found for this filter.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
//             <p className="text-sm text-gray-500">
//               Showing{" "}
//               <span className="font-bold text-gray-900">{page * limit + 1}</span>{" "}
//               to{" "}
//               <span className="font-bold text-gray-900">
//                 {Math.min((page + 1) * limit, filteredParcels.length)}
//               </span>{" "}
//               of{" "}
//               <span className="font-bold text-gray-900">
//                 {filteredParcels.length}
//               </span>{" "}
//               results
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setPage((p) => Math.max(0, p - 1))}
//                 disabled={page === 0}
//                 className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
//               >
//                 <ChevronLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//                 disabled={page === totalPages - 1}
//                 className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
//               >
//                 <ChevronRight className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {selectedParcel && (
//         <>
//           <ParcelDetailsModal
//             isOpen={isDetailsModalOpen}
//             onClose={() => setIsDetailsModalOpen(false)}
//             parcel={selectedParcel}
//           />
//           <AssignRiderModal
//             isOpen={isAssignModalOpen}
//             onClose={() => setIsAssignModalOpen(false)}
//             parcel={selectedParcel}
//             onSuccess={fetchParcels}
//           />
//           <StatusUpdateModal
//             isOpen={isStatusModalOpen}
//             onClose={() => setIsStatusModalOpen(false)}
//             parcelId={selectedParcel.id}
//             currentStatus={selectedParcel.status}
//             onSuccess={fetchParcels}
//           />
//           <TransferHubModal
//             isOpen={isTransferModalOpen}
//             onClose={() => setIsTransferModalOpen(false)}
//             parcelId={selectedParcel.id}
//             currentHubId={selectedParcel.hub_id}
//             onSuccess={fetchParcels}
//           />
//         </>
//       )}
//     </div>
//   );
// }