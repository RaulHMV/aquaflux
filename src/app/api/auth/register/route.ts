// ==========================================
// API ROUTE: /api/auth/register
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/controllers/users.controller';
import { userSchema } from '@/lib/validations/users.validation';
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
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(400, VALIDATION_ERROR(validation.error.message), validation.error.errors),
        { status: 400 }
      );
    }

    const userPayload = {
      username: body.username,
      first_name: body.first_name, // Solo primer nombre
      password: body.password
    };

    const newUser = await createUser(userPayload);

    if (newUser instanceof Error) {
      return NextResponse.json(
        ERROR_JSON_RESPONSE(403, newUser.message, null),
        { status: 403 }
      );
    }

    // Remove password from response
    const { password_hash, ...userResponse } = newUser.toJSON();

    return NextResponse.json(
      SUCCESS_JSON_RESPONSE(201, 'User created successfully', userResponse),
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating user:', err);
    return NextResponse.json(
      ERROR_JSON_RESPONSE(500, DEFAULT_INTERNAL_ERROR, err.message),
      { status: 500 }
    );
  }
}
