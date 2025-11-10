// ==========================================
// API ROUTE: /api/users/fcm-token
// Actualiza el token FCM de un usuario autenticado
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Users from '@/lib/models/Users.model';
import { validateAuth } from '@/lib/middleware/auth.middleware';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function PUT(req: NextRequest) {
  try {
    // Validar autenticación
    const user = validateAuth(req);

    if (user instanceof Error) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(401, user.message, null),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fcm_token } = body;

    if (!fcm_token || typeof fcm_token !== 'string') {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(400, 'FCM token is required', null),
        { status: 400 }
      );
    }

    // Actualizar el token en la base de datos
    const [updatedRows] = await Users.update(
      { fcm_token },
      {
        where: {
          id_user: user.id_user,
        },
      }
    );

    if (updatedRows === 0) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(404, 'User not found', null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'FCM token updated successfully', {
        id_user: user.id_user,
        fcm_token_updated: true,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating FCM token:', error);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, 'Internal server error', error.message),
      { status: 500 }
    );
  }
}

// DELETE: Eliminar el token FCM (cuando el usuario cierra sesión o desactiva notificaciones)
export async function DELETE(req: NextRequest) {
  try {
    // Validar autenticación
    const user = validateAuth(req);

    if (user instanceof Error) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(401, user.message, null),
        { status: 401 }
      );
    }

    // Eliminar el token en la base de datos
    const [updatedRows] = await Users.update(
      { fcm_token: null },
      {
        where: {
          id_user: user.id_user,
        },
      }
    );

    if (updatedRows === 0) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(404, 'User not found', null),
        { status: 404 }
      );
    }

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'FCM token removed successfully', {
        id_user: user.id_user,
        fcm_token_removed: true,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error removing FCM token:', error);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, 'Internal server error', error.message),
      { status: 500 }
    );
  }
}
