"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "./api";
import { useRouter } from "next/navigation";

// @/types ইমপোর্টের এরর ঠিক করতে এখানেই User টাইপ ডিফাইন করা হলো
export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  profile_picture?: string | null;
  nid_number?: string | null;
  address?: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    Cookies.set("access_token", res.data.access_token);
    Cookies.set("refresh_token", res.data.refresh_token);
    
    await refreshUser();
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    
    setUser(null);
    
    router.push("/login");
    router.refresh(); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};


// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import api from "./api";
// import { User } from "@/types";
// import { useRouter } from "next/navigation"; // <-- useRouter import koro

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   refreshUser: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter(); // <-- router init koro

//   const refreshUser = async () => {
//     try {
//       const res = await api.get("/auth/me");
//       setUser(res.data);
//     } catch (error) {
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = Cookies.get("access_token");
//       if (token) {
//         await refreshUser();
//       }
//       setLoading(false);
//     };
//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const formData = new URLSearchParams();
//     formData.append("username", email);
//     formData.append("password", password);

//     const res = await api.post("/auth/login", formData, {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });

//     Cookies.set("access_token", res.data.access_token);
//     Cookies.set("refresh_token", res.data.refresh_token);
    
//     await refreshUser();
//   };

//   const logout = () => {
//     // Cookies clear koro
//     Cookies.remove("access_token");
//     Cookies.remove("refresh_token");
    
//     // State clear koro
//     setUser(null);
    
//     // Login page e redirect koro (with full reload to clear cache)
//     router.push("/login");
//     router.refresh(); 
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };