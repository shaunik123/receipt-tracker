import { useState, useRef } from "react";
import { useUploadReceipt } from "@/hooks/use-receipts";
import { BottomNav } from "@/components/BottomNav";
import { Camera, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Scan() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadReceipt();
  const [_, setLocation] = useLocation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await uploadMutation.mutateAsync(formData);
      // Wait a bit to show success state before redirecting
      setTimeout(() => setLocation("/expenses"), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-md mx-auto p-6 h-[calc(100vh-6rem)] flex flex-col">
        <header className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Scan Receipt</h1>
          <p className="text-sm text-muted-foreground">Capture or upload for AI analysis</p>
        </header>

        <div className="flex-1 flex flex-col gap-6">
          {/* Main Upload Area */}
          <div className="flex-1 relative rounded-3xl overflow-hidden border-2 border-dashed border-white/10 bg-card/50 transition-all hover:bg-card hover:border-blue-500/30 group">
            {preview ? (
              <div className="absolute inset-0">
                <img src={preview} alt="Receipt preview" className="w-full h-full object-contain bg-black/40 backdrop-blur-sm" />
                <button 
                  onClick={clearFile}
                  className="absolute top-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Take a photo</h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Tap to launch camera or browse gallery
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment" // Forces rear camera on mobile
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Action Button */}
          {file && !uploadMutation.isSuccess && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Receipt...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload & Analyze
                  </>
                )}
              </button>
            </motion.div>
          )}

          {uploadMutation.isSuccess && (
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }}
              className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-emerald-400"
            >
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                <span className="font-semibold">Receipt Processed!</span>
                <span className="text-xs opacity-80">Redirecting to expenses...</span>
              </div>
            </motion.div>
          )}

          <div className="text-center text-xs text-muted-foreground/50">
            Supported formats: JPG, PNG. Max 10MB.
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
