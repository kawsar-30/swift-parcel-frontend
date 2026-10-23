"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Search, Mail, Phone, ChevronLeft, ChevronRight, UserPlus, Loader2, Building2, Edit, Trash2 } from "lucide-react";
import CreateUserModal from "./CreateUserModal";
import ManagerDetailsModal from "./ManagerDetailsModal";
import RiderDetailsModal from "./RiderDetailsModal";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  profile_picture: string | null;
  nid_number: string | null;
  hub_id?: string | null;
};

type Hub = {
  id: string;
  name: string;
  city: string;
};

export default function UserTable({ role, title }: { role: string, title: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [selectedHub, setSelectedHub] = useState<string>("all");
  const limit = 15;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  
  const queryClient = useQueryClient();

  // 1. Fetch Users (React Query)
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users", role, page, selectedHub],
    queryFn: async () => {
      let url = `/admin/users?role=${role}&skip=${page * limit}&limit=${limit}`;
      if (selectedHub !== "all") {
        url += `&hub_id=${selectedHub}`;
      }
      const res = await api.get(url);
      const data = res.data;
      
      if (Array.isArray(data)) return { data, total: data.length };
      return { data: data.data || [], total: data.total || 0 };
    },
    staleTime: 5 * 60 * 1000,
  });

  const users = usersData?.data || [];
  const total = usersData?.total || 0;

  // 2. Fetch Hubs (React Query)
  const { data: hubs = [] } = useQuery<Hub[]>({
    queryKey: ["hubs"],
    queryFn: async () => {
      const res = await api.get("/hubs");
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // Hubs change hoy rarely
  });

  // 3. Fetch Current User (React Query)
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/admin/users/${userId}`);
      // Delete hole data refetch korbo
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete user");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const filteredUsers = Array.isArray(users) ? users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Manage {title}</h2>
          <p className="text-sm text-gray-500 mt-1">List of all {title.toLowerCase()} in the system.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          {/* Hub filter - shudhu Admin er jonno */}
          {currentUser?.role === "admin" && (
            <div className="relative w-full md:w-48">
              <Building2 className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedHub}
                onChange={(e) => {
                  setSelectedHub(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900"
              >
                <option value="all">All Hubs</option>
                {hubs.map((h: Hub) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="relative w-full md:w-64">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-900 placeholder-gray-400"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {(role === "manager" || role === "rider") && (
            <button 
              onClick={() => {
                setEditUser(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg shadow-blue-600/30"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Add {title.slice(0, -1)}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">Loading {title.toLowerCase()}...</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr 
                    key={u.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => {
                        if (role === "manager" || role === "rider") {
                          setSelectedUserId(u.id);
                          setIsDetailsModalOpen(true);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3 overflow-hidden">
                          {u.profile_picture ? (
                            <img src={u.profile_picture} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-0.5"><Mail className="w-3 h-3 mr-1"/> {u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <p className="flex items-center"><Phone className="w-4 h-4 mr-1 text-gray-400"/> {u.phone || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {(role === "manager" || role === "rider") && (
                        <>
                          <button 
                            onClick={() => {
                              setEditUser(u);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 mr-1.5" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(u.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      No {title.toLowerCase()} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-bold text-gray-900">{page * limit + 1}</span> to <span className="font-bold text-gray-900">{Math.min((page + 1) * limit, total)}</span> of <span className="font-bold text-gray-900">{total}</span> results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(role === "manager" || role === "rider") && (
        <CreateUserModal 
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false);
            setEditUser(null);
          }} 
          roleType={role as "manager" | "rider"} 
          onSuccess={() => {
            // Success hole data refetch korbo
            queryClient.invalidateQueries({ queryKey: ["users", role] });
            setIsModalOpen(false);
          }}
          editUser={editUser}
        />
      )}

      {role === "manager" && (
        <ManagerDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)} 
          managerId={selectedUserId}
        />
      )}

      {role === "rider" && (
        <RiderDetailsModal 
          isOpen={isDetailsModalOpen} 
          onClose={() => setIsDetailsModalOpen(false)} 
          riderId={selectedUserId}
        />
      )}
    </div>
  );
}