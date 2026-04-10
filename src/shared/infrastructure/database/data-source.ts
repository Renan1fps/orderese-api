import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'orderease',
  password: process.env.DB_PASSWORD ?? 'orderease',
  database: process.env.DB_DATABASE ?? 'orderease',
  entities: ['src/modules/**/infrastructure/persistence/*.orm-entity.ts'],
  migrations: ['src/shared/infrastructure/database/migrations/*.ts'],
  synchronize: false,
});
