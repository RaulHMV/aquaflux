// ==========================================
// JWT UTILITIES
// ==========================================

import jwt, { SignOptions } from 'jsonwebtoken';
import { UserAttributes } from '@/lib/types/users.types';
import {
  INVALID_TOKEN_FORMAT,
  JWT_SECRET_NOT_CONFIGURED,
  SERVER_ERROR
} from '@/lib/constants/errors/errors.constants';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_OPTIONS: SignOptions = { expiresIn: '1000h' }; // 1000 horas

export const generateJWT = (plainUser: Omit<UserAttributes, 'password_hash'>): string | Error => {
  if (!JWT_SECRET) {
    return new Error(JWT_SECRET_NOT_CONFIGURED);
  }

  try {
    return jwt.sign(plainUser, JWT_SECRET, JWT_OPTIONS);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
};

export const verifyJWT = (token: string): Omit<UserAttributes, 'password_hash'> | Error => {
  if (!JWT_SECRET) {
    return new Error(JWT_SECRET_NOT_CONFIGURED);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== 'object' || !decoded) {
      return new Error(INVALID_TOKEN_FORMAT);
    }
    return decoded as Omit<UserAttributes, 'password_hash'>;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(SERVER_ERROR(error));
  }
};
