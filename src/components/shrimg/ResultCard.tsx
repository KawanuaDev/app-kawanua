import { ArrowDown, FileImage } from "lucide-react";
import CompareSlider from "./CompareSlider";

interface ResultCardProps {
  result: {
    originalFile: File;
    compressedFile: File;
    originalUrl: string;
    compressedUrl: string;
  };
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const saved = result.originalFile.size - result.compressedFile.size;
  const percent = ((saved / result.originalFile.size) * 100).toFixed(1);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Compare Slider */}
      <CompareSlider
        beforeSrc={result.originalUrl}
        afterSrc={result.compressedUrl}
      />

      {/* Stats */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Original
            </p>
            <p className="text-lg font-bold text-foreground">
              {formatSize(result.originalFile.size)}
            </p>
          </div>
          <ArrowDown className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Hasil
            </p>
            <p className="text-lg font-bold text-primary">
              {formatSize(result.compressedFile.size)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 bg-primary/10 rounded-xl py-3 px-4">
          <FileImage className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary">
            Hemat {percent}% ({formatSize(saved)})
          </span>
        </div>

        <p className="text-xs text-muted-foreground text-center truncate">
          {result.originalFile.name}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;
