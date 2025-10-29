// ==========================================
// API ROUTE: /api/feeds/connection
// Verifica la conexión con Adafruit IO
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { checkAdafruitConnection } from '@/lib/controllers/feeds.controller';
import { DEFAULT_INTERNAL_ERROR } from '@/lib/constants/errors/errors.constants';
import { ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function GET(req: NextRequest) {
  try {
    const result = await checkAdafruitConnection();
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('Error checking Adafruit connection:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, err.message),
      { status: 500 }
    );
  }
}
