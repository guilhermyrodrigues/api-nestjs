export type UserRole = 'READER' | 'WRITER' | 'ADMIN' | 'EDITOR';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
