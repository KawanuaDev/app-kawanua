import Papa from "papaparse";

export type ConversionError = {
  message: string;
  line?: number;
};

export type ConversionResult<T> = {
  success: boolean;
  data?: T;
  error?: ConversionError;
  stats?: {
    rows: number;
    columns: number;
    size: string;
  };
};

// ─── JSON → CSV ───────────────────────────────────────────────────────────────

export function jsonToCsv(
  jsonStr: string,
  options: {
    delimiter?: string;
    includeHeaders?: boolean;
    quoteAll?: boolean;
  } = {},
): ConversionResult<string> {
  const { delimiter = ",", includeHeaders = true, quoteAll = false } = options;

  try {
    const parsed = JSON.parse(jsonStr);

    let data: Record<string, unknown>[];

    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return {
          success: true,
          data: "",
          stats: { rows: 0, columns: 0, size: "0 B" },
        };
      }
      // Flatten nested objects to dot-notation keys
      data = parsed.map((item) => flattenObject(item));
    } else if (typeof parsed === "object" && parsed !== null) {
      data = [flattenObject(parsed)];
    } else {
      return {
        success: false,
        error: { message: "JSON must be an object or an array of objects." },
      };
    }

    const result = Papa.unparse(data, {
      delimiter,
      header: includeHeaders,
      quotes: quoteAll,
    });

    const stats = getStats(
      result,
      data.length,
      Object.keys(data[0] ?? {}).length,
    );
    return { success: true, data: result, stats };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: { message: `Invalid JSON: ${error.message}` },
    };
  }
}

// ─── CSV → JSON ───────────────────────────────────────────────────────────────

export function csvToJson(
  csvStr: string,
  options: {
    delimiter?: string;
    hasHeaders?: boolean;
    inferTypes?: boolean;
    outputFormat?: "array" | "object";
  } = {},
): ConversionResult<string> {
  const {
    delimiter = "auto",
    hasHeaders = true,
    inferTypes = true,
    outputFormat = "array",
  } = options;

  try {
    if (!csvStr.trim()) {
      return {
        success: true,
        data: "[]",
        stats: { rows: 0, columns: 0, size: "0 B" },
      };
    }

    const parseResult = Papa.parse<Record<string, string>>(csvStr, {
      header: hasHeaders,
      delimiter: delimiter === "auto" ? undefined : delimiter,
      skipEmptyLines: true,
      dynamicTyping: inferTypes,
      transformHeader: (h) => h.trim(),
    });

    if (parseResult.errors.length > 0) {
      const firstError = parseResult.errors[0];
      return {
        success: false,
        error: {
          message: `CSV parse error: ${firstError.message}`,
          line: firstError.row,
        },
      };
    }

    let output: unknown = parseResult.data;

    if (!hasHeaders) {
      // data is array of arrays
      output = parseResult.data;
    }

    if (
      outputFormat === "object" &&
      Array.isArray(output) &&
      output.length === 1
    ) {
      output = output[0];
    }

    const rows = parseResult.data.length;
    const columns = hasHeaders
      ? (parseResult.meta.fields?.length ?? 0)
      : Array.isArray(parseResult.data[0])
        ? (parseResult.data[0] as unknown[]).length
        : 0;

    const jsonStr = JSON.stringify(output, null, 2);
    const stats = getStats(jsonStr, rows, columns);
    return { success: true, data: jsonStr, stats };
  } catch (err) {
    const error = err as Error;
    return {
      success: false,
      error: { message: `Conversion error: ${error.message}` },
    };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flattenObject(
  obj: unknown,
  parentKey = "",
  result: Record<string, unknown> = {},
): Record<string, unknown> {
  if (typeof obj !== "object" || obj === null) {
    result[parentKey] = obj;
    return result;
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

function getStats(
  str: string,
  rows: number,
  columns: number,
): { rows: number; columns: number; size: string } {
  const bytes = new TextEncoder().encode(str).length;
  const size =
    bytes < 1024
      ? `${bytes} B`
      : bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return { rows, columns, size };
}

export function validateJson(jsonStr: string): {
  valid: boolean;
  message?: string;
} {
  try {
    JSON.parse(jsonStr);
    return { valid: true };
  } catch (err) {
    return { valid: false, message: (err as Error).message };
  }
}

export function validateCsv(csvStr: string): {
  valid: boolean;
  message?: string;
} {
  if (!csvStr.trim()) return { valid: false, message: "Input is empty" };
  const result = Papa.parse(csvStr, { skipEmptyLines: true });
  if (result.errors.length > 0) {
    return { valid: false, message: result.errors[0].message };
  }
  return { valid: true };
}
