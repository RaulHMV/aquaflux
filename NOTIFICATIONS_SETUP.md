# 🔔 Sistema de Notificaciones Push - AquaFlux

## 📋 Configuración en Vercel

### 1. Variables de Entorno

Agrega estas variables en tu proyecto de Vercel (Settings → Environment Variables):

```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=aquaflux-ec94e
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@aquaflux-ec94e.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCcer8sY5VK6R6+\n6P4gWxNoAwMduc9uZPxltJGN7pxzw93oU+5PKGCZiv/9CbOE4HsvEg8YyQSjY/Um\nOPbvXFmbWawdmQ4lOQMbkojh7bQwdV3E9ijjFqj7swEmBo7lbIrfk9mqwIohs9j0\ngIFsIlXh4mw1beGEySnX1QasW27EZEXVAAOb5SvUV9NNniec7VbLebck5LLrSKw2\njEfLWAKZInKEivQ2GJn+kPGqtlwXBF1bMCpFieU3S3cynMAJKHOrqFiu8Yh7I56Y\niarFi0nVAf6glgoRgVGbs3tlo3y9PvmYcVg9Cz7/Ug0LCMzzqUWvmRIxMETxPSsJ\n2LgWYeotAgMBAAECggEAFdg46fx48f07UpF6MJAmVGXfQH4ZDCNC7PvZOgQuiSa1\nyuI0qY5MdgLmm6+IBSvFZpvRybb+U8T3iz92kZHF3J8XHQap595epbG+NDQX7I/l\n6EIpERKvwnuJ1IIj3rlZZb7hKyo33l6aEgACkVL1xFP0oTzWt8/RbJULmnIlM3tI\nDDghOG5KbGD8QnKXyh1teE3BfJpW8M3VcssRVhm21pTBIOowa2pvyFa6vpNTW7lh\n08xBd8iZ8a0ppr8NfqPKpYipm9sMNzUcuny7j4hAeH5pLzm457XqtdF+Kmg9WALT\nWeLT8PfwyNUBV2b3beiPA0xf4c4SNA7RoUleA+ZorQKBgQDYJ7QBXBvn38AWWDUc\ntGHvmwKoyJ6xaWIFMl0j7UrMstWWgUcDe3f30wZyYVfj4w2MXj8sEx6aL7ZZLP/w\ny3KsrGvWrorzYEqGE1whXk90YpYRySdQGrmlfAgQmN2dWLlm3dfByofZ9NXh+PHt\n8Opvgg6R4ebeg4HywsfbpjL5AwKBgQC5Uvf4DF7UPFpird3UWmwFEReBk7WGFA2Y\nXViFSxCgP3WxLsuVdyQOPWDxW3+2izBUjPVSlk9gHqLRosNjjM4Ol4BbtXLdO7d9\n/cOSEeyecWrmG7WSN/QCwstYHHrj1axJ/GD1ZKp2nphspa56XageO8XJz7GaFA0L\nrDCjqClxDwKBgH+lwqli6Z/fBKKtaIARDhzfX4ypHP4MC7Sh71r+EMQdgACnS3aE\n/W2+kvoM/kg3l5KjPY8bo2DOeFLlPifHHWtXTz+yR6A95wSSfj++YBGM/q52Kd8m\nSSeuvVx/ya/X63UR4Q4yOlO+QGh4CPbI5MkA9vWzgBE7fAwOdtQBq+xdAoGAQvnW\nPiISX3eUXtdhNS6cnVQo/55nWxaCN098/2c6kf99RFSaJOFS+YZ7M58Sz+ELzXLH\n8ln6Q82uoD7HiIHJsoJUVFCGO6gqT3FXrcGmlzh8Hr9i5n4sRJcrsCNS0mZVhsOc\nMvN3m7kDcziJjxWr/YkymRXjpMCcWlyXk33hxEcCgYB/P7zXJ0qwByOKON41SGHm\ncY3zGRveNTrW5D+038QytFwYQfB74liyUlXPODwb85CQnO31OpDnxYbADWKvcNcY\nehvqN4rT2wBQwCj+OVM/mB4ofwIWUiNpGdPtHiTeNPcQZQ+UoCji45Abh9//IAFe\nDIfJvBc131a0p09mskk7qQ==\n-----END PRIVATE KEY-----\n"

# Cron Job Secret (genera uno seguro)
CRON_SECRET=tu-super-secreto-para-cron-12345
```

