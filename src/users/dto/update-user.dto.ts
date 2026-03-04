import { UserRole } from './create-user.dto';

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
