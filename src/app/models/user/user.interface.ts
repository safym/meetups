import { Role } from '../role/role.interface';

export interface IUser {
  id: number;
  email: string;
  password: string;
  fio: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}
