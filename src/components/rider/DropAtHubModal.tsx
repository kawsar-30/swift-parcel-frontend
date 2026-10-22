"use client";

import { useState } from "react";
import api from "@/lib/api";
import { MapPin, X } from "lucide-react";

export default function DropAtHubModal({
  isOpen,
  onClose,
  parcelId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  parcelId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDrop = async () => {
    setLoading(true);
    try {
      await api.patch(`/riders/tasks/${parcelId}/drop-at-hub`);
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to drop parcel");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-xl font-extrabold text-gray-800">Drop Parcel at Hub</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Are you sure you have delivered this parcel to your assigned hub? 
              Once dropped, this task will be removed from your list.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all">
              Cancel
            </button>
            <button
              onClick={handleDrop}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-600/30 flex items-center justify-center"
            >
              {loading ? "Dropping..." : <><MapPin className="w-4 h-4 mr-2"/> Drop at Hub</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}