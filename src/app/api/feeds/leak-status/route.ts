// ==========================================
// API ROUTE: /api/feeds/leak-status
// Obtiene el estado del detector de fugas (presostato)
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getLeakStatus } from '@/lib/controllers/feeds.controller';
import { DEFAULT_INTERNAL_ERROR } from '@/lib/constants/errors/errors.constants';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function GET(req: NextRequest) {
  try {
    const leakStatus = await getLeakStatus();

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Leak status fetched successfully', leakStatus),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error fetching leak status:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, err.message || DEFAULT_INTERNAL_ERROR, null),
      { status: 500 }
    );
  }
}
