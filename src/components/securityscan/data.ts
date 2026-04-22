import { OwaspItem } from "@/types/securityscan";

export const OWASP_DATA: OwaspItem[] = [
  {
    id: "A01:2021",
    category: "Broken Access Control",
    status: "pass",
    description:
      "No unauthorized access detected to sensitive endpoints. RBAC policies are correctly enforced.",
    severity: "Critical",
    cwe: "CWE-284",
    detail: {
      cves: [],
      remediationCode: {
        lang: "nginx",
        code: `# Enforce least-privilege access on API routes
location /api/admin/ {
  allow 10.0.0.0/8;
  deny  all;
}`,
      },
      references: [
        {
          label: "OWASP – Broken Access Control",
          url: "https://owasp.org/Top10/A01_2021-Broken_Access_Control/",
        },
        {
          label: "CWE-284 – Improper Access Control",
          url: "https://cwe.mitre.org/data/definitions/284.html",
        },
      ],
    },
  },
  {
    id: "A02:2021",
    category: "Cryptographic Failures",
    status: "fail",
    description:
      "Sensitive data transmitted over unencrypted HTTP channels. TLS 1.0 still enabled on port 443.",
    severity: "Critical",
    cwe: "CWE-327",
    detail: {
      cves: [
        {
          id: "CVE-2011-3389",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2011-3389",
          description: "BEAST attack against TLS 1.0 CBC ciphers.",
        },
        {
          id: "CVE-2014-3566",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2014-3566",
          description: "POODLE attack forcing SSL 3.0 downgrade.",
        },
      ],
      remediationCode: {
        lang: "nginx",
        code: `# Disable TLS 1.0/1.1 and enforce strong ciphers
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`,
      },
      references: [
        {
          label: "OWASP – Cryptographic Failures",
          url: "https://owasp.org/Top10/A02_2021-Cryptographic_Failures/",
        },
        {
          label: "Mozilla SSL Configuration Generator",
          url: "https://ssl-config.mozilla.org/",
        },
        {
          label: "CWE-327 – Use of Broken Algorithm",
          url: "https://cwe.mitre.org/data/definitions/327.html",
        },
      ],
    },
  },
  {
    id: "A03:2021",
    category: "Injection",
    status: "pass",
    description:
      "Input fields are properly sanitized and parameterized. No SQL/NoSQL injection vectors detected.",
    severity: "Critical",
    cwe: "CWE-89",
    detail: {
      cves: [],
      remediationCode: {
        lang: "javascript",
        code: `// Use parameterized queries — never string-concat user input
const { rows } = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [req.params.id]          // ✅ safe
);`,
      },
      references: [
        {
          label: "OWASP – Injection",
          url: "https://owasp.org/Top10/A03_2021-Injection/",
        },
        {
          label: "CWE-89 – SQL Injection",
          url: "https://cwe.mitre.org/data/definitions/89.html",
        },
      ],
    },
  },
  {
    id: "A04:2021",
    category: "Insecure Design",
    status: "pass",
    description:
      "Application architecture follows secure-by-default patterns. Threat modeling artifacts present.",
    severity: "High",
    cwe: "CWE-657",
    detail: {
      cves: [],
      remediationCode: {
        lang: "text",
        code: `# Threat modelling checklist (STRIDE)
[✓] Spoofing  – JWT w/ RS256 signatures
[✓] Tampering – HMAC request signing
[✓] Repudiation – Immutable audit log (append-only)
[✓] Info Disclosure – Field-level encryption for PII
[✓] DoS – Rate-limiting + circuit breaker
[✓] Elevation – RBAC + deny-by-default`,
      },
      references: [
        {
          label: "OWASP – Insecure Design",
          url: "https://owasp.org/Top10/A04_2021-Insecure_Design/",
        },
        {
          label: "Microsoft STRIDE Model",
          url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats",
        },
      ],
    },
  },
  {
    id: "A05:2021",
    category: "Security Misconfiguration",
    status: "warning",
    description:
      "Verbose error messages expose stack traces in production. Server version header disclosed.",
    severity: "Medium",
    cwe: "CWE-16",
    detail: {
      cves: [
        {
          id: "CVE-2022-32223",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2022-32223",
          description: "Node.js information disclosure via error messages.",
        },
      ],
      remediationCode: {
        lang: "javascript",
        code: `// Express – suppress stack traces in production
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    message: isProd ? 'Internal Server Error' : err.message,
    // Never expose err.stack in production!
  });
});`,
      },
      references: [
        {
          label: "OWASP – Security Misconfiguration",
          url: "https://owasp.org/Top10/A05_2021-Security_Misconfiguration/",
        },
        {
          label: "CWE-16 – Configuration",
          url: "https://cwe.mitre.org/data/definitions/16.html",
        },
      ],
    },
  },
  {
    id: "A06:2021",
    category: "Vulnerable Components",
    status: "warning",
    description:
      "3 third-party dependencies with known CVEs detected (lodash@4.17.20, moment@2.29.1, axios@0.21.1).",
    severity: "High",
    cwe: "CWE-1035",
    detail: {
      cves: [
        {
          id: "CVE-2021-23337",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2021-23337",
          description: "lodash command injection via template.",
        },
        {
          id: "CVE-2022-31129",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2022-31129",
          description: "moment.js ReDoS via specially crafted date string.",
        },
        {
          id: "CVE-2021-3749",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2021-3749",
          description: "axios ReDoS in URL parsing.",
        },
      ],
      remediationCode: {
        lang: "bash",
        code: `# Upgrade affected packages
npm install lodash@^4.17.21
npm install date-fns@^3.0.0   # replace moment.js
npm install axios@^1.6.0

# Audit and auto-fix remaining issues
npm audit fix --force`,
      },
      references: [
        {
          label: "OWASP – Vulnerable & Outdated Components",
          url: "https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/",
        },
        {
          label: "npm audit docs",
          url: "https://docs.npmjs.com/cli/v10/commands/npm-audit",
        },
      ],
    },
  },
  {
    id: "A07:2021",
    category: "Identification & Auth Failures",
    status: "warning",
    description:
      "Session timeout set to 24 hours (recommended: ≤1 hour). MFA not enforced for admin accounts.",
    severity: "Medium",
    cwe: "CWE-287",
    detail: {
      cves: [
        {
          id: "CVE-2022-27664",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2022-27664",
          description: "Go net/http excessive session duration.",
        },
      ],
      remediationCode: {
        lang: "javascript",
        code: `// Express-session – tighten session lifetime
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,   // 1 hour (was 86 400 000)
  },
}));`,
      },
      references: [
        {
          label: "OWASP – Identification & Auth Failures",
          url: "https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/",
        },
        {
          label: "NIST SP 800-63B",
          url: "https://pages.nist.gov/800-63-3/sp800-63b.html",
        },
        {
          label: "CWE-287 – Improper Authentication",
          url: "https://cwe.mitre.org/data/definitions/287.html",
        },
      ],
    },
  },
  {
    id: "A08:2021",
    category: "Software & Data Integrity Failures",
    status: "pass",
    description:
      "CI/CD pipeline includes integrity verification. SRI applied to CDN assets.",
    severity: "High",
    cwe: "CWE-494",
    detail: {
      cves: [],
      remediationCode: {
        lang: "html",
        code: `<!-- Subresource Integrity on CDN assets -->
<script
  src="https://cdn.example.com/app.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux...="
  crossorigin="anonymous">
</script>`,
      },
      references: [
        {
          label: "OWASP – Software & Data Integrity Failures",
          url: "https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/",
        },
        {
          label: "MDN – Subresource Integrity",
          url: "https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity",
        },
      ],
    },
  },
  {
    id: "A09:2021",
    category: "Security Logging & Monitoring",
    status: "fail",
    description:
      "No centralized log aggregation detected. Failed login attempts not rate-limited or alerted.",
    severity: "Medium",
    cwe: "CWE-778",
    detail: {
      cves: [
        {
          id: "CVE-2021-44228",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2021-44228",
          description: "Log4Shell – RCE via crafted log input (Log4j2).",
        },
      ],
      remediationCode: {
        lang: "javascript",
        code: `// Structured security event logging with rate-limit alert
const winston = require('winston');
const logger = winston.createLogger({ format: winston.format.json() });

app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  if (!user) {
    logger.warn('AUTH_FAILURE', {
      ip: req.ip, username: req.body.username, ts: Date.now(),
    });
    await incrementFailCounter(req.ip);   // alert on threshold
    return res.status(401).end();
  }
  logger.info('AUTH_SUCCESS', { userId: user.id, ip: req.ip });
});`,
      },
      references: [
        {
          label: "OWASP – Security Logging & Monitoring Failures",
          url: "https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/",
        },
        {
          label: "CWE-778 – Insufficient Logging",
          url: "https://cwe.mitre.org/data/definitions/778.html",
        },
      ],
    },
  },
  {
    id: "A10:2021",
    category: "Server-Side Request Forgery",
    status: "pass",
    description:
      "All server-side HTTP requests validated against an allowlist. No SSRF vectors identified.",
    severity: "High",
    cwe: "CWE-918",
    detail: {
      cves: [
        {
          id: "CVE-2019-11043",
          url: "https://nvd.nist.gov/vuln/detail/CVE-2019-11043",
          description: "PHP-FPM SSRF / RCE via nginx misconfiguration.",
        },
      ],
      remediationCode: {
        lang: "javascript",
        code: `// Validate outbound URLs against an allowlist
const ALLOWED_HOSTS = ['api.partner.com', 'hooks.slack.com'];

function safeFetch(url) {
  const { hostname } = new URL(url);
  if (!ALLOWED_HOSTS.includes(hostname)) {
    throw new Error(\`Blocked SSRF attempt to: \${hostname}\`);
  }
  return fetch(url);
}`,
      },
      references: [
        {
          label: "OWASP – Server-Side Request Forgery",
          url: "https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/",
        },
        {
          label: "CWE-918 – SSRF",
          url: "https://cwe.mitre.org/data/definitions/918.html",
        },
      ],
    },
  },
];
