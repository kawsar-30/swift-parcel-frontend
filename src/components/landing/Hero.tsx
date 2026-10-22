"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, ShieldCheck, Zap, MapPin } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [trackingId, setTrackingId] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/track/${trackingId.trim()}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white">
      {/* Background Pattern & Floating Shapes */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-sm mb-8 animate-fade-in-up">
          <Zap className="w-4 h-4" /> #1 Fastest Courier Service in Bangladesh
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight mb-6">
          Ship Smarter,<br />
          <span className="text-gradient">Deliver Faster.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Manage your parcels, track deliveries in real-time, and grow your business with the most reliable delivery network in the country.
        </p>

        {/* Tracking Form */}
        <form onSubmit={handleTrack} className="max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-2xl shadow-xl">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 absolute left-4" />
              <input
                type="text"
                placeholder="Enter your tracking ID (e.g., SP-20261018-XXXX)"
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 font-medium rounded-xl"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:scale-105">
              Track Now <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400 text-sm font-semibold">
          <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500" /> 100% Secure</div>
          <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500" /> 64 Districts Covered</div>
          <div className="flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500" /> Same Day Delivery</div>
        </div>
      </div>
    </section>
  );
}