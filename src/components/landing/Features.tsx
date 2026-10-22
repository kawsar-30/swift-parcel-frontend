"use client";

import { ShieldCheck, MapPin, Truck, Clock, Package, Headphones } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function Features() {
  const { ref, isInView } = useInView();

  const features = [
    { icon: ShieldCheck, title: "Secure Handling", desc: "Your parcels are insured and handled with utmost care.", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: MapPin, title: "Real-time Tracking", desc: "Track your parcel's exact location in real-time from pickup to delivery.", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Truck, title: "Express Delivery", desc: "Need it fast? Choose our express delivery option for priority shipping.", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Clock, title: "On-Time Guarantee", desc: "We value your time. 99% of our deliveries are made on schedule.", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Package, title: "Bulk Shipping", desc: "Merchants can upload hundreds of parcels instantly via CSV.", color: "text-pink-600", bg: "bg-pink-50" },
    { icon: Headphones, title: "24/7 Support", desc: "Our dedicated support team is always here to help you.", color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  return (
    <section ref={ref} id="features" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Why Choose Us?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">We provide the best courier experience with cutting-edge technology and a dedicated team.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div 
              key={idx} 
              style={{ transitionDelay: `${idx * 100}ms` }}
              className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 group ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}