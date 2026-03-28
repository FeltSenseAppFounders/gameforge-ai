// GameForge AI — Static code scanner for game HTML/JS
// Scans generated game code for dangerous patterns before allowing publish.
// This is a pre-publish gate: games that fail the scan cannot be made public.

interface ScanResult {
  safe: boolean;
  violations: string[];
}

// Allowed CDN hosts for script/resource loading
const ALLOWED_HOSTS = ["cdn.jsdelivr.net"];

// Patterns that indicate dangerous code
const DANGEROUS_PATTERNS: { pattern: RegExp; category: string; description: string }[] = [
  // Network requests
  { pattern: /\bfetch\s*\(/, category: "Network", description: "fetch() call detected" },
  {
    pattern: /\bnew\s+XMLHttpRequest\b/,
    category: "Network",
    description: "XMLHttpRequest detected",
  },
  { pattern: /\bnew\s+WebSocket\b/, category: "Network", description: "WebSocket detected" },
  { pattern: /\bnew\s+EventSource\b/, category: "Network", description: "EventSource detected" },
  {
    pattern: /\bnavigator\s*\.\s*sendBeacon\b/,
    category: "Network",
    description: "navigator.sendBeacon detected",
  },

  // Dynamic code execution
  { pattern: /\beval\s*\(/, category: "Execution", description: "eval() call detected" },
  {
    pattern: /\bnew\s+Function\s*\(/,
    category: "Execution",
    description: "new Function() constructor detected",
  },

  // Dangerous APIs
  {
    pattern: /\bnew\s+RTCPeerConnection\b/,
    category: "Privacy",
    description: "RTCPeerConnection detected (potential IP leak)",
  },
  {
    pattern: /\bWebAssembly\b/,
    category: "Resource",
    description: "WebAssembly detected (potential mining)",
  },
  {
    pattern: /\bnavigator\s*\.\s*clipboard\b/,
    category: "Privacy",
    description: "Clipboard API access detected",
  },
  {
    pattern: /\bnavigator\s*\.\s*geolocation\b/,
    category: "Privacy",
    description: "Geolocation API access detected",
  },
  {
    pattern: /\bnew\s+Worker\s*\(/,
    category: "Resource",
    description: "Web Worker detected",
  },
  {
    pattern: /\bnew\s+SharedWorker\s*\(/,
    category: "Resource",
    description: "SharedWorker detected",
  },
  {
    pattern: /\bnavigator\s*\.\s*serviceWorker\b/,
    category: "Resource",
    description: "Service Worker registration detected",
  },

  // Crypto mining indicators
  {
    pattern: /\bCryptoNight\b/i,
    category: "Mining",
    description: "CryptoNight algorithm reference detected",
  },
  { pattern: /\bcoinhive\b/i, category: "Mining", description: "CoinHive reference detected" },
  {
    pattern: /\bhashrate\b/i,
    category: "Mining",
    description: "Hashrate reference detected (potential mining)",
  },
];

/**
 * Scans game HTML/JS for dangerous patterns.
 * Returns { safe: true } if no violations found, or { safe: false, violations: [...] }.
 */
export function scanGameCode(html: string): ScanResult {
  const violations: string[] = [];

  // Check for dangerous patterns
  for (const { pattern, category, description } of DANGEROUS_PATTERNS) {
    if (pattern.test(html)) {
      violations.push(`[${category}] ${description}`);
    }
  }

  // Check for external URLs (scripts, images, iframes) not in the allowed list
  const urlPattern = /(?:src|href|action)\s*=\s*["'](https?:\/\/[^"']+)["']/gi;
  let match;
  while ((match = urlPattern.exec(html)) !== null) {
    const url = match[1];
    try {
      const host = new URL(url).hostname;
      if (!ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) {
        violations.push(`[External] External URL detected: ${host}`);
      }
    } catch {
      // Malformed URL — flag it
      violations.push(`[External] Malformed URL in src/href attribute`);
    }
  }

  return {
    safe: violations.length === 0,
    violations,
  };
}
