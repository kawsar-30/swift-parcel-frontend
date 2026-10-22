"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Truck, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, PackageCheck, Zap, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // <-- নতুন স্টেট
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-800 font-medium";

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-700 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-2xl font-extrabold tracking-tight">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Truck className="w-6 h-6 text-white" />
          </div>
          SwiftParcel
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Join the Network. <br />
            <span className="text-blue-300">Start Shipping Today.</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Create an account to manage your parcels, track deliveries, and experience the fastest courier service.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-3 text-blue-100">
              <ShieldCheck className="w-5 h-5 text-blue-300" /> Secure Account Creation
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <PackageCheck className="w-5 h-5 text-blue-300" /> Bulk Upload Facility
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <Zap className="w-5 h-5 text-blue-300" /> Instant Tracking Updates
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
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your details to get started.
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="name"
                    type="text"
                    required
                    className={inputClass}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="email"
                    type="email"
                    required
                    className={inputClass}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="phone"
                    type="text"
                    className={inputClass}
                    placeholder="01712345678 (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className={inputClass}
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
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
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 mt-6 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 transform hover:-translate-y-0.5"
            >
              {loading ? "Creating account..." : "Register Now"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 font-medium pt-2">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}