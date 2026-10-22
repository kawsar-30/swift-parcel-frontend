"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  DollarSign, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  ArrowRight, 
  Save, 
  TrendingUp,
  Package,
  Weight
} from "lucide-react";

type Hub = { id: string; name: string; city: string };
type PricingRule = { 
  id: string; 
  from_hub_id: string; 
  to_hub_id: string; 
  from_hub_name: string;
  to_hub_name: string;
  base_price: number; 
  per_kg_price: number; 
  express_multiplier: number 
};

export default function PricingRulesPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [fromHub, setFromHub] = useState("");
  const [toHub, setToHub] = useState("");
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [perKgPrice, setPerKgPrice] = useState<number | "">("");
  const [expressMultiplier, setExpressMultiplier] = useState<number | "">(1.5);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hubsRes, rulesRes] = await Promise.all([
        api.get("/hubs"),
        api.get("/admin/pricing-rules")
      ]);
      setHubs(hubsRes.data);
      setRules(rulesRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFromHub("");
    setToHub("");
    setBasePrice("");
    setPerKgPrice("");
    setExpressMultiplier(1.5);
  };

  const handleEditClick = (rule: PricingRule) => {
    setEditingId(rule.id);
    setFromHub(rule.from_hub_id);
    setToHub(rule.to_hub_id);
    setBasePrice(rule.base_price);
    setPerKgPrice(rule.per_kg_price);
    setExpressMultiplier(rule.express_multiplier);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this pricing rule?")) return;
    try {
      await api.delete(`/admin/pricing-rules/${id}`);
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete rule");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromHub || !toHub || !basePrice || !perKgPrice) return alert("Fill all required fields");

    const payload = {
      from_hub_id: fromHub,
      to_hub_id: toHub,
      base_price: Number(basePrice),
      per_kg_price: Number(perKgPrice),
      express_multiplier: Number(expressMultiplier) || 1.5
    };

    try {
      if (editingId) {
        await api.put(`/admin/pricing-rules/${editingId}`, payload);
      } else {
        await api.post("/admin/pricing-rules", payload);
      }
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save rule");
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-medium text-gray-800 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-3 shadow-sm shadow-blue-200/50">
              <TrendingUp className="w-3.5 h-3.5" /> Pricing Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Hub-to-Hub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pricing</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base">Manage delivery routes and configure dynamic pricing rules.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section (Left) */}
          <div className="lg:col-span-4 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 sticky top-24 transition-all duration-300 animate-in fade-in slide-in-from-left-4 delay-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {editingId ? (
                  <><Edit2 className="w-5 h-5 text-orange-500" /> Edit Route</>
                ) : (
                  <><Plus className="w-5 h-5 text-blue-600" /> New Route</>
                )}
              </h2>
              {editingId && (
                <button onClick={resetForm} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* From Hub */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" /> From Hub
                </label>
                <div className="relative">
                  <select value={fromHub} onChange={(e) => setFromHub(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Select Origin Hub</option>
                    {hubs.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* To Hub */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors" /> To Hub
                </label>
                <div className="relative">
                  <select value={toHub} onChange={(e) => setToHub(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`}>
                    <option value="">Select Destination Hub</option>
                    {hubs.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>

              {/* Prices */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-green-500 transition-colors" /> Base Price (৳)
                </label>
                <input type="number" value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className={inputClass} placeholder="e.g. 120" required />
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Weight className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" /> Per KG Price (৳)
                </label>
                <input type="number" value={perKgPrice} onChange={(e) => setPerKgPrice(Number(e.target.value))} className={inputClass} placeholder="e.g. 30" required />
              </div>

              <div className="space-y-1.5 group">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400 group-focus-within:text-purple-500 transition-colors" /> Express Multiplier
                </label>
                <input type="number" step="0.1" value={expressMultiplier} onChange={(e) => setExpressMultiplier(Number(e.target.value))} className={inputClass} placeholder="e.g. 1.5" />
              </div>
              
              <button 
                type="submit" 
                className={`w-full mt-4 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] shadow-lg ${
                  editingId 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/30' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30'
                }`}
              >
                {editingId ? <><Save className="w-5 h-5" /> Update Route</> : <><Plus className="w-5 h-5" /> Add Route</>}
              </button>
            </form>
          </div>

          {/* Table Section (Right) */}
          <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-right-4 delay-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200/60">
                    <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Route Details</th>
                    <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Base Fare</th>
                    <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Per KG</th>
                    <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Express</th>
                    <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                          Loading routes...
                        </div>
                      </td>
                    </tr>
                  ) : rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Package className="w-12 h-12 text-gray-200" />
                          No pricing routes configured yet.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule, index) => (
                      <tr 
                        key={rule.id} 
                        className="hover:bg-blue-50/40 transition-colors group animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-sm shadow-sm group-hover:bg-white transition-colors">
                              {rule.from_hub_name || "Unknown"}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                              {rule.to_hub_name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-extrabold text-green-600">৳{rule.base_price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-600">৳{rule.per_kg_price}<span className="text-xs text-gray-400 font-normal">/kg</span></span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                            {rule.express_multiplier}x
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button 
                              onClick={() => handleEditClick(rule)}
                              className="p-2 text-gray-500 bg-white shadow-sm border border-gray-200 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 rounded-xl transition-all transform hover:scale-105"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(rule.id)}
                              className="p-2 text-gray-500 bg-white shadow-sm border border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all transform hover:scale-105"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}