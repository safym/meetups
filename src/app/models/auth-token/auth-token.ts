import { Role } from "../role/role.interface";
import { IAuthToken } from "./auth-token.interface";

export class AuthToken implements IAuthToken {
  id: number;
  iat: number;
  exp: number;
  email: string;
  roles: Role[];

  constructor({ id, iat, exp, email, roles }: IAuthToken) {
    this.id = id;
    this.iat = iat;
    this.exp = exp;
    this.email = email;
    this.roles = roles;
  }
}
