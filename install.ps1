# Real Estate Platform - Installation Script
# Handles all npm installation and setup

param(
    [switch]$Clean,
    [switch]$Force,
    [switch]$Test
)

Write-Host "🚀 Real Estate Platform - Installation Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check Node version
Write-Host "`n📋 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version
Write-Host "   npm: $npmVersion" -ForegroundColor Green

# Check required versions
$nodeRequired = "v22.14.0"
if ($nodeVersion -lt $nodeRequired) {
    Write-Host "   ⚠️  Consider updating to Node $nodeRequired" -ForegroundColor Yellow
}

# Clean if requested
if ($Clean) {
    Write-Host "`n🧹 Cleaning npm cache and node_modules..." -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "   ✓ Removed node_modules" -ForegroundColor Green
    }
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json"
        Write-Host "   ✓ Removed package-lock.json" -ForegroundColor Green
    }
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
if ($Force) {
    npm install --force
} else {
    npm install
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Dependencies installed" -ForegroundColor Green

# Verify installation
Write-Host "`n✅ Verifying installation..." -ForegroundColor Yellow
$packages = npm list --depth=0 --json | ConvertFrom-Json

Write-Host "   ✓ @angular/core: $(if ($packages.dependencies.'@angular/core') { '✓' } else { '✗' })" -ForegroundColor Green
Write-Host "   ✓ typescript: $(if ($packages.dependencies.typescript) { '✓' } else { '✗' })" -ForegroundColor Green
Write-Host "   ✓ @ngrx/store: $(if ($packages.dependencies.'@ngrx/store') { '✓' } else { '✗' })" -ForegroundColor Green

# Run tests if requested
if ($Test) {
    Write-Host "`n🧪 Running tests..." -ForegroundColor Yellow
    npm run test -- --watch=false --code-coverage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n   ✓ All tests passed" -ForegroundColor Green
    } else {
        Write-Host "`n   ⚠️  Some tests failed - review output above" -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`n📖 Next steps:" -ForegroundColor Cyan
Write-Host "   1. npm start        - Run development server" -ForegroundColor White
Write-Host "   2. npm run build    - Build for production" -ForegroundColor White
Write-Host "   3. npm test         - Run tests" -ForegroundColor White

Write-Host "`n📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - SETUP.md           - Setup and build guide" -ForegroundColor White
Write-Host "   - README.md          - Project overview" -ForegroundColor White
Write-Host "   - docs/ARCHITECTURE  - Architecture guide" -ForegroundColor White
