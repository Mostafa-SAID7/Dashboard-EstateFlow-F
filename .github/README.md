# GitHub Configuration

This directory contains GitHub Actions workflows, issue templates, and configuration for the Real Estate Platform project.

## 📋 Directory Structure

```
.github/
├── workflows/              # Automated CI/CD pipelines
│   ├── tests.yml          # Unit tests & linting
│   ├── build.yml          # Production build verification
│   ├── security.yml       # Dependency & code security scanning
│   ├── a11y.yml           # Accessibility (WCAG compliance) checks
│   ├── deploy.yml         # Build & deploy to Netlify
│   └── nightly.yml        # Nightly comprehensive tests
├── ISSUE_TEMPLATE/        # GitHub issue templates
│   ├── bug_report.md      # Bug report template
│   ├── feature_request.md # Feature request template
│   ├── accessibility.md   # Accessibility issue template
│   └── config.yml         # Issue template configuration
├── lighthouse/            # Lighthouse CI configuration
│   └── lighthouse-ci.json # Performance & accessibility thresholds
├── dependabot.yml         # Automated dependency updates
├── CODEOWNERS             # Code ownership rules
└── pull_request_template.md # PR template with quality checklist
```

## 🚀 Workflows Overview

### 1. **Tests & Linting** (`tests.yml`)
Runs on every push and pull request.

**Purpose**: Catch code quality issues early
- ESLint validation (if configured)
- Unit tests with Karma + Jasmine
- Code coverage reporting to Codecov
- **Duration**: ~15-20 minutes

**Key Features**:
- Runs on Node 22.14.0 (matches `.nvmrc`)
- Uploads coverage reports as artifacts
- Integrates with Codecov

### 2. **Build Verification** (`build.yml`)
Runs on every push and pull request.

**Purpose**: Ensure production build succeeds and budgets are met
- Production build with Angular CLI
- Bundle size analysis
- Verifies no build errors
- Checks against configured budgets
- **Duration**: ~20-25 minutes

**Build Budgets** (from `angular.json`):
- Initial bundle: ≤ 500KB (warning), ≤ 1MB (error)
- Component styles: ≤ 2KB each (warning), ≤ 4KB (error)

### 3. **Security Scanning** (`security.yml`)
Runs on every push, PR, and daily at 2 AM UTC.

**Purpose**: Detect vulnerabilities and licensing issues
- `npm audit` for dependency vulnerabilities
- CodeQL static analysis
- Secret scanning with TruffleHog
- Dependency license review
- **Duration**: ~15-20 minutes

**Triggers**:
- All pushes and PRs
- Daily schedule for continuous monitoring
- PR events for enhanced dependency review

### 4. **Accessibility (A11y) Checks** (`a11y.yml`)
Runs on every push, PR, and weekly (Monday 2 AM UTC).

**Purpose**: Maintain WCAG 2.2 Level AA compliance
- Automated axe-core accessibility audit
- Semantic HTML validation
- ARIA attribute scanning
- **Duration**: ~25-30 minutes

**Compliance Target**: WCAG 2.2 Level AA (declared in README.md)

**Note**: Automated checks identify potential issues. Manual testing with assistive technologies (screen readers, keyboard navigation) is required for full compliance validation.

### 5. **Deployment** (`deploy.yml`)
Runs on pushes to main/develop and after successful builds.

**Purpose**: Automatically deploy to Vercel
- Triggers after build verification succeeds
- Builds production bundle
- Deploys to Vercel
- Runs Lighthouse performance checks
- Posts deployment info to PRs
- **Duration**: ~20-30 minutes

**Configuration Required**:
```bash
# Set these secrets in GitHub:
VERCEL_TOKEN           # Vercel authentication token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
CODECOV_TOKEN          # Codecov (optional, for coverage)
```

### 6. **Nightly Tests** (`nightly.yml`)
Runs daily at 2 AM UTC (can be triggered manually).

**Purpose**: Comprehensive testing when developers are sleeping
- Full test suite with coverage
- Production build
- Dependency update checks
- npm audit report
- **Duration**: ~40-45 minutes

**Triggers**:
- Scheduled: Daily at 2 AM UTC
- Manual: Via `workflow_dispatch`

## 🔐 Dependency Management

### Dependabot Configuration (`dependabot.yml`)

Automatically creates PRs for dependency updates:

**npm Dependencies**:
- Weekly updates (Mondays, 3 AM UTC)
- Limits to 10 open PRs
- Requires review
- Labels: `dependencies`, `npm`
- Commits: `chore(deps):`

**GitHub Actions**:
- Weekly updates (Mondays, 4 AM UTC)
- Limits to 5 open PRs
- Commits: `ci:`

**Configuration**:
```yaml
# Edit .github/dependabot.yml to:
- Change schedule frequency
- Ignore specific packages
- Modify PR limits
- Change target branch (currently: develop)
```

## 📋 Issue Templates

