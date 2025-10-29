// ==========================================
// ZOD VALIDATION SCHEMAS - USERS
// ==========================================

import { z } from 'zod';

export const userSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username cannot be longer than 50 characters'),
  first_name: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name cannot be longer than 100 characters'),
  password: z.string()
    .min(4, 'Password must be at least 4 characters long')
    .max(255, 'Password cannot be longer than 255 characters'),
});

export const userLoginSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username cannot be longer than 50 characters'),
  password: z.string()
    .min(4, 'Password must be at least 4 characters long')
    .max(255, 'Password cannot be longer than 255 characters'),
});

export type UserSchemaType = z.infer<typeof userSchema>;
export type UserLoginSchemaType = z.infer<typeof userLoginSchema>;
