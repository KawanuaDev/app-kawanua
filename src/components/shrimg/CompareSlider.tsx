import { useRef, useState, useCallback } from "react";

interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
}

const CompareSlider = ({ beforeSrc, afterSrc }: CompareSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full cursor-col-resize select-none overflow-hidden bg-muted rounded-t-2xl"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* After (full background) */}
      <img
        src={afterSrc}
        alt="After"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Before (clipped) */}
      <img
        src={beforeSrc}
        alt="Before"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground/90 shadow-lg z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary border-2 border-primary-foreground flex items-center justify-center shadow-md">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-primary-foreground"
          >
            <path
              d="M4.5 3L1 7L4.5 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 3L13 7L9.5 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 bg-foreground/70 text-background text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md z-10">
        Original
      </span>
      <span className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md z-10">
        Optimized
      </span>
    </div>
  );
};

export default CompareSlider;
