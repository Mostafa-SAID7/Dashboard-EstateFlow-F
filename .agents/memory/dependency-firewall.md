---
name: Dependency firewall workarounds
description: Replit's package firewall can block older transitive npm tarballs during first install.
---

When an imported Node project fails to install because the package firewall blocks an old transitive tarball, check the parent dependency and prefer a compatible newer transitive release via npm overrides before changing the application stack.

**Why:** The imported Angular workspace required newer safe releases for several transitive packages before npm could complete the install in this environment.

**How to apply:** Inspect package-lock.json and npm registry versions, keep overrides narrowly scoped, then verify both npm build and the running preview.