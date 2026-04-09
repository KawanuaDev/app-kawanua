import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: "json" | "csv" | "text";
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  minRows?: number;
}

// Very simple syntax highlighter (we'll use a textarea approach for simplicity)
export default function CodeEditor({
  value,
  onChange,
  language = "text",
  placeholder,
  readOnly = false,
  className,
  minRows = 12,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta || readOnly) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue =
          value.substring(0, start) + "  " + value.substring(end);
        onChange?.(newValue);
        // restore cursor
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange, readOnly],
  );

  // Auto-resize
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(ta.scrollHeight, minRows * 24)}px`;
  }, [value, minRows]);

  const lineCount = value ? value.split("\n").length : 1;

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-950 dark:border-slate-700",
        className,
      )}
    >
      {/* Line numbers */}
      <div
        className="select-none border-r border-slate-700 bg-slate-900 px-3 py-3 text-right text-xs leading-6 text-slate-500 font-mono"
        aria-hidden="true"
      >
        {Array.from({ length: Math.max(lineCount, minRows) }, (_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        data-language={language}
        className={cn(
          "w-full resize-none bg-slate-950 px-4 py-3 font-mono text-sm leading-6 text-slate-100",
          "placeholder:text-slate-600",
          "focus:outline-none",
          "scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900",
          readOnly && "cursor-default select-all",
        )}
        style={{ minHeight: `${minRows * 24 + 24}px` }}
      />
    </div>
  );
}
