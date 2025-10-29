// ==========================================
// ZOD VALIDATION SCHEMAS - FEEDS
// ==========================================

import { z } from 'zod';
import { FEED_KEYS } from '@/lib/constants/feeds/feeds.constants';

const allowedFeedKeys = Object.values(FEED_KEYS);

export const feedKeySchema = z.string()
  .refine(
    (val) => allowedFeedKeys.includes(val as any),
    {
      message: `Feed key must be one of: ${allowedFeedKeys.join(', ')}`
    }
  );

export const feedSchema = z.object({
  name: z.string()
    .min(1, 'Feed name cannot be empty')
    .max(100, 'Feed name cannot be longer than 100 characters'),
  key: feedKeySchema,
  description: z.string()
    .max(500, 'Description cannot be longer than 500 characters')
    .optional(),
  unit: z.string()
    .max(20, 'Unit cannot be longer than 20 characters')
    .optional(),
  enabled: z.boolean()
    .optional()
    .default(true)
});

export const createDataSchema = z.object({
  value: z.union([z.number(), z.string().max(255)]),
  lat: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  lon: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
  ele: z.number().optional()
});

export type FeedSchemaType = z.infer<typeof feedSchema>;
export type CreateDataSchemaType = z.infer<typeof createDataSchema>;
export type FeedKeySchemaType = z.infer<typeof feedKeySchema>;
