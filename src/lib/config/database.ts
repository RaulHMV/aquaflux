// ==========================================
// DATABASE CONFIGURATION - SEQUELIZE
// ==========================================

import { Sequelize, Dialect } from 'sequelize';

const credentials = {
  database: process.env.PGDATABASE || '',
  username: process.env.PGUSER || '',
  password: process.env.PGPASSWORD || '',
  options: {
    host: process.env.PGHOST || '',
    port: Number(process.env.PGPORT) || 5432,
    dialect: 'postgres' as Dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  },
};

let sequelizeInstance: Sequelize | null = null;

export const getSequelizeInstance = (): Sequelize => {
  if (!sequelizeInstance) {
    sequelizeInstance = new Sequelize(
      credentials.database,
      credentials.username,
      credentials.password,
      {
        host: credentials.options.host,
        port: credentials.options.port,
        dialect: credentials.options.dialect,
        dialectOptions: credentials.options.dialectOptions,
        logging: false, // Set to console.log to see SQL queries
      }
    );
  }
  return sequelizeInstance;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const sequelize = getSequelizeInstance();
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};
