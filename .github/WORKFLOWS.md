# GitHub Actions Workflows - Quick Reference

## Workflow Execution Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PUSH TO main OR develop                          │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
            ┌─────────────┐ ┌──────────┐ ┌──────────────┐
            │ Tests.yml   │ │Build.yml │ │Security.yml  │
            │ ~15 min     │ │ ~20 min  │ │ ~15 min      │
            └─────────────┘ └──────────┘ └──────────────┘
                    │             │             │
                    │         (on success)      │
                    │             │             │
                    └─────────────┼─────────────┘
                                  │
                                  ▼
                        ┌──────────────────┐
                        │  Deploy.yml      │
                        │  + Lighthouse    │
                        │  ~25 min total   │
                        └──────────────────┘
```

## 🎯 Workflow Responsibilities

| Workflow | Triggers | Purpose | Fails on |
|----------|----------|---------|----------|
| **tests.yml** | PR, Push | ESLint + Unit tests + Coverage | Test failure, Coverage drop |
| **build.yml** | PR, Push | Production build verification | Build error, Budget exceeded |
| **security.yml** | PR, Push, Daily (2 AM UTC) | npm audit, CodeQL, Secret scan | High severity vulnerabilities |
| **a11y.yml** | PR, Push, Weekly (Mon 2 AM) | Accessibility audit | Critical A11y violations |
| **deploy.yml** | Push to main/develop | Build → Deploy to Netlify → Lighthouse | Build failure, Deploy error |
| **nightly.yml** | Daily (2 AM UTC) | Comprehensive testing & audits | Manual intervention needed |

## ⚡ Key Features per Workflow

### tests.yml
```
Input:  Source code
Output: Test reports, Coverage report
Status: ✅ Pass/❌ Fail
Artifacts: Coverage HTML report (30 days)
```

### build.yml
```
Input:  Source code
Output: dist/real-estate-platform/ (Angular app)
Status: ✅ Pass/❌ Fail
Checks:
  - No build errors
  - Bundle size within budgets
  - All polyfills loaded
Artifacts: Compiled app (30 days)
```

### security.yml
```
Input:  package.json + source code
Output: Security reports
Status: ✅ Pass/⚠️ Warning/❌ Fail
Scans:
  - npm audit (moderate+)
  - CodeQL (JavaScript)
  - Secret detection (TruffleHog)
  - License review (PR only)
Artifacts: npm-audit-report.json
```

### a11y.yml
```
Input:  Built application
Output: Accessibility audit report
Status: ⚠️ Issues found/✅ Clear
Checks:
  - axe-core audit (WCAG 2.2 AA)
  - ARIA attribute presence
  - Semantic HTML
Artifacts: a11y-report.json (30 days)
Note:     Manual testing still required!
```

### deploy.yml
```
Input:  Production build (from build.yml)
Output: Deployed app on Vercel + Lighthouse results
Stages:
  1. Build (npm run build)
  2. Deploy (Vercel)
  3. Lighthouse check
Status: ✅ Deployed/❌ Failed
Environment:
  - main   → Production
  - develop→ Preview (with PR preview)
```

### nightly.yml
```
Input:  Full repository
Output: Test reports, Build logs, Audit reports
Run:    Daily at 2 AM UTC
Purpose:Deep testing while team sleeps
Action: Create GitHub comment on issues
```

## 🔄 Dependency Updates (Dependabot)

```
Every Monday at 3 AM UTC (npm) and 4 AM UTC (Actions)
       ↓
  Create PRs for new versions
       ↓
  Labels: dependencies, npm
       ↓
  Assigned to: @Mostafa-SAID7
       ↓
  Review → Merge or Close
```

**Configuration**: Edit `.github/dependabot.yml` to:
- Change schedule
- Ignore packages
- Modify PR limits
- Change target branch

## 🚨 Typical Failure Scenarios

### Test Failures
```
Cause:   Unit test fails
Solution:
  1. Check error message in workflow logs
  2. Reproduce locally: npm test
  3. Fix the test
  4. Commit & push
