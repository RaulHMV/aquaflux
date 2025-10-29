// ==========================================
// FEED KEYS FOR AQUAFLUX IOT PROJECT
// ==========================================
// Usuario Adafruit: victroyano

export const FEED_KEYS = {
  WATER_FLOW: 'mandujano.yf-s201',      // Sensor de flujo - litros fugados
  LEAK_DETECTOR: 'mandujano.presostato' // Detector de fugas - 0 o 1
} as const;

export const FEED_CONFIG = {
  [FEED_KEYS.WATER_FLOW]: {
    name: 'Sensor de Flujo YF-S201',
    description: 'Litros de agua fugados detectados por el sensor de flujo',
    unit: 'L'
  },
  [FEED_KEYS.LEAK_DETECTOR]: {
    name: 'Presostato - Detector de Fugas',
    description: 'Detector de fugas: 1 = fuga detectada, 0 = sin fugas',
    unit: 'bool'
  }
} as const;

export type FeedKey = typeof FEED_KEYS[keyof typeof FEED_KEYS];
