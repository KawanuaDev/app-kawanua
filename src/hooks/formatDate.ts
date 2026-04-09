type DateValue = string | number | Date;

interface FormatOptions extends Intl.DateTimeFormatOptions {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

/**
 * Format parameter menjadi tampilan waktu dan jam (Date & Time) dalam bahasa Indonesia
 * @param date Nilai waktu (string, number, atau object Date)
 * @param options Opsi format tambahan (opsional)
 * @returns string yang berisi tanggal yang diformat dengan locale id-ID
 */
export function formatDateTime(date: DateValue, options?: FormatOptions): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error("Invalid Date");

    const defaultOptions: FormatOptions = {
      dateStyle: 'long',
      timeStyle: 'short',
    };

    return new Intl.DateTimeFormat('id-ID', options || defaultOptions).format(d);
  } catch (error) {
    console.error("formatDateTime error:", error);
    return "-";
  }
}

/**
 * Format parameter menjadi tampilan hari dan tanggal saja (Date only) dalam bahasa Indonesia
 * @param date Nilai waktu (string, number, atau object Date)
 * @param options Opsi format tambahan (opsional)
 * @returns string yang berisi tanggal yang diformat dengan locale id-ID
 */
export function formatDate(date: DateValue, options?: FormatOptions): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error("Invalid Date");

    const defaultOptions: FormatOptions = {
      dateStyle: 'long',
    };

    return new Intl.DateTimeFormat('id-ID', options || defaultOptions).format(d);
  } catch (error) {
    console.error("formatDate error:", error);
    return "-";
  }
}

/**
 * Format parameter menjadi tampilan jam saja (Time only) dalam bahasa Indonesia
 * @param date Nilai waktu (string, number, atau object Date)
 * @param options Opsi format tambahan (opsional)
 * @returns string yang berisi jam yang diformat dengan locale id-ID
 */
export function formatTime(date: DateValue, options?: FormatOptions): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error("Invalid Date");

    const defaultOptions: FormatOptions = {
      timeStyle: 'short',
    };

    return new Intl.DateTimeFormat('id-ID', options || defaultOptions).format(d);
  } catch (error) {
    console.error("formatTime error:", error);
    return "-";
  }
}