```

### Build Budget Exceeded
```
Cause:   Added JS/CSS makes bundle too large
Solution:
  1. Check bundle-analysis job output
  2. Optimize or split code
  3. Update budget in angular.json (if intentional)
  4. Commit & push
```

### Security Vulnerability
```
Cause:   npm audit finds vulnerable package
Solution:
  1. Update package: npm update package-name
  2. Or ignore (if low risk, see npm audit docs)
  3. Verify still works
  4. Commit & push
```

### A11y Audit Issues
```
Cause:   Accessibility violations detected
Solution:
  1. Review a11y-report.json artifact
  2. Test manually with screen reader
  3. Fix component templates or styling
  4. Commit & push
```

### Deploy Failure
```
Cause:   Build succeeded but Vercel deploy failed
Solution:
  1. Check Vercel secrets are set correctly
  2. Verify VERCEL_ORG_ID and VERCEL_PROJECT_ID
  3. Check Vercel dashboard logs
  4. Re-run workflow
```

## 📊 Monitoring Your Workflows

### GitHub Actions Page
1. Go to repo → **Actions** tab
2. See all workflows and their status
3. Click workflow name for details

### Per-Run Details
1. Click workflow run
2. See:
   - Each job's status
   - Full logs
   - Artifacts uploaded
   - Errors with line numbers

### PR Checks
1. Open a PR
2. Scroll down to "Checks" section
3. See all workflow results
4. Click "Details" to see logs

## 🛠️ Manual Workflow Triggers

### Trigger Nightly Workflow Manually
```
1. Go to Actions → Nightly Tests & Updates
2. Click "Run workflow"
3. Select branch
4. Click "Run workflow"
```

### Re-run Failed Workflow
```
1. Go to Actions → Click failed workflow run
2. Click "Re-run failed jobs" or "Re-run all jobs"
3. Workflows run again
```

## 📈 Performance Metrics

### Expected Duration
| Workflow | Duration | Concurrent |
|----------|----------|-----------|
| tests.yml | ~15 min | Yes |
| build.yml | ~20 min | Yes |
| security.yml | ~15 min | Yes |
| a11y.yml | ~25 min | Yes |
| deploy.yml | ~25 min | After build.yml succeeds |
| **Total** | **~25 min** | Parallel execution |

### Resource Usage
- **Node Version**: 22.14.0
- **OS**: Ubuntu latest
- **RAM**: Sufficient for build
- **Disk**: ~2GB for node_modules + dist

## 🔐 Secrets Configuration

### Required for Deployment
```bash
VERCEL_TOKEN        # Get from vercel.com/account/tokens
VERCEL_ORG_ID       # Get from Vercel dashboard settings
VERCEL_PROJECT_ID   # Get from Vercel project settings
```

### Optional
```bash
CODECOV_TOKEN       # For coverage reports to codecov.io
```

### How to Add
1. Go to repo Settings
2. Secrets and variables → Actions
3. New repository secret
4. Name & value
5. Click "Add secret"

## 📋 Workflow Best Practices

### For Developers
✅ Run locally before pushing:
```bash
npm ci                              # Install exact versions
npm run test -- --watch=false       # Run tests once
npm run build -- --configuration production  # Build for prod
```

✅ Check workflow logs for errors
✅ Keep security alerts cleared
✅ Use meaningful commit messages

### For Maintainers
✅ Review dependabot PRs weekly
✅ Monitor security scan results
✅ Check accessibility audit findings
✅ Review Lighthouse metrics monthly

## 🔗 Quick Links

- [Workflows Directory](./)
- [Main README](../README.md)
- [Templates](./ISSUE_TEMPLATE/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Tip**: Bookmark the GitHub Actions page for your repo to monitor builds easily!
