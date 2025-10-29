// ==========================================
// ADAFRUIT IO SERVICE
// ==========================================

import axios, { AxiosInstance } from 'axios';
import {
  AdafruitFeedResponse,
  AdafruitDataResponse,
  FeedPayload,
  CreateDataPayload,
  ChartDataPoint,
  LeakStatus,
  WaterFlowData
} from '@/lib/types/feeds.types';
import {
  ADAFRUIT_IO_ERROR,
  ADAFRUIT_IO_UNAUTHORIZED,
  ADAFRUIT_IO_RATE_LIMIT,
  FEED_NOT_FOUND,
  NO_DATA_AVAILABLE
} from '@/lib/constants/errors/errors.constants';
import { FEED_KEYS, FEED_CONFIG } from '@/lib/constants/feeds/feeds.constants';

class AdafruitIOService {
  private client: AxiosInstance;
  private baseUrl = 'https://io.adafruit.com/api/v2';
  private username: string;
  private key: string;

  constructor() {
    this.username = process.env.ADAFRUIT_IO_USERNAME || '';
    this.key = process.env.ADAFRUIT_IO_KEY || '';

    if (!this.username || !this.key) {
      throw new Error('Adafruit IO credentials not configured');
    }

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-AIO-Key': this.key,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    // Interceptor para manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.error || error.message;

          switch (status) {
            case 401:
            case 403:
              throw new Error(ADAFRUIT_IO_UNAUTHORIZED);
            case 429:
              throw new Error(ADAFRUIT_IO_RATE_LIMIT);
            case 404:
              throw new Error(FEED_NOT_FOUND(error.config.url || ''));
            default:
              throw new Error(ADAFRUIT_IO_ERROR(message));
          }
        }
        throw new Error(ADAFRUIT_IO_ERROR(error.message));
      }
    );
  }

  // ==========================================
  // FEED OPERATIONS
  // ==========================================

  async testConnection(): Promise<boolean> {
    try {
      await this.client.get(`/${this.username}/feeds`);
      return true;
    } catch (error) {
      console.error('❌ Adafruit IO connection test failed:', error);
      return false;
    }
  }

  async getAllFeeds(): Promise<AdafruitFeedResponse[]> {
    const response = await this.client.get(`/${this.username}/feeds`);
    return response.data;
  }

  async getFeed(feedKey: string): Promise<AdafruitFeedResponse> {
    const response = await this.client.get(`/${this.username}/feeds/${feedKey}`);
    return response.data;
  }

  async createFeed(feedPayload: FeedPayload): Promise<AdafruitFeedResponse> {
    const createData = {
      name: feedPayload.name,
      key: feedPayload.key,
      description: feedPayload.description || '',
      unit_type: feedPayload.unit || null,
      visibility: 'private',
      history: true,
      enabled: feedPayload.enabled !== false
    };

    const response = await this.client.post(`/${this.username}/feeds`, createData);
    return response.data;
  }

  async deleteFeed(feedKey: string): Promise<void> {
    await this.client.delete(`/${this.username}/feeds/${feedKey}`);
  }

  // ==========================================
  // DATA OPERATIONS
  // ==========================================

  async getLastValue(feedKey: string): Promise<AdafruitDataResponse | null> {
    try {
      console.log(`🔍 Fetching last value for feed: ${feedKey}`);
      const response = await this.client.get(`/${this.username}/feeds/${feedKey}/data/last`);
      console.log(`✅ Data obtained for ${feedKey}:`, response.data?.value);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error fetching data for ${feedKey}:`, error.message);
      if (error.response?.status === 404) {
        console.log(`⚠️  Feed ${feedKey} has no available data`);
        return null;
      }
      throw error;
    }
  }

  async getFeedData(
    feedKey: string,
    limit = 100,
    startTime?: string,
    endTime?: string
  ): Promise<AdafruitDataResponse[]> {
    const params: any = { limit };
    if (startTime) params.start_time = startTime;
    if (endTime) params.end_time = endTime;

    const response = await this.client.get(`/${this.username}/feeds/${feedKey}/data`, { params });
    return response.data;
  }

  async createData(feedKey: string, dataPayload: CreateDataPayload): Promise<AdafruitDataResponse> {
    const response = await this.client.post(`/${this.username}/feeds/${feedKey}/data`, dataPayload);
    return response.data;
  }

  // ==========================================
  // CHART DATA
  // ==========================================

  async getChartData(feedKey: string, hours = 24): Promise<ChartDataPoint[]> {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - (hours * 60 * 60 * 1000));

    const data = await this.getFeedData(
      feedKey,
      1000,
      startTime.toISOString(),
      endTime.toISOString()
    );

    return data
      .map(item => ({
        timestamp: item.created_at,
        value: parseFloat(item.value.toString()),
        formatted_time: new Date(item.created_at).toLocaleTimeString()
      }))
      .filter(item => !isNaN(item.value));
  }

  // ==========================================
  // AQUAFLUX SPECIFIC METHODS
  // ==========================================

  /**
   * Get leak detection status from mandujano.presostato feed
   * Returns: 1 = leak detected, 0 = no leak
   */
  async getLeakStatus(): Promise<LeakStatus> {
    try {
      const lastData = await this.getLastValue(FEED_KEYS.LEAK_DETECTOR);

      if (!lastData) {
        throw new Error(NO_DATA_AVAILABLE(FEED_KEYS.LEAK_DETECTOR));
      }

      const value = parseInt(lastData.value.toString());
      const hasLeak = value === 1;

      return {
        hasLeak,
        lastValue: value,
        timestamp: lastData.created_at,
        message: hasLeak ? 'Se detectaron fugas' : 'No hay fugas detectadas'
      };
    } catch (error: any) {
      console.error('Error getting leak status:', error);
      throw new Error(ADAFRUIT_IO_ERROR(error.message));
    }
  }

  /**
   * Get water flow data from mandujano.yf-s201 feed
   * Returns: liters of water leaked
   */
  async getWaterFlowData(): Promise<WaterFlowData> {
    try {
      const lastData = await this.getLastValue(FEED_KEYS.WATER_FLOW);

      if (!lastData) {
        throw new Error(NO_DATA_AVAILABLE(FEED_KEYS.WATER_FLOW));
      }

      const liters = parseFloat(lastData.value.toString());

      return {
        liters,
        timestamp: lastData.created_at,
        unit: 'L'
      };
    } catch (error: any) {
      console.error('Error getting water flow data:', error);
      throw new Error(ADAFRUIT_IO_ERROR(error.message));
    }
  }

  /**
   * Get chart data for water flow (last 24 hours by default)
   */
  async getWaterFlowChartData(hours = 24): Promise<ChartDataPoint[]> {
    try {
      return await this.getChartData(FEED_KEYS.WATER_FLOW, hours);
    } catch (error: any) {
      console.error('Error getting water flow chart data:', error);
      throw new Error(ADAFRUIT_IO_ERROR(error.message));
    }
  }

  /**
   * Get dashboard data (leak status + water flow)
   */
  async getDashboardData() {
    try {
      const [leakStatus, waterFlow] = await Promise.all([
        this.getLeakStatus(),
        this.getWaterFlowData()
      ]);

      return {
        leakDetector: leakStatus,
        waterFlow,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error getting dashboard data:', error);
      throw new Error(ADAFRUIT_IO_ERROR(error.message));
    }
  }
}

const adafruitIOService = new AdafruitIOService();
export default adafruitIOService;
