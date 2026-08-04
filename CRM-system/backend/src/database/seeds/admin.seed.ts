import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';

async function seedAdmin(): Promise<void> {
  try {
    await AppDataSource.initialize();

    console.log('Database connection established');

    const usersRepository = AppDataSource.getRepository(User);

    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const firstName = process.env.SEED_ADMIN_FIRST_NAME;
    const lastName = process.env.SEED_ADMIN_LAST_NAME;

    if (!email || !password || !firstName || !lastName) {
      throw new Error('Seed admin variables are missing in the .env file');
    }

    const existingAdmin = await usersRepository.findOne({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = usersRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await usersRepository.save(admin);

    console.log(`Admin ${email} successfully created`);
  } catch (error) {
    console.error('Admin seed failed:', error);

    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();

      console.log('Database connection closed');
    }
  }
}

void seedAdmin();
