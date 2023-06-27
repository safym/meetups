export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  UserRole: {
    id: number;
    roleId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IUser {
  id: number;
  iat: number;
  exp: number;
  email: string;
  roles: Role[];
}
