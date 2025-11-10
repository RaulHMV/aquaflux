# ==========================================
# PRUEBAS DEL SISTEMA DE NOTIFICACIONES
# ==========================================

Write-Host "🔔 Pruebas del Sistema de Notificaciones Push - AquaFlux`n" -ForegroundColor Cyan

# Configuración
$BASE_URL = "http://localhost:3000"  # Cambiar a tu URL de Vercel en producción
$CRON_SECRET = "tu-super-secreto-para-cron-12345"

# ==========================================
# 1. OBTENER TOKEN JWT
# ==========================================
Write-Host "📝 1. Iniciando sesión..." -ForegroundColor Yellow

$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/api/auth/login" -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"username":"test123","password":"Test123!"}'

$JWT_TOKEN = $loginResponse.data.token
Write-Host "✅ Token JWT obtenido`n" -ForegroundColor Green

# ==========================================
# 2. REGISTRAR FCM TOKEN
# ==========================================
Write-Host "📱 2. Registrando FCM token..." -ForegroundColor Yellow

$fcmToken = "test_fcm_token_" + (Get-Date -Format "yyyyMMddHHmmss")

$updateTokenResponse = Invoke-RestMethod -Uri "$BASE_URL/api/users/fcm-token" -Method PUT `
    -Headers @{
        "Authorization"="Bearer $JWT_TOKEN"
        "Content-Type"="application/json"
    } `
    -Body "{`"fcm_token`":`"$fcmToken`"}"

Write-Host "✅ FCM token registrado: $fcmToken`n" -ForegroundColor Green
Write-Host ($updateTokenResponse | ConvertTo-Json -Depth 5)
Write-Host "`n"

# ==========================================
# 3. EJECUTAR CRON JOB MANUALMENTE
# ==========================================
Write-Host "⏰ 3. Ejecutando Cron Job manualmente..." -ForegroundColor Yellow

try {
    $cronResponse = Invoke-RestMethod -Uri "$BASE_URL/api/cron/check-leaks" -Method POST `
        -Headers @{"Authorization"="Bearer $CRON_SECRET"}

    Write-Host "✅ Cron Job ejecutado exitosamente`n" -ForegroundColor Green
    Write-Host "📊 Resultados:" -ForegroundColor Cyan
    Write-Host ($cronResponse.data | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "❌ Error ejecutando Cron Job:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`n"

# ==========================================
# 4. ELIMINAR FCM TOKEN (OPCIONAL)
# ==========================================
Write-Host "🗑️  4. ¿Deseas eliminar el FCM token? (S/N)" -ForegroundColor Yellow
$respuesta = Read-Host

if ($respuesta -eq "S" -or $respuesta -eq "s") {
    $deleteResponse = Invoke-RestMethod -Uri "$BASE_URL/api/users/fcm-token" -Method DELETE `
        -Headers @{"Authorization"="Bearer $JWT_TOKEN"}

    Write-Host "✅ FCM token eliminado`n" -ForegroundColor Green
    Write-Host ($deleteResponse | ConvertTo-Json -Depth 5)
}

Write-Host "`n✨ Pruebas completadas`n" -ForegroundColor Cyan
