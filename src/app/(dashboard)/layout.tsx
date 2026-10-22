"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Package, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Truck, 
  Menu, 
  X, 
  Users, 
  MapPin, 
  BarChart3, 
  Shield, 
  Bike, 
  UserCircle, 
  Home, 
  MoreHorizontal,
  DollarSign, // <-- Notun Icon add kora holo
  UploadCloud
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const isMobileNavUser = user.role === "rider" || user.role === "customer";

  const getNavItems = () => {
    if (user.role === "customer") {
      return [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Parcels", href: "/dashboard/parcels", icon: Package },
        { name: "Book Parcel", href: "/dashboard/book", icon: PlusCircle },
        { name: "Bulk Upload", href: "/dashboard/bulk", icon: UploadCloud },
      ];
    } 
    if (user.role === "admin") {
      return [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Parcels", href: "/admin/parcels", icon: Package },
        { name: "Customers", href: "/admin/users", icon: Users },
        { name: "Managers", href: "/admin/managers", icon: Shield },
        { name: "Riders", href: "/admin/riders", icon: Bike },
        { name: "Zones", href: "/admin/zones", icon: MapPin },
        { name: "Hubs", href: "/admin/hubs", icon: MapPin },
        { name: "Pricing Rules", href: "/admin/pricing", icon: DollarSign }, // <-- Notun Menu Add kora holo
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ];
    }
    if (user.role === "manager") {
      return [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Parcels", href: "/admin/parcels", icon: Package },
        { name: "Riders", href: "/admin/riders", icon: Bike },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
       
      ];
    }
    if (user.role === "rider") {
      return [
        { name: "My Tasks", href: "/rider", icon: Package },
        { name: "Profile", href: "/rider/profile", icon: Users },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const customerMobileNav = [
    { name: "Home", href: "/", icon: Home },
    { name: "Parcels", href: "/dashboard/parcels", icon: Package },
    { name: "Book", href: "/dashboard/book", icon: PlusCircle },
    { name: "Bulk Upload", href: "/dashboard/bulk", icon: UploadCloud },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* More Menu Modal (Customer only) */}
      {isMoreMenuOpen && user.role === "customer" && (
        <div className="md:hidden fixed inset-0 z-[60] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300 mb-16">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">More Options</h3>
              <button onClick={() => setIsMoreMenuOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 transition-colors text-red-600 border border-red-100"
            >
              <div className="bg-red-50 p-2 rounded-lg text-red-600"><LogOut className="w-5 h-5" /></div>
              <span className="font-bold">Logout</span>
            </button>
          </div>
        </div>
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isMobileNavUser ? "hidden md:flex" : "flex"}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center">
            <Truck className="w-6 h-6 mr-2 text-blue-500" />
            <span className="text-xl font-bold tracking-wider">SwiftParcel</span>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-1">Logged in as</p>
            <p className="font-semibold truncate text-lg">{user.name}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${
              user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 
              user.role === 'manager' ? 'bg-orange-500/20 text-orange-400' : 
              user.role === 'rider' ? 'bg-green-500/20 text-green-400' : 
              'bg-blue-500/20 text-blue-400'
            }`}>
              {user.role}
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? "bg-blue-600 text-white shadow-lg" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" /> 
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center w-full px-4 py-3 text-slate-300 hover:text-red-400 rounded-lg transition-all">
            <LogOut className="w-5 h-5 mr-3" /> 
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 bg-white shadow-sm border-b border-gray-200 items-center px-4 md:px-8 justify-between sticky top-0 z-40 ${isMobileNavUser ? "hidden md:flex" : "flex"}`}>
          <div className="flex items-center">
            {!isMobileNavUser && (
              <button className="md:hidden mr-4 p-2 text-gray-600" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800">
              {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notification Bell - shudhu customer der jonno */}
            {user.role === "customer" && <NotificationBell />}
            
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto ${isMobileNavUser ? "pb-24 md:pb-0 bg-gray-50" : "p-4 md:p-8 bg-gray-50/50"}`}>
          <div className={isMobileNavUser ? "p-4 md:p-8" : "max-w-7xl mx-auto"}>
            {children}
          </div>
        </div>
      </main>

      {/* Customer Mobile Bottom Nav */}
      {user.role === "customer" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="h-16 bg-white border-t border-gray-200 shadow-2xl flex justify-around items-center">
            {customerMobileNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setIsMoreMenuOpen(true)}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] font-bold">More</span>
            </button>
          </div>
        </div>
      )}

      {/* Rider Mobile Bottom Nav (FAB Style) */}
      {user.role === "rider" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="relative h-20 bg-white border-t border-gray-200 shadow-2xl rounded-t-3xl">
            <div className="flex justify-around items-end h-full px-4 pb-4">
              <Link 
                href="/rider" 
                className={`flex flex-col items-center justify-center w-full space-y-1 pb-1 ${pathname === "/rider" ? "text-blue-600" : "text-gray-400"}`}
              >
                <Package className="w-6 h-6" />
                <span className="text-[10px] font-bold">Tasks</span>
              </Link>
              <div className="relative -top-6">
                <button 
                  onClick={logout}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/40 border-4 border-white"
                >
                  <LogOut className="w-7 h-7" />
                </button>
              </div>
              <Link 
                href="/rider/profile" 
                className={`flex flex-col items-center justify-center w-full space-y-1 pb-1 ${pathname === "/rider/profile" ? "text-blue-600" : "text-gray-400"}`}
              >
                <UserCircle className="w-6 h-6" />
                <span className="text-[10px] font-bold">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}