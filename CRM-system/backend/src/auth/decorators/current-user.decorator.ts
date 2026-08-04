import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from '../types/auth-request.type';

export const CurrentUser = createParamDecorator(
  (field: keyof AuthRequest['user'] | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const user = request.user;

    if (field) {
      return user[field];
    }

    return user;
  },
);
