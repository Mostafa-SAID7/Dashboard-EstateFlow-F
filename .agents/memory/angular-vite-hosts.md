---
name: Angular Vite preview hosts
description: Angular 18's application builder embeds Vite and handles Replit proxy hosts differently from standalone Vite.
---

For Angular 18 application-builder previews, a standalone vite.config.js is not consumed by ng serve. The Replit proxy host can still be allowed through the workflow's Angular host-check flag, even though the builder may print a legacy-option warning.

**Why:** The imported app had no vite.config.js and the proxied Replit hostname was blocked until the workflow was adjusted.

**How to apply:** Keep the Angular workflow bound to 0.0.0.0 and port 5000, add the host-check flag when a proxied host is rejected, then verify with a request carrying the actual Host header.