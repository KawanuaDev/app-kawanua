import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/jsoncsv/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/jsoncsv/ui/badge";
import CodeEditor from "@/components/jsoncsv/CodeEditor";
import StatsBar from "@/components/jsoncsv/StatsBar";
import { csvToJson } from "@/lib/converterJsonCsv";
import {
  ArrowRight,
  Clipboard,
  ClipboardCheck,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileJson,
  Sparkles,
} from "lucide-react";

const CSV_EXAMPLES = [
  {
    label: "Basic CSV",
    value: `id,name,age,email,city
1,Alice Johnson,28,alice@example.com,Jakarta
2,Bob Smith,34,bob@example.com,Bandung
3,Carol White,22,carol@example.com,Surabaya
4,David Lee,45,david@example.com,Yogyakarta`,
  },
  {
    label: "Semicolon separated",
    value: `product;price;stock;category
Widget Pro;29.99;150;Electronics
Gadget X;49.99;75;Electronics
Super Pen;4.99;500;Stationery`,
  },
  {
    label: "With quotes",
    value: `"first_name","last_name","bio"
"John","Doe","Software engineer, Jakarta"
"Jane","Smith","Designer & artist"
"Bob","Johnson","\"The best\" developer"`,
  },
];

export default function CsvToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState("auto");
  const [hasHeaders, setHasHeaders] = useState(true);
  const [inferTypes, setInferTypes] = useState(true);
  const [outputFormat, setOutputFormat] = useState<"array" | "object">("array");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<
    { rows: number; columns: number; size: string } | undefined
  >();
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) {
      setError("Masukkan data CSV untuk dikonversi.");
      return;
    }
    setIsConverting(true);
    setError(null);

    setTimeout(() => {
      const result = csvToJson(input, {
        delimiter,
        hasHeaders,
        inferTypes,
        outputFormat,
      });
      if (result.success && result.data !== undefined) {
        setOutput(result.data);
        setStats(result.stats);
        setError(null);
      } else {
        setError(result.error?.message ?? "Unknown error");
        setOutput("");
        setStats(undefined);
      }
      setIsConverting(false);
    }, 50);
  }, [input, delimiter, hasHeaders, inferTypes, outputFormat]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError(null);
    setStats(undefined);
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setInput((ev.target?.result as string) ?? "");
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [],
  );

  return (
    <div className="space-y-6">
      {/* Options bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Label
            htmlFor="delimiter-csv"
            className="whitespace-nowrap text-xs uppercase tracking-wide text-slate-500"
          >
            Delimiter
          </Label>
          <Select value={delimiter} onValueChange={setDelimiter}>
            <SelectTrigger id="delimiter-csv" size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Deteksi Otomatis</SelectItem>
              <SelectItem value=",">Koma (,)</SelectItem>
              <SelectItem value=";">Titik Koma (;)</SelectItem>
              <SelectItem value="\t">Tab (\t)</SelectItem>
              <SelectItem value="|">Pipe (|)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <Switch
            id="headers-csv"
            checked={hasHeaders}
            onCheckedChange={setHasHeaders}
          />
          <Label htmlFor="headers-csv" className="cursor-pointer text-sm">
            Headers
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="infer-csv"
            checked={inferTypes}
            onCheckedChange={setInferTypes}
          />
          <Label htmlFor="infer-csv" className="cursor-pointer text-sm">
            Infer Types
          </Label>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap text-xs uppercase tracking-wide text-slate-500">
            Output
          </Label>
          <Select
            value={outputFormat}
            onValueChange={(v) => setOutputFormat(v as "array" | "object")}
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="array">Array [ ]</SelectItem>
              <SelectItem value="object">Object &#123; &#125;</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">Contoh:</span>
          {CSV_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setInput(ex.value)}
              className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 transition hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                CSV
              </span>
              <Badge variant="success" className="text-xs">
                input
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="sr-only"
                  onChange={handleFileUpload}
                />
                <span className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  📂 Unggah
                </span>
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                className="h-7 px-2 text-xs"
              >
                <Clipboard className="size-3" /> Tempel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 px-2 text-xs text-red-500 hover:text-red-600"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>

          <CodeEditor
            value={input}
            onChange={setInput}
            language="csv"
            placeholder={`Tempel CSV Anda di sini...\n\nContoh:\nname,age,city\nAlice,28,Jakarta\nBob,34,Bandung`}
            minRows={18}
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <FileJson className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                JSON
              </span>
              <Badge variant="warning" className="text-xs">
                output
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
                className="h-7 px-2 text-xs"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="size-3 text-emerald-500" />{" "}
                    Disalin!
                  </>
                ) : (
                  <>
                    <Clipboard className="size-3" /> Salin
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={!output}
                className="h-7 px-2 text-xs"
              >
                <Download className="size-3" /> Unduh
              </Button>
            </div>
          </div>

          <CodeEditor
            value={output}
            language="json"
            readOnly
            placeholder="JSON yang dikonversi akan muncul di sini..."
            minRows={18}
          />

          {output && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              <span>Berhasil dikonversi</span>
              <StatsBar {...stats} />
            </div>
          )}
        </div>
      </div>

      {/* Convert button */}
      <div className="flex justify-center">
        <Button
          onClick={handleConvert}
          disabled={isConverting || !input.trim()}
          size="lg"
          className="w-64 gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
        >
          {isConverting ? (
            <RefreshCw className="size-5 animate-spin" />
          ) : (
            <Sparkles className="size-5" />
          )}
          {isConverting ? "Mengkonversi..." : "Konversi CSV → JSON"}
          {!isConverting && <ArrowRight className="size-5" />}
        </Button>
      </div>
    </div>
  );
}
