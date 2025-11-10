# ⏰ Configuración de Cron Jobs con cron-job.org (GRATIS)

## 🎯 Resumen
Vamos a usar **cron-job.org** para ejecutar el chequeo de fugas cada 5 minutos automáticamente, sin costo alguno.

---

## 📋 Paso 1: Configurar Variable de Entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Click en tu proyecto **aquaflux**
3. Ve a **Settings** → **Environment Variables**
4. Agrega esta variable:

```
CRON_SECRET=AquaFluxSecretKey2025SuperSeguro
```

5. Click en **Save**
6. Ve a **Deployments** y haz **Redeploy** del último deployment

⚠️ **IMPORTANTE**: Copia y guarda este secreto: `AquaFluxSecretKey2025SuperSeguro`

---

## 📋 Paso 2: Registrarte en cron-job.org

1. Ve a: https://cron-job.org/en/
2. Click en **Sign up** (Registro)
3. Completa el formulario:
   - Email: tu email
   - Password: crea una contraseña
4. Confirma tu email
5. Inicia sesión

---

## 📋 Paso 3: Crear el Cron Job

Una vez dentro de cron-job.org:

### 3.1 Click en "Create cronjob"

### 3.2 Configuración básica:
- **Title**: `AquaFlux - Check Leaks`
- **Address (URL)**: `https://aquaflux.vercel.app/api/cron/check-leaks`

### 3.3 Schedule (Frecuencia):
Selecciona **"Every 5 minutes"**

O si quieres personalizar:
- **Minutes**: `*/5` (cada 5 minutos)
- **Hours**: `*` (todas las horas)
- **Days**: `*` (todos los días)
- **Months**: `*` (todos los meses)
- **Weekdays**: `*` (todos los días de la semana)

### 3.4 Request settings (¡IMPORTANTE!):
1. **Request method**: Selecciona `POST`
2. Click en **"Advanced"**
3. En **"Custom request headers"**, agrega:

```
Authorization: Bearer AquaFluxSecretKey2025SuperSeguro
```

**Formato exacto:**
- Header name: `Authorization`
- Header value: `Bearer AquaFluxSecretKey2025SuperSeguro`

### 3.5 Otras configuraciones:
- **Enabled**: ✅ Activado
- **Save responses**: ✅ Activado (para ver logs)
- **Notification on failure**: ✅ Activado (te avisa si falla)

### 3.6 Click en **"Create cronjob"**

---

## ✅ Paso 4: Verificar que funciona

### Opción A: Ver en cron-job.org
1. En tu dashboard de cron-job.org
2. Espera 5 minutos
3. Verás el **"Last execution"** con estado verde ✅

### Opción B: Ver logs en Vercel
1. Ve a tu proyecto en Vercel
2. Click en **Deployments**
3. Click en tu deployment actual
4. Ve a **Functions**
5. Busca `/api/cron/check-leaks`
6. Verás los logs cada 5 minutos:

```
✅ Cron Job iniciado...
👥 X usuarios con notificaciones habilitadas
🔍 Usuario test123: Presostato=0, YSF=0L, Fuga=false
✅ No hay fugas detectadas. Todo normal.
```

### Opción C: Probar manualmente ahora mismo

Abre PowerShell y ejecuta:

```powershell
Invoke-RestMethod -Uri "https://aquaflux.vercel.app/api/cron/check-leaks" -Method POST -Headers @{"Authorization"="Bearer AquaFluxSecretKey2025SuperSeguro"} | ConvertTo-Json -Depth 10
```

Deberías ver algo como:

```json
{
  "status": 200,
  "message": "Cron job ejecutado exitosamente",
  "data": {
    "usersChecked": 1,
    "usersWithLeaks": 0,
    "notificationsSent": 0,
    "tokensCleanedUp": 0,
    "timestamp": "2025-11-09T..."
  }
}
```

---

## 🔔 Paso 5: Probar notificaciones push

### 5.1 Registrar un FCM token de prueba

```powershell
# 1. Hacer login
$response = Invoke-RestMethod -Uri "https://aquaflux.vercel.app/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"test123","password":"Test123!"}'
$token = $response.data.token

# 2. Registrar un FCM token de prueba
Invoke-RestMethod -Uri "https://aquaflux.vercel.app/api/users/fcm-token" -Method PUT -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} -Body '{"fcm_token":"test_token_12345"}'
```

### 5.2 Espera 5 minutos

El cron job se ejecutará automáticamente y:
- ✅ Checará si hay fugas
- ✅ Si detecta fuga (presostato=1 y litros>0), enviará notificación
- ✅ Verás en los logs de Vercel

---

## 🎛️ Configuraciones Avanzadas

### Cambiar frecuencia:

En cron-job.org puedes cambiar a:
- **Cada 1 minuto**: `* * * * *`
- **Cada 5 minutos**: `*/5 * * * *` ← Recomendado
- **Cada 10 minutos**: `*/10 * * * *`
- **Cada 30 minutos**: `*/30 * * * *`
- **Cada hora**: `0 * * * *`

### Pausar temporalmente:
1. Ve a cron-job.org
2. Click en tu cron job
3. Toggle **"Enabled"** a OFF

### Ver historial de ejecuciones:
1. En cron-job.org
2. Click en tu cron job
3. Ve a **"Execution history"**
4. Verás todas las ejecuciones con timestamps

---

## 🔧 Troubleshooting

### ❌ Error 401 Unauthorized
**Causa**: El secreto no coincide

**Solución**:
1. Verifica que `CRON_SECRET` en Vercel sea exactamente: `AquaFluxSecretKey2025SuperSeguro`
2. Verifica que el header en cron-job.org sea: `Authorization: Bearer AquaFluxSecretKey2025SuperSeguro`
3. Redeploy en Vercel después de cambiar la variable

### ❌ Error 500 Internal Server Error
**Causa**: Problema con Firebase Admin o Base de Datos

**Solución**:
1. Ve a logs de Vercel (Functions)
2. Busca el error específico
3. Verifica que `FIREBASE_PRIVATE_KEY`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` estén configuradas
4. Verifica conexión a PostgreSQL

### ❌ No se envían notificaciones
**Causa**: No hay usuarios con `fcm_token` registrado O no hay fugas detectadas

**Solución**:
1. Verifica en logs: `"usersChecked": 0` significa que no hay usuarios con tokens
2. Registra un token FCM desde la app móvil
3. Verifica que la lógica detecte fugas: `presostato=1 Y litros>0`

---

## 📊 Límites de cron-job.org (Plan Gratis)

✅ **5 cron jobs** gratis
✅ **Ejecuciones ilimitadas**
✅ **Mínimo cada 1 minuto**
✅ **Historial de 30 días**
✅ **Sin tarjeta de crédito**

---

## 🚀 ¡Listo!

Ahora tienes un sistema completamente automatizado que:
1. ⏰ Se ejecuta cada 5 minutos automáticamente
2. 🔍 Checa si hay fugas en Adafruit IO
3. 🔔 Envía notificaciones push a usuarios afectados
4. 🧹 Limpia tokens inválidos automáticamente
5. 💰 **TODO GRATIS**

¿Necesitas ayuda? Revisa los logs en:
- 🌐 cron-job.org → Execution history
- ☁️ Vercel → Deployments → Functions → `/api/cron/check-leaks`
