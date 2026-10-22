// frontend/src/app/payment/success/page.tsx
"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, Package } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-100 p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Your payment has been processed successfully. Your parcel is now confirmed and will be processed shortly.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/dashboard/parcels" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold transition-all hover:bg-blue-700"
          >
            <Package className="w-5 h-5" /> View My Parcels
          </Link>
          <Link 
            href="/dashboard/book" 
            className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-700 border border-gray-200 py-3.5 rounded-xl font-bold transition-all hover:bg-gray-100"
          >
            Book Another Parcel <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}