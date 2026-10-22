"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

export default function About() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Illustration */}
          <div className={`relative transition-all duration-1000 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[2rem] transform rotate-3"></div>
            <div className="relative bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Book Online</h4>
                    <p className="text-sm text-gray-500">Schedule a pickup in 2 minutes.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 ml-8">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900">We Pick Up</h4>
                    <p className="text-sm text-gray-500">Our rider collects from your door.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Safe Delivery</h4>
                    <p className="text-sm text-gray-500">Delivered securely to the destination.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className={`transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">About SwiftParcel</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-6">
              We connect people and businesses across the country.
            </h3>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              SwiftParcel is a technology-driven courier service built to make shipping simple. Whether you are sending a single document or managing an entire e-commerce business, we ensure your parcels reach their destination safely and on time.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Nationwide coverage with 64 districts",
                "Real-time tracking with live updates",
                "Cash on Delivery (COD) reconciliation",
                "Dedicated support for e-commerce merchants"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/register" className="inline-flex items-center bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:-translate-y-0.5">
              Join Us Today <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}