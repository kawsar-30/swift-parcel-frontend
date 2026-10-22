import { Truck, CheckCircle, Clock, MapPin } from "lucide-react";

type TimelineEvent = {
  status: string;
  note: string | null;
  location: string | null;
  created_at: string;
};

export default function TrackingTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  const getStatusIcon = (status: string, isLast: boolean) => {
    if (status === "DELIVERED") return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (isLast) return <Truck className="w-6 h-6 text-blue-600 animate-pulse" />;
    return <div className="w-5 h-5 rounded-full bg-gray-300 border-4 border-white shadow-sm mt-0.5"></div>;
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-8 border-b pb-4">Delivery Timeline</h2>
      <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4 space-y-10">
        {timeline.map((event, index) => {
          const isLast = index === timeline.length - 1;
          return (
            <div key={index} className="relative pl-8">
              {/* Timeline Icon */}
              <div className="absolute -left-[17px] top-1 bg-white rounded-full">
                {getStatusIcon(event.status, isLast)}
              </div>
              
              {/* Timeline Content */}
              <div className={`p-5 rounded-2xl border transition-all ${isLast ? "border-blue-200 bg-blue-50/50 shadow-sm" : "border-gray-100 bg-white"}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                  <h4 className={`font-bold text-lg ${isLast ? "text-blue-700" : "text-gray-800"}`}>
                    {event.status.replace(/_/g, " ")}
                  </h4>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(event.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{event.note || "Status updated by system"}</p>
                {event.location && (
                  <p className="text-xs text-gray-600 flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-lg inline-flex">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-red-500" /> {event.location}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}