"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Package, Plus, Trash2, MapPin, User, Calculator, Loader2 } from "lucide-react";

type ParcelItem = {
  item_name: string;
  quantity: number;
  unit_price: number;
};

type Zone = {
  id: string;
  name: string;
  city: string;
};

type Estimate = {
  base_price: number;
  weight_charge: number;
  express_charge: number;
  cod_fee: number;
  total_amount: number;
};

export default function BookParcelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<ParcelItem[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  // Estimate State
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);

  const [formData, setFormData] = useState({
    sender_name: "",
    sender_phone: "",
    pickup_address: "",
    pickup_zone_id: "",
    receiver_name: "",
    receiver_phone: "",
    delivery_address: "",
    delivery_city: "",
    delivery_zone_id: "",
    weight_kg: 1,
    parcel_type: "Document",
    delivery_type: "standard",
    cod_amount: 0,
  });

  useEffect(() => {
    const fetchZones = async () => {
      try {
        const res = await api.get("/zones");
        setZones(res.data);
      } catch (error) {
        console.error("Failed to fetch zones");
      }
    };
    fetchZones();
  }, []);

  // চার্জ ক্যালকুলেট করার ফাংশন
  useEffect(() => {
    const fetchEstimate = async () => {
      // জোন সিলেক্ট না করলে বা ওয়েট না দিলে এস্টিমেট করবে না
      if (!formData.pickup_zone_id || !formData.delivery_zone_id || formData.weight_kg <= 0) {
        setEstimate(null);
        return;
      }

      setEstimating(true);
      try {
        const res = await api.post("/parcels/estimate", {
          weight_kg: formData.weight_kg,
          delivery_type: formData.delivery_type,
          cod_amount: formData.cod_amount,
          pickup_zone_id: formData.pickup_zone_id,
          delivery_zone_id: formData.delivery_zone_id,
        });
        setEstimate(res.data);
      } catch (error) {
        console.error("Failed to estimate charge", error);
        setEstimate(null);
      } finally {
        setEstimating(false);
      }
    };

    // Debounce (অনবরত এপিআই কল আটকাতে ৫০০ মিলি সেকেন্ড ওয়েট করবে)
    const timer = setTimeout(() => {
      fetchEstimate();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    formData.pickup_zone_id,
    formData.delivery_zone_id,
    formData.weight_kg,
    formData.delivery_type,
    formData.cod_amount,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const addItem = () => {
    setItems([...items, { item_name: "", quantity: 1, unit_price: 0 }]);
  };

  const updateItem = (index: number, field: keyof ParcelItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/parcels", { ...formData, items });
      router.push("/dashboard/parcels");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to book parcel. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 font-medium";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Book a New Parcel</h2>
        <p className="text-gray-500 mt-1">Fill in the details below to schedule a pickup.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        
        {/* Sender Info */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-blue-100 p-2 rounded-lg mr-3"><User className="w-5 h-5 text-blue-600" /></span> 
            Sender Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input name="sender_name" required placeholder="Sender Name" value={formData.sender_name} onChange={handleChange} className={inputClass} />
            <input name="sender_phone" required placeholder="Sender Phone (11 digits)" value={formData.sender_phone} onChange={handleChange} className={inputClass} />
            <div className="md:col-span-2">
              <input name="pickup_address" required placeholder="Pickup Address (Full)" value={formData.pickup_address} onChange={handleChange} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700 mb-1 block">Pickup Zone</label>
              <select name="pickup_zone_id" required value={formData.pickup_zone_id} onChange={handleChange} className={inputClass}>
                <option value="">Select Pickup Zone</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name} ({z.city})</option>)}
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Receiver Info */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-green-100 p-2 rounded-lg mr-3"><MapPin className="w-5 h-5 text-green-600" /></span>
            Receiver Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input name="receiver_name" required placeholder="Receiver Name" value={formData.receiver_name} onChange={handleChange} className={inputClass} />
            <input name="receiver_phone" required placeholder="Receiver Phone (11 digits)" value={formData.receiver_phone} onChange={handleChange} className={inputClass} />
            <div className="md:col-span-2">
              <input name="delivery_address" required placeholder="Delivery Address (Full)" value={formData.delivery_address} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Delivery City</label>
              <input name="delivery_city" required placeholder="e.g. Chittagong" value={formData.delivery_city} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 mb-1 block">Delivery Zone</label>
              <select name="delivery_zone_id" required value={formData.delivery_zone_id} onChange={handleChange} className={inputClass}>
                <option value="">Select Delivery Zone</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name} ({z.city})</option>)}
              </select>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Parcel Info */}
        <div className="space-y-5">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="bg-orange-100 p-2 rounded-lg mr-3"><Package className="w-5 h-5 text-orange-600" /></span>
            Parcel Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Weight (kg)</label>
              <input name="weight_kg" type="number" step="0.1" required value={formData.weight_kg} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Parcel Type</label>
              <select name="parcel_type" value={formData.parcel_type} onChange={handleChange} className={inputClass}>
                <option value="Document">Document</option>
                <option value="Electronics">Electronics</option>
                <option value="Fragile">Fragile</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Delivery Type</label>
              <select name="delivery_type" value={formData.delivery_type} onChange={handleChange} className={inputClass}>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-2 block">Cash on Delivery (Amount)</label>
              <input name="cod_amount" type="number" value={formData.cod_amount} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Items Section */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="bg-purple-100 p-2 rounded-lg mr-3"><Plus className="w-5 h-5 text-purple-600" /></span>
              Add Items (Optional)
            </h3>
            <button type="button" onClick={addItem} className="text-sm bg-purple-50 text-purple-600 px-4 py-2 rounded-xl font-bold hover:bg-purple-100 transition-colors">
              + Add Item
            </button>
          </div>
          
          {items.length === 0 && (
            <p className="text-sm text-gray-400 italic">No items added. You can leave this empty.</p>
          )}

          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input placeholder="Item Name (e.g. iPhone)" value={item.item_name} onChange={(e) => updateItem(index, "item_name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm bg-white" />
              <input placeholder="Qty" type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))} className="w-full md:w-24 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm bg-white" />
              <input placeholder="Unit Price" type="number" value={item.unit_price} onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value))} className="w-full md:w-32 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm bg-white" />
              <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg self-end md:self-center">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* --- নতুন প্রাইস এস্টিমেট সেকশন --- */}
        {estimating ? (
          <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex items-center justify-center text-blue-600 font-medium gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Calculating delivery charge...
          </div>
        ) : estimate ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 space-y-3">
            <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-blue-600" /> Price Breakdown
            </h4>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Base Charge</span>
              <span className="font-semibold text-gray-900">৳ {estimate.base_price}</span>
            </div>
            {estimate.weight_charge > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Extra Weight Charge</span>
                <span className="font-semibold text-gray-900">৳ {estimate.weight_charge}</span>
              </div>
            )}
            {estimate.express_charge > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Express Delivery Charge</span>
                <span className="font-semibold text-gray-900">৳ {estimate.express_charge}</span>
              </div>
            )}
            {estimate.cod_fee > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>COD Fee (1%)</span>
                <span className="font-semibold text-gray-900">৳ {estimate.cod_fee}</span>
              </div>
            )}
            <div className="border-t border-blue-200 pt-3 flex justify-between items-center mt-2">
              <span className="font-bold text-gray-800 text-lg">Total Amount</span>
              <span className="font-extrabold text-blue-700 text-2xl">৳ {estimate.total_amount}</span>
            </div>
          </div>
        ) : null}
        {/* ------------------------------ */}

        <div className="pt-4">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 text-lg">
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}