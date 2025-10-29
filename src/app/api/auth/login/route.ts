// ==========================================
// API ROUTE: /api/auth/login
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/controllers/users.controller';
import { userLoginSchema } from '@/lib/validations/users.validation';
import {
  DEFAULT_INTERNAL_ERROR,
  NO_USER_PAYLOAD,
  VALIDATION_ERROR
} from '@/lib/constants/errors/errors.constants';
import { SUCCESS_JSON_RESPONSE, ERROR_JSON_RESPONSE } from '@/lib/constants/responses/responses.constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(400, NO_USER_PAYLOAD, null),
        { status: 400 }
      );
    }

    // Validate with Zod
    const validation = userLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(400, VALIDATION_ERROR(validation.error.message), validation.error.errors),
        { status: 400 }
      );
    }

    const userLoginPayload = {
      username: body.username,
      password: body.password
    };

    const result = await loginUser(userLoginPayload);

    if (result instanceof Error) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(401, result.message, null),
        { status: 401 }
      );
    }

    const { user, token } = result;

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(200, 'Login successful', { user, token }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Error during login:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, err.message),
      { status: 500 }
    );
  }
}
