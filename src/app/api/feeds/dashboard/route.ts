// ==========================================
// API ROUTE: /api/feeds/dashboard
// Obtiene todos los datos para el dashboard (leak + water flow)
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/controllers/feeds.controller';
import { validateAuth } from '@/lib/middleware/auth.middleware';
import { DEFAULT_INTERNAL_ERROR } from '@/lib/constants/errors/errors.constants';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function GET(req: NextRequest) {
  try {
    // Validar autenticación y obtener datos del usuario
    const user = validateAuth(req);

    if (user instanceof Error) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(401, user.message, null),
        { status: 401 }
      );
    }

    // Obtener datos de Adafruit IO
    const dashboardData = await getDashboardData();

    // Combinar datos del usuario + datos de sensores
    const response = {
      user: {
        id: user.id_user,
        username: user.username,
        first_name: user.first_name, // ← Aquí está el nombre para "Hola Victor"
        is_active: user.is_active
      },
      sensors: dashboardData
    };

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Dashboard data fetched successfully', response),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error fetching dashboard data:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, err.message || DEFAULT_INTERNAL_ERROR, null),
      { status: 500 }
    );
  }
}
