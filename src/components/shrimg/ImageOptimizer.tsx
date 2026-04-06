import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import DropZone from "./DropZone";
import ResultCard from "./ResultCard";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";

interface CompressionResult {
  originalFile: File;
  compressedFile: File;
  originalUrl: string;
  compressedUrl: string;
}

const ImageOptimizer = () => {
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setIsCompressing(true);
      setResult(null);

      try {
        const maxSizeMB = (quality / 100) * (file.size / 1024 / 1024);
        const options = {
          maxSizeMB: Math.max(maxSizeMB, 0.01),
          maxWidthOrHeight: 4096,
          useWebWorker: true,
          initialQuality: quality / 100,
        };

        const compressedFile = await imageCompression(file, options);

        setResult({
          originalFile: file,
          compressedFile,
          originalUrl: URL.createObjectURL(file),
          compressedUrl: URL.createObjectURL(compressedFile),
        });
      } catch (error) {
        console.error("Compression failed:", error);
      } finally {
        setIsCompressing(false);
      }
    },
    [quality],
  );

  const handleReset = () => {
    if (result) {
      URL.revokeObjectURL(result.originalUrl);
      URL.revokeObjectURL(result.compressedUrl);
    }
    setResult(null);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.compressedUrl;
    const ext = result.compressedFile.type.split("/")[1] || "jpg";
    a.download = `optimized-${result.originalFile.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-slide-up">
      {!result && !isCompressing && (
        <>
          <DropZone onFileSelect={handleFileSelect} />
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Kualitas Output
              </span>
              <span className="text-sm font-bold text-primary">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={(v) => setQuality(v[0])}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Semakin rendah = ukuran lebih kecil, kualitas sedikit berkurang
            </p>
          </div>
        </>
      )}

      {isCompressing && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">
            Mengoptimasi gambar...
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-4 animate-slide-up">
          <ResultCard result={result} />
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Gambar Baru
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Sparkles className="w-4 h-4 mr-2" />
              Unduh Hasil
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;
