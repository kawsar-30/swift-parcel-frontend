"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, ArrowRight, MapPin, Truck, Package } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

type HubRule = {
  id: string;
  from_hub_name: string;
  to_hub_name: string;
  base_price: number;
  per_kg_price: number;
  express_multiplier: number;
};

export default function PublicPricingPage() {
  const [rules, setRules] = useState<HubRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.get("/public/pricing-rules");
        setRules(res.data.hub_rules);
      } catch (error) {
        console.error("Failed to load pricing", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const filteredRules = rules.filter(
    (r) =>
      r.from_hub_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.to_hub_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 font-sans">
      <Navbar />
      
      <main className="flex-1 pt-24 md:pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4 md:mb-6">
              <Package className="w-4 h-4" /> Transparent Pricing
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3 md:mb-4">
              Delivery Rate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Card</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Check our competitive hub-to-hub delivery charges. Fast, reliable, and transparent.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hub name (e.g. Tejgaon, Chattogram)..."
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-800 font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-40 md:h-24 shadow-sm border border-gray-100"></div>
               ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRules.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800">No routes found</h3>
              <p className="text-gray-500 mt-2">Try searching for a different hub name.</p>
            </div>
          )}

          {/* --- DESKTOP TABLE VIEW (Hidden on Mobile) --- */}
          {!loading && filteredRules.length > 0 && (
            <>
              <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500 delay-150">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200/60">
                      <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Route Details</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Base Fare (1kg)</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Per Extra KG</th>
                      <th className="px-6 py-5 text-xs font-extrabold text-gray-500 uppercase tracking-widest">Express Delivery</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100/80">
                    {filteredRules.map((rule, index) => (
                      <tr 
                        key={rule.id} 
                        className="hover:bg-blue-50/40 transition-colors group animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold text-sm shadow-sm group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-200">
                              {rule.from_hub_name}
                            </span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                              {rule.to_hub_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-xl font-extrabold text-green-600">৳ {rule.base_price}</span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="text-base font-bold text-gray-700">৳ {rule.per_kg_price}<span className="text-sm text-gray-400 font-normal"> /kg</span></span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg w-fit border border-purple-100">
                            <Truck className="w-4 h-4" />
                            {rule.express_multiplier}x Rate
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-gray-50/80 px-6 py-4 border-t border-gray-200/60">
                  <p className="text-sm text-gray-500 text-center font-medium">
                    * Base fare applies up to 1kg. Additional charges apply per extra kilogram.
                  </p>
                </div>
              </div>

              {/* --- MOBILE CARD VIEW (Hidden on Desktop) --- */}
              <div className="md:hidden space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                {filteredRules.map((rule, index) => (
                  <div 
                    key={rule.id} 
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-lg shadow-gray-200/30 animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    {/* Route Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 border-dashed">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">From</span>
                        <span className="font-bold text-gray-800 text-sm">{rule.from_hub_name}</span>
                      </div>
                      <div className="bg-blue-50 p-1.5 rounded-full">
                        <ArrowRight className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">To</span>
                        <span className="font-bold text-gray-800 text-sm">{rule.to_hub_name}</span>
                      </div>
                    </div>

                    {/* Prices Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-50/50 p-3 rounded-xl border border-green-100">
                        <span className="text-[11px] font-bold text-gray-500 block mb-1">Base Fare (1kg)</span>
                        <span className="text-lg font-extrabold text-green-600">৳ {rule.base_price}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                        <span className="text-[11px] font-bold text-gray-500 block mb-1">Per Extra KG</span>
                        <span className="text-lg font-extrabold text-gray-800">৳ {rule.per_kg_price}</span>
                      </div>
                    </div>

                    {/* Express Badge */}
                    <div className="flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 py-2 rounded-xl text-xs font-bold border border-purple-100">
                      <Truck className="w-4 h-4" /> Express Option: {rule.express_multiplier}x
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}