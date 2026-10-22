"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function CTA() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Ready to <span className="text-blue-200">Ship?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of satisfied customers. Book your first parcel today and experience the fastest delivery network in the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="bg-white text-blue-700 hover:bg-gray-50 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                Send a Parcel <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/register" 
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center hover:-translate-y-1 backdrop-blur-sm"
              >
                For Business
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-blue-100 font-medium">
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-300" /> No hidden fees</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-300" /> Free pickup</div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className={`relative hidden lg:block transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] shadow-2xl animate-float">
              <div className="bg-white p-6 rounded-2xl shadow-sm mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">S</div>
                    <div>
                      <p className="font-bold text-gray-900">SwiftParcel</p>
                      <p className="text-xs text-gray-500">Tracking ID: SP-123</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Delivered</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full mb-4">
                  <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <div className="bg-white/50 p-4 rounded-xl text-white text-sm">
                "Fastest delivery service I've ever used!"
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}