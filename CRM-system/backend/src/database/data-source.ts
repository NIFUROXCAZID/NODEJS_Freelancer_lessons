import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';

const useSsl = process.env.DB_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 3306),

  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User, Project, Task],

  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,

  ssl: useSsl
    ? {
        rejectUnauthorized: false,
      }
    : undefined,
});
