// ==========================================
// USER CONTROLLER
// ==========================================

import Users from '@/lib/models/Users.model';
import { UserLoginPayload, UserPayload, UserWithToken } from '@/lib/types/users.types';
import { generateJWT } from '@/lib/utils/jwt.utils';
import {
  DEFAULT_INTERNAL_ERROR,
  FAILED_TO_GENERATE_TOKEN,
  NO_USER_FOUND,
  SERVER_ERROR,
  USER_ALREADY_EXISTS,
} from '@/lib/constants/errors/errors.constants';
import { hashPassword, comparePassword } from '@/lib/utils/bcrypt.utils';

export const createUser = async (userPayload: UserPayload): Promise<Users | Error> => {
  try {
    // Check if username already exists
    const existingUser = await Users.findOne({
      where: {
        username: userPayload.username
      }
    });

    if (existingUser) {
      return new Error(USER_ALREADY_EXISTS(userPayload.username));
    }

    // Hash password
    const hashedPassword = await hashPassword(userPayload.password);

    if (hashedPassword instanceof Error) {
      return hashedPassword;
    }

    // Create new user (only first_name, username, password)
    const newUser = {
      username: userPayload.username,
      first_name: userPayload.first_name,
      password_hash: hashedPassword
    };

    return await Users.create(newUser);
  } catch (error) {
    console.error(SERVER_ERROR(error));
    throw error;
  }
};

export const loginUser = async (userLoginPayload: UserLoginPayload): Promise<UserWithToken | Error> => {
  try {
    const user = await Users.findOne({
      where: {
        username: userLoginPayload.username,
      }
    });

    if (!user) {
      return new Error(NO_USER_FOUND);
    }

    const isPasswordValid = await comparePassword(userLoginPayload.password, user.password_hash);

    if (!isPasswordValid) {
      return new Error(NO_USER_FOUND);
    }

    const plainUser = user.toJSON();

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = plainUser;

    const token = generateJWT(userWithoutPassword);

    if (token instanceof Error) {
      return new Error(FAILED_TO_GENERATE_TOKEN);
    }

    return { 
      user: userWithoutPassword as any, 
      token 
    } as UserWithToken;
  } catch (error) {
    console.error(SERVER_ERROR(error));
    return new Error(DEFAULT_INTERNAL_ERROR);
  }
};
