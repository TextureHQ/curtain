# Security Policy

## Supported versions

Curtain is pre-1.0. We support the latest `main`. Older tags are not patched.

## Reporting a vulnerability

If you discover a security issue in Curtain, the data engine, or any
industry pack:

- **Do not** open a public GitHub issue.
- Email `security@texturehq.com` with the details, a proof-of-concept if
  applicable, and your preferred disclosure timeline.
- We will acknowledge within 2 business days and provide a remediation plan
  within 7 business days.

## Threat model

Curtain runs as a Chrome content script. Its scope is intentionally narrow:

- It reads and writes DOM elements on user-allowed hosts only.
- It stores **only** a seed and settings in `chrome.storage.local`. Nothing
  is sent off-device.
- It does **not** transmit, log, or persist real PII anywhere.

If you find that Curtain is exfiltrating data, retaining PII beyond a tab
session, or escalating permissions beyond its `host_permissions`, treat it
as critical.

## Out of scope

- Vulnerabilities in third-party sites Curtain is masking. Curtain is a
  client-side overlay; it cannot fix server-side leaks.
- Demo-data realism issues (a name "looks too real" / "looks too fake") —
  open a regular GitHub issue.

## Acknowledgements

We thank security researchers who responsibly disclose. We'll credit you in
the release notes if you want credit.
