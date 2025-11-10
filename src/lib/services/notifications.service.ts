// ==========================================
// NOTIFICATIONS SERVICE - FIREBASE CLOUD MESSAGING
// ==========================================

import admin from '@/lib/config/firebase-admin';
import Users from '@/lib/models/Users.model';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
}

/**
 * Envía notificaciones a múltiples tokens usando sendMulticast
 * @param tokens Array de FCM tokens
 * @param notification Payload de la notificación
 * @returns Array de tokens inválidos que deben ser eliminados
 */
export const sendBatchNotifications = async (
  tokens: string[],
  notification: NotificationPayload
): Promise<string[]> => {
  if (tokens.length === 0) {
    console.log('📭 No hay tokens para enviar notificaciones');
    return [];
  }

  try {
    console.log(`📤 Enviando notificaciones a ${tokens.length} dispositivos...`);

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens: tokens,
    };

    const response = await admin.messaging().sendMulticast(message);

    console.log(`✅ ${response.successCount} notificaciones enviadas exitosamente`);
    console.log(`❌ ${response.failureCount} notificaciones fallaron`);

    // Identificar tokens inválidos
    const invalidTokens: string[] = [];

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errorCode = resp.error?.code;
          
          // Si el token está no registrado o es inválido, lo marcamos para eliminar
          if (
            errorCode === 'messaging/registration-token-not-registered' ||
            errorCode === 'messaging/invalid-registration-token'
          ) {
            invalidTokens.push(tokens[idx]);
            console.log(`🗑️  Token inválido detectado: ${tokens[idx].substring(0, 20)}...`);
          } else {
            console.error(`⚠️  Error enviando a token ${idx}:`, resp.error?.message);
          }
        }
      });
    }

    return invalidTokens;
  } catch (error: any) {
    console.error('❌ Error en sendBatchNotifications:', error);
    throw new Error(`Error enviando notificaciones: ${error.message}`);
  }
};

/**
 * Elimina tokens inválidos de la base de datos
 * @param invalidTokens Array de tokens que deben ser eliminados
 */
export const cleanupInvalidTokens = async (invalidTokens: string[]): Promise<void> => {
  if (invalidTokens.length === 0) {
    return;
  }

  try {
    console.log(`🧹 Limpiando ${invalidTokens.length} tokens inválidos de la base de datos...`);

    const result = await Users.update(
      { fcm_token: null },
      {
        where: {
          fcm_token: invalidTokens,
        },
      }
    );

    console.log(`✅ ${result[0]} tokens eliminados de la base de datos`);
  } catch (error: any) {
    console.error('❌ Error limpiando tokens inválidos:', error);
    throw new Error(`Error limpiando tokens: ${error.message}`);
  }
};

export default {
  sendBatchNotifications,
  cleanupInvalidTokens,
};
