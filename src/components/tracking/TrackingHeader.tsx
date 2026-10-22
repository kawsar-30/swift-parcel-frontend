import { Package, MapPin } from "lucide-react";

type TrackingData = {
  tracking_id: string;
  status: string;
  receiver_name: string;
  delivery_city: string;
};

export default function TrackingHeader({ data }: { data: TrackingData }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white rounded-t-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-blue-200 font-medium mb-1">Tracking ID</p>
          <h1 className="text-3xl font-extrabold tracking-wider">{data.tracking_id}</h1>
        </div>
        <div className="text-right">
          <p className="text-blue-200 font-medium mb-1">Status</p>
          <span className="bg-white/20 px-3 py-1 rounded-full font-bold tracking-wide backdrop-blur-sm uppercase text-sm border border-white/30">
            {data.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
        <div>
          <p className="text-blue-200 text-xs mb-1 flex items-center"><Package className="w-3 h-3 mr-1" /> Receiver</p>
          <p className="font-bold text-lg">{data.receiver_name}</p>
        </div>
        <div>
          <p className="text-blue-200 text-xs mb-1 flex items-center"><MapPin className="w-3 h-3 mr-1" /> Destination</p>
          <p className="font-bold text-lg">{data.delivery_city}</p>
        </div>
      </div>
    </div>
  );
}