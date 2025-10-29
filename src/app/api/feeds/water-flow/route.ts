// ==========================================
// API ROUTE: /api/feeds/water-flow
// Obtiene los litros de agua fugados (sensor YF-S201)
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { getWaterFlowData } from '@/lib/controllers/feeds.controller';
import { DEFAULT_INTERNAL_ERROR } from '@/lib/constants/errors/errors.constants';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function GET(req: NextRequest) {
  try {
    const waterFlowData = await getWaterFlowData();

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Water flow data fetched successfully', waterFlowData),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error fetching water flow data:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, err.message || DEFAULT_INTERNAL_ERROR, null),
      { status: 500 }
    );
  }
}
