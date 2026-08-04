import { UserRole } from '../../users/enums/user-role.enum';

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
};