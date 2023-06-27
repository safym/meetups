import { Role } from '../role/role.interface';
import { IUser } from './user.interface';

export class User implements IUser {
  id: number;
  email: string;
  password: string;
  fio: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];

  constructor({ id, email, password, fio }: IUser) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fio = fio;
  }

}
