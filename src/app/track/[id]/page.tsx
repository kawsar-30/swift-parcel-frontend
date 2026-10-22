"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Package, ChevronLeft } from "lucide-react";
import TrackingHeader from "@/components/tracking/TrackingHeader";
import TrackingTimeline from "@/components/tracking/TrackingTimeline";

type TimelineEvent = {
  status: string;
  note: string | null;
  location: string | null;
  created_at: string;
};

type TrackingData = {
  tracking_id: string;
  status: string;
  receiver_name: string;
  delivery_city: string;
  created_at: string;
  timeline: TimelineEvent[];
};

function TrackParcelContent() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await api.get(`/track/${id}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Tracking ID not found. Please check the ID and try again.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTracking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push("/")} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-fit">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
        </button>

        {error ? (
          <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Parcel Not Found</h2>
            <p className="text-gray-500">{error}</p>
          </div>
        ) : data ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <TrackingHeader data={data} />
            <TrackingTimeline timeline={data.timeline} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function TrackParcelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TrackParcelContent />
    </Suspense>
  );
}