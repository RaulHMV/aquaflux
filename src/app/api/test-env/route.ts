// ==========================================
// TEST ENDPOINT - Verificar Variables de Entorno
// ==========================================

import { NextResponse } from 'next/server';

export async function GET() {
  const envCheck = {
    hasAdafruitUsername: !!process.env.ADAFRUIT_IO_USERNAME,
    hasAdafruitKey: !!process.env.ADAFRUIT_IO_KEY,
    hasDBHost: !!process.env.PGHOST,
    hasJWTSecret: !!process.env.JWT_SECRET,
    
    // Solo para debug - NO expongas los valores reales en producción
    adafruitUsername: process.env.ADAFRUIT_IO_USERNAME || 'NOT SET',
    adafruitKeyPrefix: process.env.ADAFRUIT_IO_KEY?.substring(0, 10) || 'NOT SET',
    nodeEnv: process.env.NODE_ENV
  };

  return NextResponse.json({
    success: true,
    message: 'Environment Variables Check',
    data: envCheck
  });
}
