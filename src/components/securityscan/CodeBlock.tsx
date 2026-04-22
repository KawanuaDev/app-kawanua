import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js/lib/core";

// Register only the languages we need (keeps bundle small)
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import nginx from "highlight.js/lib/languages/nginx";
import xml from "highlight.js/lib/languages/xml"; // covers HTML
import plaintext from "highlight.js/lib/languages/plaintext";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("text", plaintext);

const LANG_ALIAS: Record<string, string> = {
  js: "javascript",
  sh: "bash",
  nginx: "nginx",
  html: "html",
  text: "text",
};

interface CodeBlockProps {
  code: string;
  lang: string;
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const resolvedLang = LANG_ALIAS[lang] ?? lang;

  useEffect(() => {
    if (!ref.current) return;
    ref.current.removeAttribute("data-highlighted");
    ref.current.className = `language-${resolvedLang}`;
    ref.current.textContent = code;
    hljs.highlightElement(ref.current);
  }, [code, resolvedLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden border border-zinc-700/50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-[10px] font-mono font-semibold text-zinc-400 uppercase tracking-widest">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code area */}
      <pre className="m-0 bg-zinc-900 overflow-x-auto text-[11.5px] leading-relaxed p-4">
        <code ref={ref} className={`language-${resolvedLang} hljs`} />
      </pre>

      {/* Inline hljs theme — scoped to this component tree */}
      <style>{`
        .hljs { background: transparent; color: #abb2bf; }
        .hljs-comment, .hljs-quote { color: #5c6370; font-style: italic; }
        .hljs-keyword, .hljs-selector-tag, .hljs-built_in { color: #c678dd; }
        .hljs-string, .hljs-attr { color: #98c379; }
        .hljs-number, .hljs-literal { color: #d19a66; }
        .hljs-title, .hljs-section, .hljs-function { color: #61afef; }
        .hljs-variable, .hljs-template-variable { color: #e06c75; }
        .hljs-type, .hljs-class { color: #e5c07b; }
        .hljs-meta, .hljs-doctag { color: #56b6c2; }
        .hljs-bullet, .hljs-symbol { color: #61afef; }
        .hljs-regexp { color: #56b6c2; }
        .hljs-emphasis { font-style: italic; }
        .hljs-strong { font-weight: bold; }
        .hljs-addition { color: #98c379; background: rgba(152,195,121,0.08); }
        .hljs-deletion { color: #e06c75; background: rgba(224,108,117,0.08); }
      `}</style>
    </div>
  );
}
