"use client";

import { useEffect, useState } from "react";
import { Users, Package, MapPin, CheckCircle, TrendingUp } from "lucide-react";
import { useInView } from "@/hooks/useInView";

function CountUp({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(easeOut * end));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  const { ref, isInView } = useInView();

  const stats = [
    { icon: Users, value: 10, suffix: "K+", label: "Happy Customers", sub: "Trusted by thousands", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Package, value: 50, suffix: "K+", label: "Parcels Delivered", sub: "Safe & secure", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { icon: MapPin, value: 64, suffix: "", label: "Districts Covered", sub: "Nationwide network", color: "text-purple-400", bg: "bg-purple-500/10" },
    { icon: CheckCircle, value: 99, suffix: ".9%", label: "Success Rate", sub: "On-time guarantee", color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <section ref={ref} className="relative py-24 bg-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              style={{ transitionDelay: `${idx * 100}ms` }}
              className={`relative group bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8 rounded-3xl transition-all duration-700 hover:bg-white/10 hover:-translate-y-2 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${stat.bg} ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                <stat.icon className="w-7 h-7" />
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </h3>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              
              <p className="text-white font-bold text-base md:text-lg">{stat.label}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}