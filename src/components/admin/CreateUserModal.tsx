"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { X, UserPlus, Upload, Edit, MapPin, Bike } from "lucide-react";

export default function CreateUserModal({
  isOpen,
  onClose,
  roleType,
  onSuccess,
  editUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  roleType: "manager" | "rider";
  onSuccess: () => void;
  editUser?: any | null;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: roleType,
    profile_picture: "",
    nid_number: "",
    address: "",
    hub_id: "",
    vehicle_type: "Bike",
    rider_type: "both",
  });
  
  // city প্রপার্টির এরর ঠিক করতে city?: string যোগ করা হলো
  const [hubs, setHubs] = useState<{ id: string; name: string; city?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editUser) {
        setFormData({
          ...formData,
          name: editUser.name,
          email: editUser.email,
          phone: editUser.phone || "",
          profile_picture: editUser.profile_picture || "",
          nid_number: editUser.nid_number || "",
          address: editUser.address || "",
          password: "",
        });
      } else {
        setFormData((prev) => ({ ...prev, role: roleType }));
      }
      
      if (roleType === "rider" || roleType === "manager") {
        const fetchHubs = async () => {
          try {
            const res = await api.get("/hubs");
            setHubs(res.data);
          } catch (error) {
            console.error("Failed to fetch hubs", error);
          }
        };
        fetchHubs();
      }
    }
  }, [isOpen, roleType, editUser]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataImg = new FormData();
    formDataImg.append("file", file);

    try {
      const res = await api.post("/upload", formDataImg, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, profile_picture: res.data.url });
    } catch (error) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: roleType,
        profile_picture: formData.profile_picture || null,
        nid_number: formData.nid_number || null,
        address: formData.address || null,
      };

      if (roleType === "rider" || roleType === "manager") {
        if (!formData.hub_id) {
          alert(`Please select a Hub for the ${roleType}`);
          setSubmitting(false);
          return;
        }
        payload.hub_id = formData.hub_id;
      }
      if (roleType === "rider") {
        payload.vehicle_type = formData.vehicle_type;
        payload.rider_type = formData.rider_type;
      }

      if (editUser) {
        await api.patch(`/admin/users/${editUser.id}`, payload);
      } else {
        await api.post("/admin/users", payload);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Full Error:", error.response?.data);
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          const msgs = error.response.data.detail.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join('\n');
          alert(`Validation Error:\n${msgs}`);
        } else {
          alert(error.response.data.detail);
        }
      } else {
        alert("Failed to process request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 font-medium";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-extrabold text-gray-800 flex items-center">
            <span className="bg-blue-100 p-2 rounded-lg mr-3">
              {editUser ? <Edit className="w-5 h-5 text-blue-600" /> : <UserPlus className="w-5 h-5 text-blue-600" />}
            </span>
            {editUser ? "Update User" : `Create ${roleType === "manager" ? "Manager" : "Rider"}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-sm">
              {formData.profile_picture ? (
                <img src={formData.profile_picture} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400"><UserPlus className="w-6 h-6"/></div>
              )}
            </div>
            <div>
              <label className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold cursor-pointer hover:bg-blue-100 transition-colors flex items-center text-sm">
                <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading..." : "Upload Picture"}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <p className="text-xs text-gray-400 mt-1">Or paste URL below</p>
            </div>
          </div>

          <input type="text" value={formData.profile_picture} onChange={e => setFormData({...formData, profile_picture: e.target.value})} placeholder="Profile Image URL" className={inputClass} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Phone</label>
              <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} />
            </div>
          </div>
          
          {!editUser && (
            <>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1 block">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className={inputClass} />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">NID Number</label>
              <input type="text" value={formData.nid_number} onChange={e => setFormData({...formData, nid_number: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Address</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={inputClass} />
            </div>
          </div>

          {(roleType === "rider" || roleType === "manager") && (
            <div className={`grid gap-4 p-4 rounded-2xl border ${roleType === "rider" ? "grid-cols-2 bg-blue-50 border-blue-100" : "grid-cols-1 bg-orange-50 border-orange-100"}`}>
              <div>
                <label className={`text-sm font-bold mb-1 flex items-center ${roleType === "rider" ? "text-blue-800" : "text-orange-800"}`}>
                  <MapPin className="w-4 h-4 mr-1" /> Assign Hub *
                </label>
                <select required value={formData.hub_id} onChange={e => setFormData({...formData, hub_id: e.target.value})} className={inputClass}>
                  <option value="">Select a Hub</option>
                  {hubs.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city || 'City'})</option>)}
                </select>
              </div>
              
              {roleType === "rider" && (
                <>
                  <div>
                    <label className="text-sm font-bold text-blue-800 mb-1 flex items-center">
                      <Bike className="w-4 h-4 mr-1" /> Vehicle Type
                    </label>
                    <select value={formData.vehicle_type} onChange={e => setFormData({...formData, vehicle_type: e.target.value})} className={inputClass}>
                      <option value="Bike">Bike</option>
                      <option value="Cycle">Cycle</option>
                      <option value="Van">Van</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-bold text-blue-800 mb-1 flex items-center">
                      <UserPlus className="w-4 h-4 mr-1" /> Rider Type
                    </label>
                    <select value={formData.rider_type} onChange={e => setFormData({...formData, rider_type: e.target.value})} className={inputClass}>
                      <option value="both">Both (Pickup & Delivery)</option>
                      <option value="pickup">Pickup Only</option>
                      <option value="delivery">Delivery Only</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30">
            {submitting ? "Processing..." : (editUser ? "Update User" : "Create User")}
          </button>
        </div>
      </div>
    </div>
  );
}