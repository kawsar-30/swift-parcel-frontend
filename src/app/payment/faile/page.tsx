// frontend/src/app/payment/fail/page.tsx
"use client";

import Link from "next/link";
import { XCircle, RefreshCcw } from "lucide-react";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-100 p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8">
          Your payment could not be processed. Please try again or choose Cash on Delivery.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/dashboard/parcels" 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold transition-all hover:bg-blue-700"
          >
            <RefreshCcw className="w-5 h-5" /> Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}