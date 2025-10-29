// ==========================================
// FEEDS CONTROLLER
// ==========================================

import adafruitService from '@/lib/services/adafruit.service';
import { FeedPayload, CreateDataPayload } from '@/lib/types/feeds.types';
import { FEED_KEYS } from '@/lib/constants/feeds/feeds.constants';
import {
  FEED_NOT_FOUND,
  FEED_ALREADY_EXISTS,
  FEED_CREATION_FAILED,
  DATA_CREATION_FAILED,
  ADAFRUIT_IO_ERROR,
  ADAFRUIT_IO_UNAUTHORIZED,
  ADAFRUIT_IO_RATE_LIMIT,
  NO_DATA_AVAILABLE,
  SERVER_ERROR
} from '@/lib/constants/errors/errors.constants';

export const getAllFeeds = async () => {
  try {
    return await adafruitService.getAllFeeds();
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error(ADAFRUIT_IO_UNAUTHORIZED);
    }
    if (error.message.includes('429')) {
      throw new Error(ADAFRUIT_IO_RATE_LIMIT);
    }
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getFeed = async (feedKey: string) => {
  try {
    return await adafruitService.getFeed(feedKey);
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    if (error.message.includes('404')) {
      throw new Error(FEED_NOT_FOUND(feedKey));
    }
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error(ADAFRUIT_IO_UNAUTHORIZED);
    }
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getLastData = async (feedKey: string) => {
  try {
    const lastValue = await adafruitService.getLastValue(feedKey);
    if (!lastValue) {
      throw new Error(NO_DATA_AVAILABLE(feedKey));
    }
    return lastValue;
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    if (error.message.includes(NO_DATA_AVAILABLE(''))) {
      throw error;
    }
    if (error.message.includes('404')) {
      throw new Error(FEED_NOT_FOUND(feedKey));
    }
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getFeedData = async (feedKey: string, limit = 100, startTime?: string, endTime?: string) => {
  try {
    return await adafruitService.getFeedData(feedKey, limit, startTime, endTime);
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    if (error.message.includes('404')) {
      throw new Error(FEED_NOT_FOUND(feedKey));
    }
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getChartFeedData = async (feedKey: string, hours = 24) => {
  try {
    const chartData = await adafruitService.getChartData(feedKey, hours);
    
    return {
      feedKey,
      data: chartData,
      timeRange: `${hours} hours`,
      totalPoints: chartData.length
    };
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    if (error.message.includes('404')) {
      throw new Error(FEED_NOT_FOUND(feedKey));
    }
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

// ==========================================
// AQUAFLUX SPECIFIC CONTROLLERS
// ==========================================

export const getLeakStatus = async () => {
  try {
    return await adafruitService.getLeakStatus();
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getWaterFlowData = async () => {
  try {
    return await adafruitService.getWaterFlowData();
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getWaterFlowChartData = async (hours = 24) => {
  try {
    return await adafruitService.getWaterFlowChartData(hours);
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const getDashboardData = async () => {
  try {
    return await adafruitService.getDashboardData();
  } catch (error: any) {
    console.error(SERVER_ERROR(error));
    throw new Error(ADAFRUIT_IO_ERROR(error.message));
  }
};

export const checkAdafruitConnection = async () => {
  try {
    const isConnected = await adafruitService.testConnection();
    if (isConnected) {
      const feeds = await adafruitService.getAllFeeds();
      return {
        connected: true,
        username: process.env.ADAFRUIT_IO_USERNAME,
        feedCount: feeds.length,
        message: 'Conexión exitosa con Adafruit IO'
      };
    } else {
      return {
        connected: false,
        message: 'No se pudo conectar con Adafruit IO'
      };
    }
  } catch (error: any) {
    return {
      connected: false,
      error: error.message,
      message: 'Error al verificar la conexión con Adafruit IO'
    };
  }
};
