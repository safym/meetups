import { WithNull } from 'src/app/utils/withNull.type';
import { Role, RoleResponse } from '../role/role.interface';

export interface User {
  email: string;
  password: string;
}

export interface UserResponse extends User {
  id: number;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  fio: string;
}

export interface UserAuthToken extends UserResponse {
  id: number;
  iat: number;
  exp: number;
}

export interface UserForm extends User {
  role: RoleResponse;
}

export type UserFormNullable = WithNull<UserForm>;