### Bug Report (`bug_report.md`)
For reporting bugs and defects.
- Steps to reproduce
- Expected vs. actual behavior
- Environment details (OS, browser, versions)
- Screenshots/videos
- Accessibility considerations

### Feature Request (`feature_request.md`)
For proposing new features or enhancements.
- Problem statement
- Proposed solution
- Use cases
- Design mockups
- Accessibility impact

### Accessibility Issue (`accessibility.md`)
For reporting WCAG compliance or accessibility issues.
- WCAG criterion reference
- Testing method (screen reader, keyboard, etc.)
- Assistive technology used
- Impact assessment
- Current vs. expected behavior

## 👥 Code Ownership

`CODEOWNERS` file defines who reviews what:
- Default: @Mostafa-SAID7
- Configurable by directory/file

### How It Works:
- GitHub automatically requests review from code owners
- Required approval from CODEOWNERS (when branch protection is enabled)
- Add yourself to CODEOWNERS for review requests

## 🔍 Security & Performance

### GitHub Actions Permissions
Workflows run with minimal permissions:
- CodeQL: Read contents, write security-events
- Others: Read contents only

### Secret Management
Required secrets (set in GitHub settings):
1. `VERCEL_TOKEN` - For Vercel deployments
2. `VERCEL_ORG_ID` - For Vercel organization
3. `VERCEL_PROJECT_ID` - For Vercel project
4. `CODECOV_TOKEN` - For coverage reporting (optional)

**Never commit secrets to the repo.**

### Lighthouse Performance Targets
From `lighthouse-ci.json`:
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 90

## 🔄 PR & Commit Strategy

### Pull Request Template
Every PR includes a comprehensive checklist:
- Code quality
- Testing
- Accessibility
- Build & performance
- Documentation
- Security
- Self-review

### Recommended Workflow
1. Create feature branch from `develop`
2. Make changes and test locally
3. Run: `npm ci && npm run test && npm run build`
4. Push to GitHub
5. Create PR → GitHub Actions run automatically
6. Address any failing checks
7. Request review (CODEOWNERS auto-assigned)
8. Merge when approved and checks pass

## ⚙️ Setup Instructions

### 1. Initial Configuration

```bash
# No setup required - workflows are pre-configured
# Just ensure your Node version matches .nvmrc:
node --version  # Should be 22.14.0
```

### 2. Add GitHub Secrets

**For automatic deployment to Vercel**:

1. Go to repository Settings → Secrets and variables → Actions
2. Add these secrets:
   ```
   VERCEL_TOKEN         = <your-vercel-personal-access-token>
   VERCEL_ORG_ID        = <your-vercel-org-id>
   VERCEL_PROJECT_ID    = <your-vercel-project-id>
   ```

3. (Optional) Add Codecov token for coverage reports:
   ```
   CODECOV_TOKEN       = <your-codecov-token>
   ```

### 3. Configure Branch Protection

**Optional but recommended**:

1. Go to Settings → Branches → Add rule
2. Apply to: `main`, `develop`
3. Require:
   - Status checks to pass (select workflows)
   - Code owner reviews
   - Dismiss stale PR approvals
   - Require branches to be up to date

## 📊 Monitoring & Troubleshooting

### View Workflow Status
1. Go to repository → **Actions** tab
2. See all workflows and their status
3. Click workflow to see details and logs

### Common Issues

**Builds failing**:
- Check build logs in GitHub Actions
- Run locally: `npm ci && npm run build -- --configuration production`
- Verify Node version: `node --version`

**Dependency vulnerabilities**:
- Run: `npm audit` locally
- See security.yml scan results
- Update vulnerable packages or ignore them

**Deployment failing**:
- Verify Netlify secrets are set
- Check deployment logs in GitHub Actions
- Ensure build succeeds in build.yml first

**A11y audit warnings**:
- Auto-detected issues need manual validation
- Test with screen readers: NVDA (Windows), VoiceOver (Mac)
- Test keyboard navigation manually
- Check contrast with browser inspector

## 📚 References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Angular Build & Performance](https://angular.dev/guide/build)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Netlify Deployment](https://docs.netlify.com/git/overview/)

## 🔄 Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Review Dependabot PRs | Weekly | Team |
| Check security scans | As needed | Security lead |
| Review A11y audit | Monthly | A11y lead |
| Update workflows | Quarterly | DevOps |
| Review Lighthouse metrics | Monthly | Tech lead |

## 💡 Tips

1. **Fast feedback**: Check workflow status while developing
2. **Local testing**: Run the same commands CI runs before pushing
3. **PR preview**: Netlify generates preview for every PR
4. **Accessibility**: Manual testing is essential - automation finds potential issues only
5. **Secrets**: Use GitHub Secrets for sensitive data, never commit to repo

---

**Last Updated**: September 2026
**Node Version**: 22.14.0
**Angular Version**: 18.2.0
