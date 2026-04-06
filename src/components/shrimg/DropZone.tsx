import { useCallback, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

const DropZone = ({ onFileSelect }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            "Ukuran file melebihi 5MB. Silakan pilih file yang lebih kecil.",
          );
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            "Ukuran file melebihi 5MB. Silakan pilih file yang lebih kecil.",
          );
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  return (
    <label
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full min-h-[280px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-primary bg-secondary scale-[1.02] shadow-lg"
          : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <div
        className={`flex flex-col items-center gap-4 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {isDragging ? "Lepaskan gambar di sini" : "Seret & lepas gambar"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            atau klik untuk memilih file • PNG, JPG, WebP • Maks 5MB
          </p>
        </div>
      </div>
    </label>
  );
};

export default DropZone;
