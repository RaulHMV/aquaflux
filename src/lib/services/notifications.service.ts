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
 * Envía notificaciones a múltiples tokens usando send individual
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

    const invalidTokens: string[] = [];
    let successCount = 0;
    let failureCount = 0;

    // Enviar a cada token individualmente
    for (const token of tokens) {
      try {
        const message = {
          notification: {
            title: notification.title,
            body: notification.body,
          },
          data: notification.data || {},
          token: token,
        };

        await admin.messaging().send(message);
        successCount++;
        console.log(`✅ Notificación enviada a token: ${token.substring(0, 20)}...`);
      } catch (error: any) {
        failureCount++;
        const errorCode = error.code;

        // Si el token está no registrado o es inválido, lo marcamos para eliminar
        if (
          errorCode === 'messaging/registration-token-not-registered' ||
          errorCode === 'messaging/invalid-registration-token' ||
          errorCode === 'messaging/invalid-argument'
        ) {
          invalidTokens.push(token);
          console.log(`🗑️  Token inválido detectado: ${token.substring(0, 20)}...`);
        } else {
          console.error(`⚠️  Error enviando a token ${token.substring(0, 20)}:`, error.message);
        }
      }
    }

    console.log(`✅ ${successCount} notificaciones enviadas exitosamente`);
    console.log(`❌ ${failureCount} notificaciones fallaron`);

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
