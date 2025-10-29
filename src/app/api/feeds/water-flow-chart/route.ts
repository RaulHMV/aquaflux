// ==========================================
// API ROUTE: /api/feeds/water-flow-chart
// Obtiene datos de gráfica del sensor de flujo de agua
// ==========================================

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getWaterFlowChartData } from '@/lib/controllers/feeds.controller';
import { DEFAULT_INTERNAL_ERROR } from '@/lib/constants/errors/errors.constants';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hours = searchParams.get('hours');
    const hoursNum = hours ? parseInt(hours, 10) : 24;

    if (isNaN(hoursNum) || hoursNum < 1 || hoursNum > 720) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(400, 'Hours must be a number between 1 and 720 (30 days)', null),
        { status: 400 }
      );
    }

    const chartData = await getWaterFlowChartData(hoursNum);

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Water flow chart data fetched successfully', chartData),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error fetching water flow chart data:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, err.message || DEFAULT_INTERNAL_ERROR, null),
      { status: 500 }
    );
  }
}
