# PowerShell script to completely stop and restart the server
Write-Host "Stopping any existing Node processes on port 5000..." -ForegroundColor Yellow

# Find and kill processes using port 5000
$processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "Killing process $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

Write-Host "`nStarting server..." -ForegroundColor Green
Write-Host "Make sure you're in the backend directory: C:\Users\Adi\Downloads\orbito\backend`n" -ForegroundColor Cyan

node server.js
