# Setup & Build Guide

## Prerequisites
- Node.js 22.14.0
- npm 10.5.0+
- Git

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

The `.npmrc` file is configured with `legacy-peer-deps=true` to handle dependency conflicts.

### 2. Verify Installation
```bash
npm list --depth=0
```

### 3. Run Development Server
```bash
npm start
```

Opens app at http://localhost:4200

### 4. Build for Production
```bash
npm run build -- --configuration production
```

Output: `dist/real-estate-platform/`

### 5. Run Tests
```bash
npm run test -- --watch=false
```

### 6. Run Tests with Coverage
```bash
npm run test -- --watch=false --code-coverage
```

Coverage report: `coverage/real-estate-platform/`

## Troubleshooting

### npm ci fails
If `npm ci` fails with "Exit handler never called":
```bash
# Delete lock file and reinstall
rm package-lock.json
npm install
```

### Node modules corruption
```bash
# Clean and reinstall
rm -r node_modules package-lock.json
npm install
```

### Port 4200 already in use
```bash
npm start -- --port 4300
```

### Build fails with memory
```bash
# Increase Node memory
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

## Project Structure

```
src/app/
├── core/              # Services, error handler
├── features/          # Feature modules
├── shared/            # Reusable components
├── guards/            # Route guards
├── interceptors/      # HTTP interceptors
├── models/            # TypeScript interfaces
├── services/          # Application services
├── store/             # NgRx state management
└── utils/             # Utility functions
```

## Key Files

- `angular.json` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies
- `.npmrc` - npm configuration (legacy peer deps)
- `tailwind.config.js` - Tailwind CSS
- `karma.conf.js` - Test runner

## Development Workflow

1. Make changes to components/services
2. Tests run automatically on save (if using ng serve)
3. Run full test suite before committing: `npm test -- --watch=false`
4. Build for production: `npm run build -- --configuration production`
5. Commit changes with meaningful messages

## Common Scripts

```bash
npm start                                    # Dev server
npm run build                                # Build (dev)
npm run build -- --configuration production  # Build (prod)
npm run test                                 # Tests (watch)
npm run test -- --watch=false                # Tests (once)
npm run test -- --watch=false --code-coverage # Tests + coverage
npm run watch                                # Build watch
```

---

For more information see:
- [README.md](./README.md) - Project overview
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture
- [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) - Contributing
