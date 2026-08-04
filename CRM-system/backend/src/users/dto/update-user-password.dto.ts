import { IsString, MinLength } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString({
    message: 'Пароль повинен бути текстом',
  })
  @MinLength(6, {
    message: 'Пароль повинен містити щонайменше 6 символів',
  })
  password!: string;
}
