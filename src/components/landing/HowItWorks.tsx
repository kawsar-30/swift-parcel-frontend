"use client";

import { Package, Truck, CheckCircle } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function HowItWorks() {
  const { ref, isInView } = useInView();

  const steps = [
    { icon: Package, title: "Book a Parcel", desc: "Fill in the details and schedule a pickup from your doorstep." },
    { icon: Truck, title: "We Pick Up", desc: "Our rider picks up your parcel and takes it to the nearest hub." },
    { icon: CheckCircle, title: "Delivered Safely", desc: "Your parcel reaches the destination securely and on time." },
  ];

  return (
    <section ref={ref} id="how-it-works" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">How It Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">Get your parcels delivered in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 z-0"></div>
          
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              style={{ transitionDelay: `${idx * 200}ms` }}
              className={`relative z-10 text-center flex flex-col items-center transition-all duration-1000 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="w-24 h-24 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center mb-6 shadow-xl hover:scale-110 transition-transform">
                <step.icon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}