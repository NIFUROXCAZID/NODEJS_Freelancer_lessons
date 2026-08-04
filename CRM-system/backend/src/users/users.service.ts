import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { GetUsersDto, UserStatusFilter } from './dto/get-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.usersRepository.findOne({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new ConflictException('Користувач із таким email уже існує');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      firstName: createUserDto.firstName.trim(),
      lastName: createUserDto.lastName.trim(),
      email: normalizedEmail,
      passwordHash,
      role: createUserDto.role,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.toPublicUser(savedUser);
  }

  async findAll(queryDto: GetUsersDto) {
    const { page, limit, all, search, role, status } = queryDto;

    const query = this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.createdAt', 'DESC');

    if (search?.trim()) {
      query.andWhere(
        `(
        user.firstName LIKE :search
        OR user.lastName LIKE :search
        OR user.email LIKE :search
      )`,
        {
          search: `%${search.trim()}%`,
        },
      );
    }

    if (role) {
      query.andWhere('user.role = :role', {
        role,
      });
    }

    if (status === UserStatusFilter.ACTIVE) {
      query.andWhere('user.isActive = :isActive', {
        isActive: true,
      });
    }

    if (status === UserStatusFilter.INACTIVE) {
      query.andWhere('user.isActive = :isActive', {
        isActive: false,
      });
    }

    if (all) {
      const [users, total] = await query.getManyAndCount();

      return {
        data: users.map((user) => this.toPublicUser(user)),
        total,
        page: 1,
        limit: total,
        totalPages: 1,
      };
    }

    const [users, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: users.map((user) => this.toPublicUser(user)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByEmail(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findActiveById(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findOne(id: number) {
    const user = await this.findEntityOrFail(id);

    return this.toPublicUser(user);
  }

  async findActiveWorkers() {
    const workers = await this.usersRepository.find({
      where: {
        role: UserRole.WORKER,
        isActive: true,
      },
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });

    return workers.map((worker) => this.toPublicUser(worker));
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findEntityOrFail(id);

    if (updateUserDto.email !== undefined) {
      const normalizedEmail = updateUserDto.email.trim().toLowerCase();

      const userWithSameEmail = await this.usersRepository.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (userWithSameEmail && userWithSameEmail.id !== user.id) {
        throw new ConflictException('Користувач із таким email уже існує');
      }

      user.email = normalizedEmail;
    }

    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName.trim();
    }

    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName.trim();
    }

    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role;
    }

    const updatedUser = await this.usersRepository.save(user);

    return this.toPublicUser(updatedUser);
  }

  async updateStatus(id: number, isActive: boolean, currentUserId: number) {
    const user = await this.findEntityOrFail(id);

    if (id === currentUserId && isActive === false) {
      throw new ForbiddenException('Ви не можете заблокувати самого себе');
    }

    if (user.role === UserRole.ADMIN && isActive === false) {
      const activeAdminsCount = await this.usersRepository.count({
        where: {
          role: UserRole.ADMIN,
          isActive: true,
        },
      });

      if (activeAdminsCount <= 1) {
        throw new BadRequestException(
          'Не можна заблокувати останнього активного адміністратора',
        );
      }
    }

    user.isActive = isActive;

    const updatedUser = await this.usersRepository.save(user);

    return this.toPublicUser(updatedUser);
  }

  async updatePassword(
    id: number,
    password: string,
  ): Promise<{ message: string }> {
    const user = await this.findEntityOrFail(id);

    const passwordHash = await bcrypt.hash(password, 10);

    user.passwordHash = passwordHash;

    await this.usersRepository.save(user);

    return {
      message: 'Пароль користувача успішно змінено',
    };
  }

  private async findEntityOrFail(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Користувача з id ${id} не знайдено`);
    }

    return user;
  }

  async findEntityById(id: number) {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
