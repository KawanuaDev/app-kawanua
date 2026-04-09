export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface ChecksumResult {
  algorithm: HashAlgorithm;
  hash: string;
  error?: string;
}

// MD5 implementation (not supported by Web Crypto API)
async function md5(buffer: ArrayBuffer): Promise<string> {
  // Simple MD5 implementation
  const data = new Uint8Array(buffer);

  // Convert to array of 32-bit words
  const words: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    words.push(
      (data[i] << 24) |
        (data[i + 1] << 16) |
        (data[i + 2] << 8) |
        (data[i + 3] || 0),
    );
  }

  // Initialize MD5 state
  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  // Process message in 512-bit chunks
  const bits = data.length * 8;
  words.push(0x80);
  while (words.length % 16 !== 14) {
    words.push(0);
  }
  words.push(bits >>> 0);
  words.push((bits - (bits % 0x100000000)) / 0x100000000);

  // MD5 functions
  const f = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const g = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const h = (x: number, y: number, z: number) => x ^ y ^ z;
  const ii = (x: number, y: number, z: number) => y ^ (x | ~z);

  const rotateLeft = (x: number, n: number) =>
    ((x << n) | (x >>> (32 - n))) >>> 0;

  // Constants
  const K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
    0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
    0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
    0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
    0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
    0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ];

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5,
    9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11,
    16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10,
    15, 21,
  ];

  // Process each 512-bit chunk
  for (let i = 0; i < words.length / 16; i++) {
    const W: number[] = [];
    for (let j = 0; j < 16; j++) {
      W.push(words[i * 16 + j]);
    }

    let [A, B, C, D] = [a0, b0, c0, d0];

    // Round 1
    for (let j = 0; j < 16; j++) {
      const F = f(B, C, D);
      const g = j;
      const newA = (D + rotateLeft((A + F + K[j] + W[g]) >>> 0, s[j])) >>> 0;
      [D, C, B, A] = [C, B, A, newA];
    }

    // Round 2
    for (let j = 16; j < 32; j++) {
      const G = g(B, C, D);
      const gIdx = (5 * j + 1) % 16;
      const newA = (D + rotateLeft((A + G + K[j] + W[gIdx]) >>> 0, s[j])) >>> 0;
      [D, C, B, A] = [C, B, A, newA];
    }

    // Round 3
    for (let j = 32; j < 48; j++) {
      const H = h(B, C, D);
      const gIdx = (3 * j + 5) % 16;
      const newA = (D + rotateLeft((A + H + K[j] + W[gIdx]) >>> 0, s[j])) >>> 0;
      [D, C, B, A] = [C, B, A, newA];
    }

    // Round 4
    for (let j = 48; j < 64; j++) {
      const I = ii(B, C, D);
      const gIdx = (7 * j) % 16;
      const newA = (D + rotateLeft((A + I + K[j] + W[gIdx]) >>> 0, s[j])) >>> 0;
      [D, C, B, A] = [C, B, A, newA];
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  // Convert to hex string
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return "0".repeat(8 - hex.length) + hex;
  };

  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

// SHA hash functions using Web Crypto API
async function shaHash(
  buffer: ArrayBuffer,
  algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512",
): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function generateChecksums(
  file: File,
  algorithms: HashAlgorithm[],
): Promise<ChecksumResult[]> {
  const buffer = await file.arrayBuffer();
  const results: ChecksumResult[] = [];

  for (const algorithm of algorithms) {
    try {
      let hash: string;
      if (algorithm === "MD5") {
        hash = await md5(buffer);
      } else {
        hash = await shaHash(buffer, algorithm);
      }
      results.push({ algorithm, hash });
    } catch (error) {
      results.push({
        algorithm,
        hash: "",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function validateFileSize(file: File): {
  valid: boolean;
  error?: string;
} {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of 5 MB. Your file is ${formatFileSize(file.size)}.`,
    };
  }
  return { valid: true };
}
