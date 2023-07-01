import { Role } from '../role/role.interface';

export interface User {
  id?: number;
  email: string;
  password: string;
  fio: string;
}

export interface UserResponse extends User {
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface UserAuthToken extends UserResponse {
  id: number;
  iat: number;
  exp: number;
}
