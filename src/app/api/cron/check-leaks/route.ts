// ==========================================
// API ROUTE: /api/cron/check-leaks
// Endpoint protegido para Cron Job - Verifica fugas y envía notificaciones
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Users from '@/lib/models/Users.model';
import { getDashboardData } from '@/lib/controllers/feeds.controller';
import { sendBatchNotifications, cleanupInvalidTokens } from '@/lib/services/notifications.service';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

// CRON_SECRET debe estar en las variables de entorno
const CRON_SECRET = process.env.CRON_SECRET || 'your-super-secret-cron-key';

export async function POST(req: NextRequest) {
  try {
    // 1. PROTECCIÓN: Verificar autorización del Cron Job
    const authHeader = req.headers.get('authorization');
    const expectedAuth = `Bearer ${CRON_SECRET}`;

    if (!authHeader || authHeader !== expectedAuth) {
      console.log('🚫 Intento de acceso no autorizado al Cron Job');
      return NextResponse.json(
        ERROR_JSON_RESPONSE(401, 'Unauthorized: Invalid cron secret', null),
        { status: 401 }
      );
    }

    console.log('✅ Cron Job iniciado...');

    // 2. CONSULTA: Obtener usuarios con FCM token
    const usersWithTokens = await Users.findAll({
      where: {
        fcm_token: {
          [require('sequelize').Op.ne]: null, // fcm_token IS NOT NULL
        },
        is_active: true,
      },
      attributes: ['id_user', 'username', 'first_name', 'fcm_token'],
    });

    console.log(`👥 ${usersWithTokens.length} usuarios con notificaciones habilitadas`);

    if (usersWithTokens.length === 0) {
      return NextResponse.json(
        SUCCESS_JSON_RESPONSE(200, 'No hay usuarios con tokens FCM registrados', {
          usersChecked: 0,
          notificationsSent: 0,
        }),
        { status: 200 }
      );
    }

    // 3. ITERACIÓN: Revisar sensores y aplicar lógica de negocio
    const tokensToNotify: string[] = [];
    let usersWithLeaks = 0;

    for (const user of usersWithTokens) {
      try {
        // Obtener datos de los sensores para este usuario
        const sensorData = await getDashboardData();

        // LÓGICA DE NEGOCIO: Determinar si hay fuga
        const presostato = sensorData.leakDetector?.hasLeak ? 1 : 0;
        const ysf = sensorData.waterFlow?.liters || 0;
        const hasFugaDetectada = presostato === 1 && ysf > 0.0;

        console.log(
          `🔍 Usuario ${user.username}: Presostato=${presostato}, YSF=${ysf}L, Fuga=${hasFugaDetectada}`
        );

        // Si hay fuga detectada, agregar el token a la lista
        if (hasFugaDetectada && user.fcm_token) {
          tokensToNotify.push(user.fcm_token);
          usersWithLeaks++;
          console.log(`⚠️  Fuga detectada para usuario ${user.username}`);
        }
      } catch (error: any) {
        console.error(`❌ Error obteniendo datos para usuario ${user.username}:`, error.message);
        // Continuar con el siguiente usuario
        continue;
      }
    }

    console.log(`💧 Total de usuarios con fugas: ${usersWithLeaks}`);

    // 4. ENVÍO POR LOTES: Enviar notificaciones a todos los afectados
    let invalidTokens: string[] = [];
    let notificationsSent = 0;

    if (tokensToNotify.length > 0) {
      const notificationPayload = {
        title: '💧 AquaFlux - Fuga Detectada',
        body: `¡Atención! Se ha detectado una fuga de agua en tu sistema. Revisa tu app inmediatamente.`,
        data: {
          type: 'leak_alert',
          timestamp: new Date().toISOString(),
        },
      };

      invalidTokens = await sendBatchNotifications(tokensToNotify, notificationPayload);
      notificationsSent = tokensToNotify.length - invalidTokens.length;
    } else {
      console.log('✅ No hay fugas detectadas. Todo normal.');
    }

    // 5. LIMPIEZA: Eliminar tokens inválidos de la base de datos
    if (invalidTokens.length > 0) {
      await cleanupInvalidTokens(invalidTokens);
    }

    // Respuesta final
    const summary = {
      usersChecked: usersWithTokens.length,
      usersWithLeaks: usersWithLeaks,
      notificationsSent: notificationsSent,
      tokensCleanedUp: invalidTokens.length,
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Resumen del Cron Job:', summary);

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Cron job ejecutado exitosamente', summary),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error en Cron Job:', error);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, 'Internal server error', error.message),
      { status: 500 }
    );
  }
}
