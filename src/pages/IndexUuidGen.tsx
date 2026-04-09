import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import HeaderApp from "@/components/HeaderApp";
import { Asterisk } from "lucide-react";

// Card component (shadcn-style)
function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight text-slate-900",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

// Button component (shadcn-style)
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline:
      "border border-slate-200 bg-transparent hover:bg-slate-100 hover:text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-xs",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

// Input component (shadcn-style)
function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

// Label component (shadcn-style)
function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

// Badge component (shadcn-style)
function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
}

// Tabs component (shadcn-style)
function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [internalTab, setInternalTab] = useState(defaultValue || "");
  const currentActiveTab = value !== undefined ? value : internalTab;
  const currentSetActiveTab =
    onValueChange !== undefined ? onValueChange : setInternalTab;

  return (
    <div className={cn("", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab: currentActiveTab,
            setActiveTab: currentSetActiveTab,
          });
        }
        return child;
      })}
    </div>
  );
}

function TabsList({
  className,
  activeTab,
  setActiveTab,
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500",
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            setActiveTab,
          });
        }
        return child;
      })}
    </div>
  );
}

function TabsTrigger({
  value,
  className,
  activeTab,
  setActiveTab,
  children,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}) {
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-slate-950 shadow-sm"
          : "hover:text-slate-900 hover:bg-slate-200/50",
        className,
      )}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({
  value,
  className,
  activeTab,
  children,
}: React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  activeTab: string;
}) {
  if (value !== activeTab) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

// UUID generation functions
function generateUUIDv4(): string {
  return crypto.randomUUID();
}

function generateUUIDv1(): string {
  // Simulate UUID v1 (time-based)
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  const timeHex = timestamp.toString(16).padStart(12, "0");
  const clockHex = Math.floor(Math.random() * 4096)
    .toString(16)
    .padStart(3, "0");
  const nodeHex = Array.from(randomBytes)
    .slice(0, 6)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const uuid = `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${clockHex.slice(1)}-${nodeHex.slice(0, 4)}-${nodeHex.slice(4)}`;
  return uuid;
}

function generateUUIDNil(): string {
  return "00000000-0000-0000-0000-000000000000";
}

export default function UuidGenPage() {
  const [currentUUID, setCurrentUUID] = useState("");
  const [uuidVersion, setUuidVersion] = useState<"v4" | "v1" | "nil">("v4");
  const [uuidCount, setUuidCount] = useState(3);
  const [multipleUUIDs, setMultipleUUIDs] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("single");

  // Reset states when switching tabs
  useEffect(() => {
    if (activeTab === "multiple") {
      setUuidCount(3);
      setMultipleUUIDs([]);
    }
  }, [activeTab]);

  const generateUUID = useCallback(() => {
    let uuid: string;
    switch (uuidVersion) {
      case "v1":
        uuid = generateUUIDv1();
        break;
      case "nil":
        uuid = generateUUIDNil();
        break;
      default:
        uuid = generateUUIDv4();
    }
    setCurrentUUID(uuid);
    setHistory((prev) => [uuid, ...prev].slice(0, 20));
  }, [uuidVersion]);

  const generateMultipleUUIDs = useCallback(() => {
    const uuids: string[] = [];
    for (let i = 0; i < uuidCount && i <= 5; i++) {
      switch (uuidVersion) {
        case "v1":
          uuids.push(generateUUIDv1());
          break;
        case "nil":
          uuids.push(generateUUIDNil());
          break;
        default:
          uuids.push(generateUUIDv4());
      }
    }
    setMultipleUUIDs(uuids);
    setHistory((prev) => [...uuids, ...prev].slice(0, 20));
  }, [uuidCount, uuidVersion]);

  const copyToClipboard = useCallback(async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (index !== undefined) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const copyAllToClipboard = useCallback(async () => {
    try {
      const text = multipleUUIDs.join("\n");
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy all:", err);
    }
  }, [multipleUUIDs]);

  const getUUIDLabel = (uuid: string) => {
    if (uuid === "00000000-0000-0000-0000-000000000000") return "UUID Nil";
    if (uuid.startsWith("00000000")) return "UUID v1 (Time-based)";
    return "UUID v4 (Random)";
  };

  return (
    <div className="">
      <HeaderApp
        title="UUID Generator"
        description="Generate identifier unik dengan mudah dan cepat. Mendukung UUID v4, v1, dan Nil."
        icon={<Asterisk className="h-8 w-8 text-white" />}
        customCss=""
        clientSide
      />

      <div className="mx-auto w-full max-w-2xl space-y-8 py-10">
        {/* Main Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>Generate UUID</CardTitle>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-auto"
              >
                <TabsList>
                  <TabsTrigger value="single">Single</TabsTrigger>
                  <TabsTrigger value="multiple">Bulk</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {/* Version Selection */}
            <div className="mb-6 space-y-3">
              <Label>UUID Version</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={uuidVersion === "v4" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUuidVersion("v4")}
                >
                  v4 (Random)
                </Button>
                <Button
                  variant={uuidVersion === "v1" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUuidVersion("v1")}
                >
                  v1 (Time-based)
                </Button>
                <Button
                  variant={uuidVersion === "nil" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUuidVersion("nil")}
                >
                  Nil (0000...)
                </Button>
              </div>
            </div>

            {/* Single UUID Tab */}
            <TabsContent value="single" activeTab={activeTab}>
              <div className="space-y-4">
                {currentUUID && (
                  <div className="space-y-2">
                    <Label>Generated UUID</Label>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={currentUUID}
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(currentUUID)}
                        title="Copy to clipboard"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </Button>
                    </div>
                    <Badge>{getUUIDLabel(currentUUID)}</Badge>
                  </div>
                )}
                <Button onClick={generateUUID} className="w-full" size="lg">
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                  Generate UUID
                </Button>
              </div>
            </TabsContent>

            {/* Multiple UUIDs Tab */}
            <TabsContent value="multiple" activeTab={activeTab}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="count">Number of UUIDs (1-5)</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="5"
                    value={uuidCount}
                    onChange={(e) =>
                      setUuidCount(
                        Math.min(5, Math.max(1, parseInt(e.target.value) || 1)),
                      )
                    }
                  />
                </div>
                <Button
                  onClick={generateMultipleUUIDs}
                  className="w-full"
                  size="lg"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                  Generate {uuidCount} UUID{uuidCount > 1 ? "s" : ""}
                </Button>
                {multipleUUIDs.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Generated UUIDs ({multipleUUIDs.length})</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAllToClipboard}
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy All
                      </Button>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-slate-50 max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <tbody>
                          {multipleUUIDs.map((uuid, index) => (
                            <tr
                              key={index}
                              className="border-b border-slate-200 last:border-0 hover:bg-slate-100 transition-colors"
                            >
                              <td className="px-3 py-2 w-12 text-slate-500">
                                {index + 1}
                              </td>
                              <td className="px-3 py-2 font-mono text-xs">
                                {uuid}
                              </td>
                              <td className="px-3 py-2 w-12 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => copyToClipboard(uuid, index)}
                                >
                                  {copiedIndex === index ? (
                                    <svg
                                      className="h-4 w-4 text-green-600"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <rect
                                        x="9"
                                        y="9"
                                        width="13"
                                        height="13"
                                        rx="2"
                                        ry="2"
                                      />
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                  )}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Card>

        {/* History Card */}
        {history.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">History</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistory([])}
                >
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-slate-200 bg-slate-50 max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {history.map((uuid, index) => (
                      <tr
                        key={index}
                        className="border-b border-slate-200 last:border-0 hover:bg-slate-100 transition-colors"
                      >
                        <td className="px-3 py-2 font-mono text-xs">{uuid}</td>
                        <td className="px-3 py-2 w-12 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToClipboard(uuid)}
                          >
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
