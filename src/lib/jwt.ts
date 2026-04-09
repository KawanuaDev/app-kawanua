export interface JWTParts {
  header: string;
  payload: string;
  signature: string;
}

export interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  valid: boolean;
  error?: string;
}

export function parseJWT(token: string): DecodedJWT {
  const trimmedToken = token.trim();

  if (!trimmedToken) {
    return {
      header: {},
      payload: {},
      signature: "",
      valid: false,
      error: "Token is empty",
    };
  }

  const parts = trimmedToken.split(".");

  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: "",
      valid: false,
      error:
        "Invalid JWT format. A valid JWT token should have 3 parts separated by dots.",
    };
  }

  try {
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    return {
      header,
      payload,
      signature: parts[2],
      valid: true,
    };
  } catch (error) {
    return {
      header: {},
      payload: {},
      signature: parts[2],
      valid: false,
      error: "Failed to decode token. The token may be corrupted.",
    };
  }
}

export function formatJSON(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function isTokenExpired(decoded: DecodedJWT): boolean | null {
  if (!decoded.valid || !decoded.payload.exp) {
    return null;
  }

  const exp = decoded.payload.exp as number;
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}

export function formatExpirationTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function formatIssuedAtTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function getTimeUntilExpiration(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}
