# Script para limpiar completamente Expo y Metro
Write-Host "Limpiando caché de Expo..." -ForegroundColor Yellow

# Detener procesos de Expo si están corriendo
Get-Process | Where-Object {$_.ProcessName -like "*expo*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Limpiar directorios
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force ".expo"
    Write-Host "✓ Eliminado .expo" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
    Write-Host "✓ Eliminado node_modules/.cache" -ForegroundColor Green
}

# Limpiar caché de npm
npm cache clean --force
Write-Host "✓ Caché de npm limpiada" -ForegroundColor Green

# Limpiar watchman (si está instalado)
if (Get-Command watchman -ErrorAction SilentlyContinue) {
    watchman watch-del-all 2>$null
    Write-Host "✓ Watchman limpiado" -ForegroundColor Green
}

Write-Host "`nLimpieza completada. Ahora ejecuta: npm start" -ForegroundColor Cyan

