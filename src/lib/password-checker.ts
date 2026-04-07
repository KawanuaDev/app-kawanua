// Password strength analyzer
export interface PasswordStrength {
  score: number;
  level: "very-weak" | "weak" | "fair" | "strong" | "very-strong";
  feedback: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score: 0, level: "very-weak", feedback: ["Password kosong"] };
  }

  // Length check
  if (password.length >= 8) score += 1;
  else feedback.push("Minimal 8 karakter");

  if (password.length >= 12) score += 1;
  else if (password.length < 8)
    feedback.push("Gunakan minimal 12 karakter untuk keamanan lebih baik");

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Tambahkan huruf kecil");

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Tambahkan huruf besar");

  // Number check
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Tambahkan angka");

  // Special character check
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Tambahkan karakter spesial (!@#$%^&*)");

  // Bonus length
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // Determine level
  let level: PasswordStrength["level"] = "very-weak";
  if (score >= 1) level = "weak";
  if (score >= 3) level = "fair";
  if (score >= 5) level = "strong";
  if (score >= 7) level = "very-strong";

  return { score, level, feedback };
}

// HaveIBeenPwned API integration
export interface PwnedPasswordResult {
  isPwned: boolean;
  count: number;
  error?: string;
}

// SHA-1 hash function
async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex.toUpperCase();
}

export async function checkPwnedPassword(
  password: string,
): Promise<PwnedPasswordResult> {
  try {
    if (!password) {
      return { isPwned: false, count: 0 };
    }

    // Generate SHA-1 hash of password
    const hash = await sha1(password);
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    // Call HaveIBeenPwned API (k-Anonymity model)
    // Note: Do NOT set custom User-Agent — it's a forbidden header in browsers
    // and will trigger a CORS preflight failure.
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
    );

    if (!response.ok) {
      throw new Error("Gagal menghubungi API HaveIBeenPwned");
    }

    const data = await response.text();
    const lines = data.split("\n");

    // Check if our hash suffix is in the response
    for (const line of lines) {
      const [lineSuffix, countStr] = line.split(":");
      if (lineSuffix === suffix) {
        const count = parseInt(countStr, 10);
        return { isPwned: true, count };
      }
    }

    return { isPwned: false, count: 0 };
  } catch (error) {
    return {
      isPwned: false,
      count: 0,
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

export function getStrengthColor(level: PasswordStrength["level"]): string {
  const colors = {
    "very-weak": "bg-red-500",
    weak: "bg-orange-500",
    fair: "bg-yellow-500",
    strong: "bg-green-500",
    "very-strong": "bg-emerald-600",
  };
  return colors[level];
}

export function getStrengthLabel(level: PasswordStrength["level"]): string {
  const labels = {
    "very-weak": "Sangat Lemah",
    weak: "Lemah",
    fair: "Sedang",
    strong: "Kuat",
    "very-strong": "Sangat Kuat",
  };
  return labels[level];
}
