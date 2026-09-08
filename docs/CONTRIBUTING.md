# Contributing Guide

Thank you for your interest in contributing to the Real Estate Platform! This guide will help you get started.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:
- Be respectful and professional
- Accept constructive criticism gracefully
- Focus on collaboration over confrontation

## Getting Started

### Prerequisites
- Node.js 22.14.0 or higher
- npm 10.5.0 or higher
- Git
- Angular CLI 18.2.21

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/Mostafa-SAID7/real-estate-platform.git
cd real-estate-platform

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm run test

# Build for production
npm run build
```

## Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bug
```

**Branch naming**:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code improvements
- `test/description` - Tests

### 2. Make Changes

Follow project conventions:
- Use TypeScript strict mode
- Follow Angular style guide
- Use component-based architecture
- Document complex logic
- Write unit tests for new code

### 3. Test Locally

```bash
# Run tests
npm run test -- --watch=false

# Check code coverage
npm run test -- --code-coverage

# Build for production
npm run build -- --configuration production

# Run linter (if available)
npm run lint
```

### 4. Commit Changes

```bash
git add .
git commit -m "type(scope): description"
```

**Commit message format** (Conventional Commits):
```
<type>(<scope>): <description>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code restructure
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Dependencies, build, etc.
- `ci`: CI/CD configuration

**Examples**:
```
feat(dashboard): add real-time notifications
fix(properties): resolve filter bug
docs(auth): update authentication guide
test(tenants): add unit tests for tenant service
```

### 5. Push & Create Pull Request

```bash
git push origin feature/my-feature
```

On GitHub:
1. Create Pull Request
2. Fill out PR template completely
3. Reference related issues: `Closes #123`
4. Ensure all checks pass

### 6. Code Review

- Respond to reviewer feedback
- Make requested changes
- Push updates (no force push)
- Request re-review when ready

### 7. Merge

Once approved:
- Merge with "Squash and merge" for clean history
- Delete feature branch

## Code Standards

### TypeScript
```typescript
// ✅ Good
const calculateROI = (revenue: number, expenses: number): number => {
  if (expenses === 0) return 0;
  return (revenue - expenses) / expenses;
};

// ❌ Bad
const calc = (r, e) => (r - e) / e;  // Unclear naming
```

### Components
```typescript
// ✅ Good component structure
@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  template: `...`,
  styles: [`...`]
})
export class PropertyCardComponent {
  @Input() property!: Property;
  @Output() propertyClicked = new EventEmitter<Property>();
}

// ❌ Avoid: Not standalone, missing types
```

### Naming Conventions
- **Classes**: PascalCase - `PropertyService`
- **Functions**: camelCase - `calculateROI()`
- **Constants**: UPPER_SNAKE_CASE - `MAX_PROPERTIES`
- **Variables**: camelCase - `propertyCount`
- **Files**: kebab-case - `property.service.ts`

### File Structure
```
src/app/
├── core/              # Singleton services
├── features/          # Feature modules
│   ├── dashboard/
│   ├── properties/
│   └── tenants/
├── shared/            # Reusable components
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── utils/
└── models/            # TypeScript interfaces
```

### Testing

Every new feature/fix should have tests:

```typescript
// ✅ Good test
describe('PropertyService', () => {
  let service: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyService);
  });

  it('should calculate ROI correctly', () => {
    const roi = service.calculateROI(1000, 800);
    expect(roi).toBe(0.25);
  });
});
```

## Documentation

### Code Comments
```typescript
// Good: Explain WHY
// Using setTimeout to allow form to update before navigation
setTimeout(() => {
  this.router.navigate(['/properties']);
}, 100);

// Avoid: Explaining WHAT (code already shows this)
// Increase timeout by 100ms
setTimeout(() => {
  this.router.navigate(['/properties']);
}, 100);
```

### Update Documentation
- Update README if adding features
- Update API_INTEGRATION.md for API changes
- Add JSDoc comments to public methods
- Update CHANGELOG.md

## Accessibility

### WCAG 2.2 Level AA Compliance
- ✅ Keyboard navigation support
- ✅ ARIA labels where needed
- ✅ Color contrast: 4.5:1 for text
- ✅ Alt text for images
- ✅ Proper heading hierarchy

### Test Accessibility
```bash
# Manual testing with keyboard
- Tab through interface
- Ensure focus indicators visible
- Test with screen reader (NVDA, JAWS, VoiceOver)
```

## Security

### Before Committing
- ✅ No hardcoded secrets
- ✅ No API keys in code
- ✅ Input validation implemented
- ✅ XSS prevention
- ✅ CSRF protection

### Security Review
- Mention security implications in PR
- Reference SECURITY.md if applicable
- Add security tests if needed

## Performance

### Optimization Guidelines
- Lazy load routes
- Use OnPush change detection
- Implement virtual scrolling for lists
- Optimize images
- Tree-shake unused code
- Monitor bundle size

### Check Bundle Size
```bash
npm run build -- --configuration production
# Check dist/real-estate-platform size
```

## Common Tasks

### Add a New Component
```bash
ng generate component features/dashboard/kpi-card
```

### Add a New Service
```bash
ng generate service services/property
```

### Add a New Route
Edit `src/app/app.routes.ts`:
```typescript
{
  path: 'properties',
  component: PropertiesComponent,
  canActivate: [AuthGuard]
}
```

### Update Dependencies
```bash
npm update                      # Update to latest compatible
npm install package@latest      # Update to latest version
```

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bug Reports**: Open an Issue (use template)
- **Security Issues**: Email security@...
- **Documentation**: Check `/docs` folder

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub release notes
- Project README (for major contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏
