import { IUser, Role } from "./user.interface";

export class User implements IUser {
  id: number;
  iat: number;
  exp: number;
  email: string;
  roles: Role[];

  constructor({ id, iat, exp, email, roles }: IUser) {
    this.id = id;
    this.iat = iat;
    this.exp = exp;
    this.email = email;
    this.roles = roles;
  }
}
