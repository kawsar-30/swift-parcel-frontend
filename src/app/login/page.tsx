"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Truck, Mail, Lock, ArrowRight, ShieldCheck, PackageCheck, Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- নতুন স্টেট
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      
      const userRes = await api.get("/auth/me");
      const role = userRes.data.role;
      
      if (role === "customer") router.push("/dashboard");
      else if (role === "admin" || role === "manager") router.push("/admin");
      else if (role === "rider") router.push("/rider");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 -right-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-2xl font-extrabold tracking-tight">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Truck className="w-6 h-6 text-white" />
          </div>
          SwiftParcel
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Ship Smarter, <br />
            <span className="text-blue-300">Deliver Faster.</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Manage your parcels, track deliveries in real-time, and grow your business with the most reliable delivery network.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3 text-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-300" /> 100% Secure & Reliable
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <PackageCheck className="w-5 h-5 text-blue-300" /> Real-time Parcel Tracking
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <Zap className="w-5 h-5 text-blue-300" /> Fastest Delivery in Bangladesh
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-200 font-medium">
         © 2026 SwiftParcel. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-8 left-6 sm:left-12 flex items-center gap-2 text-gray-800 font-bold lg:hidden">
          <Truck className="w-5 h-5 text-blue-600" /> SwiftParcel
        </Link>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-800 font-medium"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Password</label>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-800 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 transform hover:-translate-y-0.5"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 font-medium">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}