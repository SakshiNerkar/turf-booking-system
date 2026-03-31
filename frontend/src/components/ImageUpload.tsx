"use client";

import React, { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../lib/api";

type ImageUploadProps = {
  onUploadSuccess: (url: string) => void;
  token?: string | null;
  label?: string;
};

export function ImageUpload({ onUploadSuccess, token, label }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an operational image file (JPG/PNG/WEBP)");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setError(null);
    setStatus("idle");
  };

  const uploadFile = async () => {
    if (!file || !token) return;
    
    setStatus("uploading");
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Direct fetch for multipart/form-data as apiFetch is JSON-centric
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setStatus("success");
        onUploadSuccess(result.data.url);
      } else {
        throw new Error(result.error?.message || "Upload Failed");
      }
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic ml-2">{label}</label>}
      
      <div 
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative h-64 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-md group
          ${status === 'error' ? 'border-rose-500/40 bg-rose-500/5' : ''}
          ${status === 'success' ? 'border-emerald-500/40 bg-emerald-500/5' : ''}
          ${!file ? 'border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.08]' : 'border-transparent'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept="image/*"
        />

        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div 
              key="prompt"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl shadow-cyan-500/10">
                <Upload className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-wider italic">Ingest Venue Asset</p>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mt-1">Drag & Drop or Click to Browse</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={preview} className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Preview" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6">
                {status === 'idle' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); uploadFile(); }}
                    className="px-10 py-4 bg-cyan-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 transition-all shadow-2xl active:scale-95 italic"
                  >
                    Authenticate Upload
                  </button>
                )}

                {status === 'uploading' && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                    <p className="text-[8px] font-black text-white uppercase tracking-widest italic animate-pulse">Syncing to Operational Node...</p>
                  </div>
                )}

                {status === 'success' && (
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-4">
                    <CheckCircle className="w-12 h-12 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Asset Verified & Synchronized</p>
                  </motion.div>
                )}

                <button 
                  onClick={(e) => { e.stopPropagation(); clear(); }}
                  className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-rose-500/20 text-white hover:text-rose-500 rounded-xl transition-all backdrop-blur-md border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl"
        >
          <AlertCircle className="w-4 h-4 text-rose-500" />
          <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest italic">{error}</p>
        </motion.div>
      )}
    </div>
  );
}
