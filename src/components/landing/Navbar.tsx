"use client";

import Link from "next/link";
import { LayoutDashboard, Menu, X } from "lucide-react"; // Menu and X icon added
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo-full.png"
            alt="SwiftParcel" 
            width={160} 
            height={40} 
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors text-sm">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors text-sm">
            How it Works
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600 font-semibold transition-colors text-sm">
            Pricing
          </Link>
        </nav>

        {/* Desktop Auth Buttons & Mobile Menu Button */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {user ? (
            <Link 
              href={user.role === "customer" ? "/dashboard" : user.role === "rider" ? "/rider" : "/admin"}
              className="hidden md:flex items-center bg-gray-900 hover:bg-black text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-gray-900/20 hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="hidden md:block text-gray-600 hover:text-blue-600 font-bold transition-colors px-3 py-2 text-sm sm:text-base"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 text-sm sm:text-base hidden md:block"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 sm:top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              href="/#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-colors"
            >
              How it Works
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-blue-600 bg-blue-50 font-bold rounded-xl transition-colors"
            >
              Pricing
            </Link>
            
            <div className="border-t border-gray-100 my-2 pt-2"></div>
            
            {user ? (
              <Link 
                href={user.role === "customer" ? "/dashboard" : user.role === "rider" ? "/rider" : "/admin"}
                className="flex items-center bg-gray-900 text-white px-4 py-3 rounded-xl font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 text-gray-700 border border-gray-200 font-bold rounded-xl hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}