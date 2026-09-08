# Project Structure Guide

Complete project organization with proper file placement.

## Root Level (Project Config & Meta)

```
├── LICENSE                      # MIT License
├── SECURITY.md                  # Security policy & reporting
├── CODE_OF_CONDUCT.md           # Community guidelines
├── CHANGELOG.md                 # Version history
├── CONTRIBUTORS.md              # Project contributors
├── README.md                    # Project overview
│
├── angular.json                 # Angular build configuration
├── tsconfig.json                # TypeScript global config
├── tsconfig.app.json            # TypeScript app config
├── tsconfig.spec.json           # TypeScript test config
├── package.json                 # npm dependencies
├── package-lock.json            # Dependency lock file
│
├── .editorconfig                # Editor formatting rules
├── .gitignore                   # Git ignored files
├── .npmrc                       # npm configuration
├── .nvmrc                       # Node version (22.14.0)
├── .node-version                # Node version (22.14.0)
│
├── tailwind.config.js           # Tailwind CSS config
├── postcss.config.js            # PostCSS configuration
│
├── .replit                      # Replit environment config
```

## Documentation Directory (`/docs`)

```
docs/
├── GETTING_STARTED.md           # Setup & run instructions
├── ARCHITECTURE.md              # System design & patterns
├── CONFIGURATION.md             # Environment & feature flags
├── API_INTEGRATION.md           # API endpoints & integration
├── CONTRIBUTING.md              # Developer contribution guide
├── SECURITY.md                  # Security architecture & practices
└── LICENSES.md                  # Third-party license info
```

## GitHub Configuration (`/.github`)

```
.github/
├── README.md                    # Workflows documentation
├── WORKFLOWS.md                 # Quick reference guide
├── CODEOWNERS                   # Code ownership rules
├── dependabot.yml               # Dependency automation
├── pull_request_template.md     # PR checklist
│
├── workflows/                   # GitHub Actions
│   ├── tests.yml               # Unit tests & linting
│   ├── build.yml               # Production build
│   ├── security.yml            # Security scanning
│   ├── a11y.yml                # Accessibility checks
│   ├── deploy.yml              # Vercel deployment
│   └── nightly.yml             # Nightly comprehensive tests
│
├── ISSUE_TEMPLATE/              # Issue templates
│   ├── bug_report.md           # Bug report form
│   ├── feature_request.md      # Feature request form
│   ├── accessibility.md        # A11y issue form
│   └── config.yml              # Template configuration
│
└── lighthouse/                  # Performance testing
    └── lighthouse-ci.json       # Lighthouse thresholds
```

## Source Code Directory (`/src`)

```
src/
├── main.ts                      # Application entry point
├── index.html                   # HTML template
├── styles.css                   # Global styles
│
├── environments/                # Environment configs
│   ├── environment.ts           # Development
│   └── environment.prod.ts      # Production
│
└── app/                         # Angular application
    ├── app.component.ts         # Root component
    ├── app.routes.ts            # Route definitions
    ├── app.config.ts            # App configuration
    │
    ├── core/                    # Singleton services
    │   ├── custom-preloading-strategy.ts
    │   └── error-handler.ts
    │
    ├── features/                # Feature modules
    │   ├── auth/               # Authentication
    │   ├── dashboard/          # Dashboard
    │   ├── properties/         # Property management
    │   ├── tenants/            # Tenant management
    │   ├── financial-analytics/ # Financial reports
    │   ├── map/                # Interactive maps
    │   ├── notifications/      # Notifications
    │   ├── property-detail/    # Property details
    │   ├── reports/            # Reporting
    │   ├── work-orders/        # Work order management
    │   └── [other-features]/
    │
    ├── shared/                  # Shared utilities
    │   ├── components/         # Reusable components
    │   ├── directives/         # Custom directives
    │   ├── pipes/              # Custom pipes
    │   └── utils/              # Utility functions
    │
    └── models/                  # TypeScript interfaces
        ├── property.model.ts
        ├── tenant.model.ts
        ├── user.model.ts
        └── [other-models].ts
```

## Public Assets (`/public`)

```
public/
├── favicon.svg                  # Site favicon
└── assets/
    ├── data/                    # Mock/fixture data
    │   ├── dashboard.json
    │   ├── properties.json
    │   ├── tenants.json
    │   ├── financials.json
    │   ├── work-orders.json
    │   └── notifications.json
    │
    └── [images/, icons/, etc.]
```

## Build Output (`/dist`)

```
dist/
└── real-estate-platform/       # Production bundle
    ├── index.html
    ├── main.*.js               # Main bundle
    ├── polyfills.*.js          # Polyfills
    ├── styles.*.css            # Styles
    └── assets/                 # Static assets
```

## Key File Relationships

### Configuration Flow
```
.nvmrc (Node version 22.14.0)
    ↓
package.json (Dependencies)
    ↓
tsconfig.json (TypeScript setup)
    ↓
angular.json (Build config)
    ↓
dist/ (Build output)
```

### CI/CD Flow
```
.github/workflows/
    ├── tests.yml        → npm test
    ├── build.yml        → npm build
    ├── security.yml     → npm audit + CodeQL
    ├── a11y.yml         → Accessibility audit
    ├── deploy.yml       → Vercel deploy
    └── nightly.yml      → Full test suite
```

### Documentation Hierarchy
```
README.md (Project overview)
├── docs/GETTING_STARTED.md (Setup)
├── docs/ARCHITECTURE.md (Design)
├── docs/CONFIGURATION.md (Settings)
├── docs/API_INTEGRATION.md (APIs)
├── docs/CONTRIBUTING.md (Development)
├── docs/SECURITY.md (Security)
└── docs/LICENSES.md (Licenses)
```

## File Naming Conventions

### Components
```
src/app/features/properties/
├── properties.component.ts      # Main component
├── properties.component.html    # Template
├── properties.component.css     # Styles
└── [child-components]/
```

### Services
```
src/app/services/
├── property.service.ts
├── tenant.service.ts
└── [other-services].service.ts
```

### Models & Interfaces
```
src/app/models/
├── property.model.ts
├── tenant.model.ts
├── user.model.ts
└── [domain].model.ts
```

### Routing
```
src/app/features/[feature]/
└── [feature].routes.ts
```

## Configuration by Environment

### Development
```
.env.development
- Debugging enabled
- Localhost API
- Detailed logs
```

### Production
```
.env.production
- Optimized build
- Remote API
- Production domain
```

### Testing
```
tsconfig.spec.json
karma.conf.js
Coverage in /coverage/
```

## Security & Compliance Files

### Location Reference
```
Root:
├── LICENSE                  # Software license
├── SECURITY.md             # Security policy
├── CODE_OF_CONDUCT.md      # Community standards

Docs:
├── docs/SECURITY.md        # Technical security
├── docs/LICENSES.md        # Dependency licenses
└── docs/CONTRIBUTING.md    # Development guide

.github:
└── security.yml            # Automated scanning
```

## Important Notes

### Files NOT in Root
- ❌ No `.env` (use GitHub Secrets)
- ❌ No config files mixed with source
- ❌ No deployment configs (use Vercel)

### Files Always in Docs
- ✅ CONTRIBUTING.md
- ✅ SECURITY.md (detailed)
- ✅ LICENSES.md
- ✅ GETTING_STARTED.md
- ✅ ARCHITECTURE.md

### Files Always in Root
- ✅ LICENSE
- ✅ SECURITY.md (policy)
- ✅ CODE_OF_CONDUCT.md
- ✅ README.md
- ✅ CHANGELOG.md

---

**Last Updated**: September 2024
