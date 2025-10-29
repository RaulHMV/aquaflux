// ==========================================
// API ROUTE: /api/feeds/dashboard
// Obtiene todos los datos para el dashboard (leak + water flow)
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/controllers/feeds.controller';
import { DEFAULT_INTERNAL_ERROR } from '@/lib/constants/errors/errors.constants';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function GET(req: NextRequest) {
  try {
    const dashboardData = await getDashboardData();

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Dashboard data fetched successfully', dashboardData),
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
