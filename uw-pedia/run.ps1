# PowerShell script to run UWpedia app
Write-Host "Starting UWpedia development server..." -ForegroundColor Green

# Navigate to the project directory
Set-Location $PSScriptRoot

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "Starting Vite dev server..." -ForegroundColor Cyan
npm run dev






