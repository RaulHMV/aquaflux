// ==========================================
// USER MODEL - SEQUELIZE
// ==========================================

import { DataTypes, Model, CreationOptional, InferCreationAttributes } from 'sequelize';
import { getSequelizeInstance } from '@/lib/config/database';
import { UserAttributes } from '@/lib/types/users.types';

class Users extends Model<UserAttributes, InferCreationAttributes<Users>> implements UserAttributes {
  declare id_user: CreationOptional<number>;
  declare username: string;
  declare first_name: string;
  declare password_hash: string;
  declare fcm_token: CreationOptional<string | null>;
  declare created_at: CreationOptional<string>;
  declare updated_at: CreationOptional<string>;
  declare is_active: CreationOptional<boolean>;
}

Users.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fcm_token: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.STRING,
    },
    updated_at: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  },
  {
    sequelize: getSequelizeInstance(),
    modelName: 'Users',
    tableName: 'users',
    timestamps: false,
  }
);

export default Users;
