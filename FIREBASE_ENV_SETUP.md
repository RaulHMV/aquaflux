# 🔥 Configurar Variables de Firebase en Vercel

## ⚠️ ERROR ACTUAL
```
Error 404 /batch - Firebase Admin no está inicializado
```

## 📋 Solución: Agregar Variables de Entorno

### Paso 1: Ve a Vercel
1. https://vercel.com/dashboard
2. Click en tu proyecto **aquaflux**
3. **Settings** → **Environment Variables**

### Paso 2: Agrega estas 3 variables

#### Variable 1: FIREBASE_PROJECT_ID
```
FIREBASE_PROJECT_ID
```
**Value:**
```
aquaflux-ec94e
```

#### Variable 2: FIREBASE_CLIENT_EMAIL
```
FIREBASE_CLIENT_EMAIL
```
**Value:**
```
firebase-adminsdk-fbsvc@aquaflux-ec94e.iam.gserviceaccount.com
```

#### Variable 3: FIREBASE_PRIVATE_KEY
```
FIREBASE_PRIVATE_KEY
```
**Value:** (copia TODO esto, SIN las comillas externas)
```
-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCcer8sY5VK6R6+\n6P4gWxNoAwMduc9uZPxltJGN7pxzw93oU+5PKGCZiv/9CbOE4HsvEg8YyQSjY/Um\nOPbvXFmbWawdmQ4lOQMbkojh7bQwdV3E9ijjFqj7swEmBo7lbIrfk9mqwIohs9j0\ngIFsIlXh4mw1beGEySnX1QasW27EZEXVAAOb5SvUV9NNniec7VbLebck5LLrSKw2\njEfLWAKZInKEivQ2GJn+kPGqtlwXBF1bMCpFieU3S3cynMAJKHOrqFiu8Yh7I56Y\niarFi0nVAf6glgoRgVGbs3tlo3y9PvmYcVg9Cz7/Ug0LCMzzqUWvmRIxMETxPSsJ\n2LgWYeotAgMBAAECggEAFdg46fx48f07UpF6MJAmVGXfQH4ZDCNC7PvZOgQuiSa1\nyuI0qY5MdgLmm6+IBSvFZpvRybb+U8T3iz92kZHF3J8XHQap595epbG+NDQX7I/l\n6EIpERKvwnuJ1IIj3rlZZb7hKyo33l6aEgACkVL1xFP0oTzWt8/RbJULmnIlM3tI\nDDghOG5KbGD8QnKXyh1teE3BfJpW8M3VcssRVhm21pTBIOowa2pvyFa6vpNTW7lh\n08xBd8iZ8a0ppr8NfqPKpYipm9sMNzUcuny7j4hAeH5pLzm457XqtdF+Kmg9WALT\nWeLT8PfwyNUBV2b3beiPA0xf4c4SNA7RoUleA+ZorQKBgQDYJ7QBXBvn38AWWDUc\ntGHvmwKoyJ6xaWIFMl0j7UrMstWWgUcDe3f30wZyYVfj4w2MXj8sEx6aL7ZZLP/w\ny3KsrGvWrorzYEqGE1whXk90YpYRySdQGrmlfAgQmN2dWLlm3dfByofZ9NXh+PHt\n8Opvgg6R4ebeg4HywsfbpjL5AwKBgQC5Uvf4DF7UPFpird3UWmwFEReBk7WGFA2Y\nXViFSxCgP3WxLsuVdyQOPWDxW3+2izBUjPVSlk9gHqLRosNjjM4Ol4BbtXLdO7d9\n/cOSEeyecWrmG7WSN/QCwstYHHrj1axJ/GD1ZKp2nphspa56XageO8XJz7GaFA0L\nrDCjqClxDwKBgH+lwqli6Z/fBKKtaIARDhzfX4ypHP4MC7Sh71r+EMQdgACnS3aE\n/W2+kvoM/kg3l5KjPY8bo2DOeFLlPifHHWtXTz+yR6A95wSSfj++YBGM/q52Kd8m\nSSeuvVx/ya/X63UR4Q4yOlO+QGh4CPbI5MkA9vWzgBE7fAwOdtQBq+xdAoGAQvnW\nPiISX3eUXtdhNS6cnVQo/55nWxaCN098/2c6kf99RFSaJOFS+YZ7M58Sz+ELzXLH\n8ln6Q82uoD7HiIHJsoJUVFCGO6gqT3FXrcGmlzh8Hr9i5n4sRJcrsCNS0mZVhsOc\nMvN3m7kDcziJjxWr/YkymRXjpMCcWlyXk33hxEcCgYB/P7zXJ0qwByOKON41SGHm\ncY3zGRveNTrW5D+038QytFwYQfB74liyUlXPODwb85CQnO31OpDnxYbADWKvcNcY\nehvqN4rT2wBQwCj+OVM/mB4ofwIWUiNpGdPtHiTeNPcQZQ+UoCji45Abh9//IAFe\nDIfJvBc131a0p09mskk7qQ==\n-----END PRIVATE KEY-----
```

⚠️ **MUY IMPORTANTE:** 
- **NO pongas comillas `"` al inicio ni al final** (Vercel las agrega automáticamente)
- Los `\n` SÍ son necesarios para los saltos de línea
- Debe empezar con `-----BEGIN` y terminar con `-----`
- Copia EXACTAMENTE como está arriba (sin las comillas)

### Paso 3: Verificar que se agregaron correctamente

Deberías tener estas 4 variables en Vercel:
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_CLIENT_EMAIL`
- ✅ `FIREBASE_PRIVATE_KEY`
- ✅ `CRON_SECRET` (ya la tenías)
- ✅ Todas las de PostgreSQL (ya las tenías)
- ✅ Todas las de JWT y Adafruit (ya las tenías)

### Paso 4: Redeploy

1. Ve a **Deployments**
2. Click en el último deployment
3. Click en los **3 puntos** (⋮)
4. **Redeploy**
5. Espera 1-2 minutos

### Paso 5: Probar

```powershell
Invoke-RestMethod -Uri "https://aquaflux.vercel.app/api/cron/check-leaks" -Method POST -Headers @{"Authorization"="Bearer AquaFluxSecretKey2025SuperSeguro"}
```

Deberías ver:
```json
{
  "status": 200,
  "message": "Cron job ejecutado exitosamente",
  "data": {
    "usersChecked": 0,
    "usersWithLeaks": 0,
    "notificationsSent": 0
  }
}
```

---

## 🔧 Si sigue sin funcionar

Revisa los logs en Vercel:
1. Ve a **Deployments** → Tu último deployment
2. Click en **Functions**
3. Busca `/api/cron/check-leaks`
4. Verás el log que dice:
   - ✅ `✅ Firebase Admin inicializado correctamente`
   - ❌ `❌ Firebase credentials not configured`

Si dice ❌, significa que las variables no están bien configuradas.

---

## 📸 Screenshot de cómo se ve en Vercel

Tu pantalla de Environment Variables debería verse así:

```
FIREBASE_PROJECT_ID          aquaflux-ec94e
FIREBASE_CLIENT_EMAIL        firebase-adminsdk-fbsvc@aquaflux...
FIREBASE_PRIVATE_KEY         "-----BEGIN PRIVATE KEY-----\nMII...
CRON_SECRET                  AquaFluxSecretKey2025SuperSeguro
PGHOST                       ep-nameless-tooth-ahz4y7rj-pooler...
PGDATABASE                   neondb
... (resto de tus variables)
```

---

¡Después del redeploy debería funcionar perfectamente! 🚀