⚠️ **IMPORTANTE**: El `FIREBASE_PRIVATE_KEY` debe incluir los `\n` para los saltos de línea.

### 2. Migración de Base de Datos

Ejecuta esta SQL en tu base de datos PostgreSQL (Neon):

```sql
ALTER TABLE users ADD COLUMN fcm_token VARCHAR(500) NULL;
```

### 3. Cron Job Schedule

El cron está configurado en `vercel.json` para ejecutarse **cada 5 minutos**:

```json
"crons": [
  {
    "path": "/api/cron/check-leaks",
    "schedule": "*/5 * * * *"
  }
]
```

Puedes cambiar el schedule:
- `*/5 * * * *` - Cada 5 minutos
- `*/10 * * * *` - Cada 10 minutos
- `0 * * * *` - Cada hora
- `0 0 * * *` - Cada día a medianoche

## 📡 Endpoints de la API

### 1. Actualizar Token FCM (PUT)
```bash
PUT /api/users/fcm-token
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "fcm_token": "fcm_token_del_dispositivo_movil"
}
```

### 2. Eliminar Token FCM (DELETE)
```bash
DELETE /api/users/fcm-token
Authorization: Bearer <JWT_TOKEN>
```

### 3. Cron Job Manual (POST)
```bash
POST /api/cron/check-leaks
Authorization: Bearer <CRON_SECRET>
```

## 🔄 Flujo del Sistema

1. **Usuario abre la app móvil**
   - La app obtiene el FCM token de Firebase
   - Envía PUT a `/api/users/fcm-token` con el token

2. **Cron Job se ejecuta cada 5 minutos**
   - Consulta usuarios con `fcm_token` registrado
   - Para cada usuario, obtiene datos de Adafruit IO
   - Aplica lógica: `(presostato === 1 && yfs > 0.0)`
   - Si hay fuga, agrega token a lista

3. **Envío de notificaciones**
   - Usa `sendMulticast` para enviar en batch
   - Revisa respuestas de FCM
   - Limpia tokens inválidos de la BD

4. **Limpieza automática**
   - Si un token es `registration-token-not-registered`
   - Lo elimina automáticamente de la BD

## 🧪 Pruebas Locales

```powershell
# 1. Instalar dependencias
npm install firebase-admin

# 2. Iniciar servidor local
npm run dev

# 3. Probar actualización de token
$token = "tu_jwt_token_aqui"
Invoke-RestMethod -Uri "http://localhost:3000/api/users/fcm-token" -Method PUT -Headers @{"Authorization"="Bearer $token"; "Content-Type"="application/json"} -Body '{"fcm_token":"test_fcm_token_123"}'

# 4. Probar cron job manualmente
Invoke-RestMethod -Uri "http://localhost:3000/api/cron/check-leaks" -Method POST -Headers @{"Authorization"="Bearer tu-super-secreto-para-cron-12345"}
```

## 📊 Logs en Vercel

Ve a tu proyecto en Vercel → Functions → Ver logs del cron job:

```
✅ Cron Job iniciado...
👥 3 usuarios con notificaciones habilitadas
🔍 Usuario test123: Presostato=1, YSF=2.5L, Fuga=true
⚠️  Fuga detectada para usuario test123
💧 Total de usuarios con fugas: 1
📤 Enviando notificaciones a 1 dispositivos...
✅ 1 notificaciones enviadas exitosamente
```

## 🚀 Deploy

```bash
git add .
git commit -m "feat: add push notifications system with FCM"
git push origin main-nueva
```

Vercel desplegará automáticamente y activará el cron job.

## ⚙️ Lógica de Detección de Fugas

```typescript
const presostato = sensorData.leakDetector?.hasLeak ? 1 : 0;
const ysf = sensorData.waterFlow?.liters || 0;
const hasFugaDetectada = presostato === 1 && ysf > 0.0;
```

- **presostato = 1** → El presostato detectó agua
- **yfs > 0** → El sensor de flujo midió litros
- **Ambos = true** → ¡Hay fuga confirmada! 💧

## 🔧 Troubleshooting

**Error: Cannot find module 'firebase-admin'**
```bash
npm install firebase-admin
```

**Error: FIREBASE_PRIVATE_KEY not configured**
- Verifica que la variable esté en Vercel
- Asegúrate de que tenga los `\n` escapados

**Cron no se ejecuta**
- Verifica que tengas plan Pro en Vercel
- Revisa en Settings → Cron Jobs

**Tokens no se limpian**
- Revisa los logs del cron job
- Verifica la conexión a PostgreSQL
