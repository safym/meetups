import { Role } from '../role/role.interface';

export interface IAuthToken {
  id: number;
  iat: number;
  exp: number;
  email: string;
  roles: Role[];
}
