// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/utils/jwt.utils';
import { INVALID_TOKEN_FORMAT, UNAUTHORIZED } from '@/lib/constants/errors/errors.constants';

export interface AuthRequest extends NextRequest {
  user?: any;
}

export const authMiddleware = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: INVALID_TOKEN_FORMAT },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const validToken = verifyJWT(token);
    
    if (validToken instanceof Error) {
      return NextResponse.json(
        { error: validToken.message },
        { status: 401 }
      );
    }

    // Token is valid, return null to continue
    return null;
  } catch (err) {
    return NextResponse.json(
      { error: UNAUTHORIZED },
      { status: 401 }
    );
  }
};

// Helper function to validate auth in route handlers
export const validateAuth = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error(INVALID_TOKEN_FORMAT);
  }

  const token = authHeader.split(' ')[1];
  const validToken = verifyJWT(token);

  if (validToken instanceof Error) {
    throw new Error(validToken.message);
  }

  return validToken;
};
