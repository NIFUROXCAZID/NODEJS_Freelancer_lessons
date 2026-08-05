import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const useSsl = configService.get<string>('DB_SSL') === 'true';

        return {
          type: 'mysql' as const,

          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT') ?? 3306,

          username: configService.getOrThrow<string>('DB_USERNAME'),

          password: configService.getOrThrow<string>('DB_PASSWORD'),

          database: configService.getOrThrow<string>('DB_NAME'),

          autoLoadEntities: true,
          synchronize: false,

          ssl: useSsl
            ? {
                rejectUnauthorized: false,
              }
            : undefined,
        };
      },
    }),

    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
    DashboardModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
