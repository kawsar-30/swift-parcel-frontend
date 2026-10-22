"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Package, MapPin, Phone, Navigation, CheckCircle, Clock, TrendingUp, Wifi, WifiOff } from "lucide-react";
import StatusUpdateModal from "@/components/admin/StatusUpdateModal";
import DropAtHubModal from "@/components/rider/DropAtHubModal";
import { useAuth } from "@/lib/auth";

type Task = {
  id: string;
  tracking_id: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_address: string;
  delivery_city: string;
  status: string;
  cod_amount: number;
  pickup_hub_id: string | null;
  delivery_hub_id: string | null;
  rider_type: string;
};

type Stats = {
  total_tasks: number;
  total_delivered: number;
  today_picked: number;
  today_delivered: number;
  week_picked: number;
  week_delivered: number;
};

export default function RiderTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, statsRes, profileRes] = await Promise.all([
        api.get("/riders/tasks"),
        api.get("/riders/me/stats"),
        api.get("/riders/me"),
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setIsAvailable(profileRes.data.is_available);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    const newValue = !isAvailable;
    setTogglingAvailability(true);
    try {
      await api.patch("/riders/me/availability", { is_available: newValue });
      setIsAvailable(newValue);
    } catch (error) {
      alert("Failed to update availability.");
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleStatusUpdateClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDropClick = (task: Task) => {
    setSelectedTask(task);
    setIsDropModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PICKUP_ASSIGNED": return <span className="px-2.5 py-1 text-[10px] font-bold bg-blue-100 text-blue-700 rounded-md uppercase tracking-wide">Assigned</span>;
      case "PICKED_UP": return <span className="px-2.5 py-1 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-md uppercase tracking-wide">Picked Up</span>;
      case "AT_HUB": return <span className="px-2.5 py-1 text-[10px] font-bold bg-indigo-100 text-indigo-700 rounded-md uppercase tracking-wide">At Hub</span>;
      case "OUT_FOR_DELIVERY": return <span className="px-2.5 py-1 text-[10px] font-bold bg-orange-100 text-orange-700 rounded-md uppercase tracking-wide">Out for Delivery</span>;
      case "DELIVERED": return <span className="px-2.5 py-1 text-[10px] font-bold bg-green-100 text-green-700 rounded-md uppercase tracking-wide">Delivered</span>;
      case "FAILED_ATTEMPT": return <span className="px-2.5 py-1 text-[10px] font-bold bg-red-100 text-red-700 rounded-md uppercase tracking-wide">Failed</span>;
      default: return <span className="px-2.5 py-1 text-[10px] font-bold bg-gray-100 text-gray-700 rounded-md uppercase tracking-wide">{status.replace(/_/g, " ")}</span>;
    }
  };

  const activeTasks = tasks.filter(t => t.status !== "DELIVERED" && t.status !== "FAILED_ATTEMPT");
  const historyTasks = tasks.filter(t => t.status === "DELIVERED" || t.status === "FAILED_ATTEMPT");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-5 shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Welcome back,</p>
            <h2 className="text-xl font-extrabold text-gray-900">{user?.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleAvailability}
              disabled={togglingAvailability}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-bold disabled:opacity-50 ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {isAvailable ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {isAvailable ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
            <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-blue-900">{stats?.today_picked || 0}</p>
            <p className="text-[10px] font-bold text-blue-700 uppercase">Today Picked</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-green-900">{stats?.today_delivered || 0}</p>
            <p className="text-[10px] font-bold text-green-700 uppercase">Today Delivered</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
            <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-xl font-extrabold text-purple-900">{stats?.total_delivered || 0}</p>
            <p className="text-[10px] font-bold text-purple-700 uppercase">Total Done</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-5 py-2 border-b border-gray-100 sticky top-[172px] z-20">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "active" ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-600"}`}
          >
            Active ({activeTasks.length})
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === "history" ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-600"}`}
          >
            History ({historyTasks.length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-4">
        {(activeTab === "active" ? activeTasks : historyTasks).length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-gray-300">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">
              {activeTab === "active" ? "No active tasks" : "No history yet"}
            </h3>
            <p className="text-gray-500 text-sm">
              {activeTab === "active" ? "You're all caught up!" : "Completed tasks will appear here."}
            </p>
          </div>
        ) : (
          (activeTab === "active" ? activeTasks : historyTasks).map((task) => {
            // NEW LOGIC: Is this a delivery rider?
            // Delivery rider if: status is OUT_FOR_DELIVERY, RECEIVED_AT_..., 
            // or rider_type is delivery, or (both AND status is RECEIVED_AT_...)
            const isDeliveryRider = 
              task.status === "OUT_FOR_DELIVERY" || 
              task.status.startsWith("RECEIVED_AT_") ||
              task.rider_type === "delivery" ||
              (task.rider_type === "both" && task.status.startsWith("RECEIVED_AT_"));
            
            // Show Drop at Hub only for pickup phase (rider needs to drop at hub)
            const showDropButton = task.status === "PICKED_UP" && !isDeliveryRider;

            return (
              <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{task.tracking_id}</p>
                    <h3 className="text-base font-extrabold text-gray-900">{task.receiver_name}</h3>
                  </div>
                  {getStatusBadge(task.status)}
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-50 p-2 rounded-lg shrink-0">
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">{task.delivery_address}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase mt-0.5">{task.delivery_city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                      <Phone className="w-4 h-4 text-blue-500" />
                    </div>
                    <a href={`tel:${task.receiver_phone}`} className="text-sm font-bold text-blue-600 underline">
                      {task.receiver_phone}
                    </a>
                  </div>

                  {task.cod_amount > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-200 flex justify-between items-center">
                      <span className="text-xs text-yellow-800 font-bold uppercase">Collect COD</span>
                      <span className="text-lg font-extrabold text-yellow-700">৳ {task.cod_amount}</span>
                    </div>
                  )}
                </div>

                {activeTab === "active" && (
                  <div className="p-4 bg-gray-50/50 border-t border-gray-100 space-y-2">
                    <button 
                      onClick={() => handleStatusUpdateClick(task)}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" /> Update Status
                    </button>
                    
                    {showDropButton && (
                      <button 
                        onClick={() => handleDropClick(task)}
                        className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" /> Drop at Hub
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {selectedTask && (
        <>
          <StatusUpdateModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            parcelId={selectedTask.id}
            currentStatus={selectedTask.status}
            isDeliveryRider={
              selectedTask.status === "OUT_FOR_DELIVERY" || 
              selectedTask.status.startsWith("RECEIVED_AT_") ||
              selectedTask.rider_type === "delivery" ||
              (selectedTask.rider_type === "both" && selectedTask.status.startsWith("RECEIVED_AT_"))
            }
            isRider={true}
            onSuccess={fetchData}
          />
          <DropAtHubModal 
            isOpen={isDropModalOpen} 
            onClose={() => setIsDropModalOpen(false)} 
            parcelId={selectedTask.id}
            onSuccess={fetchData}
          />
        </>
      )}
    </div>
  );
}