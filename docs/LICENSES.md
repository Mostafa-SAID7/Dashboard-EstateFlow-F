# Third-Party Licenses

This document outlines the licenses of all dependencies used in the Real Estate Platform.

## Main License

The Real Estate Platform is licensed under the **MIT License**. See [LICENSE](../LICENSE) for details.

## Dependencies Licenses

### Core Framework
- **Angular** (MIT) - Component framework
- **RxJS** (Apache 2.0) - Reactive programming
- **TypeScript** (Apache 2.0) - Language

### State Management
- **@ngrx/store** (MIT) - State management
- **@ngrx/effects** (MIT) - Side effects management

### UI & Styling
- **Angular Material** (MIT) - Material Design components
- **PrimeNG** (MIT) - Advanced UI components
- **Tailwind CSS** (MIT) - Utility-first CSS
- **postcss** (MIT) - CSS transformation
- **autoprefixer** (MIT) - CSS vendor prefixes

### Maps & Charts
- **Leaflet** (BSD-2-Clause) - Interactive maps
- **Chart.js** (MIT) - Data visualization
- **primeicons** (MIT) - Icon library

### Development Dependencies
- **@angular/cli** (MIT) - Build tool
- **@angular-devkit/build-angular** (MIT) - Build plugin
- **Karma** (MIT) - Test runner
- **Jasmine** (MIT) - Testing framework
- **TypeScript** (Apache 2.0) - Language

## License Compliance

### How We Ensure Compliance

1. **Dependency Scanning**: 
   ```bash
   npm audit
   npm ls --depth=0
   ```

2. **License Checking**:
   ```bash
   npm run license-check
   ```

3. **CI/CD Integration**:
   - GitHub Actions: Dependency review on PRs
   - Dependabot: Automated updates
   - CodeQL: Security scanning

### Compatible Licenses

We accept dependencies with these licenses:
- ✅ MIT
- ✅ Apache 2.0
- ✅ BSD (all variants)
- ✅ ISC
- ✅ WTFPL
- ✅ CC0

### Incompatible Licenses

We avoid dependencies with:
- ❌ AGPL (Viral copyleft)
- ❌ GPL (Strong copyleft)
- ❌ SSPL (Server-side public license)

## Updating Dependencies

### Before Update
```bash
# Check license
npm view package-name license

# Check compatibility
npm audit
```

### Process
1. Review changelog
2. Check security updates
3. Verify license compatibility
4. Update package.json
5. Run tests
6. Create PR

## Attribution

### Where We Provide Credit

1. **README.md** - Links to key frameworks
2. **docs/LICENSES.md** - This file
3. **package.json** - All dependencies listed
4. **Source code comments** - For complex libraries

## Transitive Dependencies

### What They Are
Dependencies of our dependencies. Example:
```
our-app
  └── package-a
      └── package-b (transitive)
```

### Verification
```bash
npm ls                          # See dependency tree
npm ls --depth=0                # Only direct dependencies
npm ls --all                    # Include transitive
```

## Open Source Communities

We contribute back to:
- Angular
- RxJS
- PrimeNG
- Leaflet
- Chart.js

### How to Contribute
1. Find issue on project repository
2. Fork the repository
3. Follow their CONTRIBUTING guide
4. Submit Pull Request

## License Questions

If you have questions about:
- **License compatibility**: See LICENSE in repository
- **Using this software**: Check MIT License terms
- **Attributions**: See this document
- **Third-party code**: Contact maintainers

## Resources

- [MIT License](https://opensource.org/licenses/MIT)
- [Open Source Licenses](https://opensource.org/licenses/)
- [SPDX License List](https://spdx.org/licenses/)
- [Choose an Open Source License](https://choosealicense.com/)

---

**Last Updated**: September 2024
**License Compliance**: ✅ Verified
