"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { UploadCloud, FileText, CheckCircle2, XCircle, AlertCircle, Download, Loader2 } from "lucide-react";

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Drag and Drop Handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setError("");
      setResult(null);
    } else {
      setError("Please upload a valid CSV file.");
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
      setResult(null);
    } else {
      setError("Please upload a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/bulk/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      setFile(null); // Clear file after success
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to process CSV. Please check the format.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bulk Parcel Upload</h2>
        <p className="text-sm text-gray-500 mt-1">Upload multiple parcels at once using a CSV file.</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        
        {/* Instructions & Template Download */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-800">CSV Format Requirements</p>
              <p className="text-xs text-gray-600 mt-1">
                Your CSV must include: sender_name, sender_phone, pickup_address, pickup_zone, receiver_name, receiver_phone, delivery_address, delivery_city, delivery_zone, weight_kg, parcel_type, delivery_type.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-200 hover:bg-blue-50 transition-colors whitespace-nowrap">
            <Download className="w-4 h-4" /> Template
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 ${
            isDragging ? "border-blue-500 bg-blue-50/50 scale-[1.02]" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
            <UploadCloud className="w-8 h-8" />
          </div>
          
          {file ? (
            <div>
              <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> {file.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-gray-800">Click or drag CSV file to this area</p>
              <p className="text-sm text-gray-500 mt-1">Only .csv files are supported</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 font-medium text-sm flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              "Upload & Process"
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" /> Upload Results
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p className="text-sm font-bold text-green-700 mb-1">Successful</p>
              <p className="text-3xl font-extrabold text-green-600">{result.successful}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <p className="text-sm font-bold text-red-700 mb-1">Failed</p>
              <p className="text-3xl font-extrabold text-red-600">{result.failed}</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Error Details (Max 10):</p>
              <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto border border-gray-200">
                <ul className="space-y-2">
                  {result.errors.map((err: string, idx: number) => (
                    <li key={idx} className="text-sm text-red-600 flex items-start gap-2">
                      <XCircle className="w-4 h-4 mt-0.5 shrink-0" /> {err}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}