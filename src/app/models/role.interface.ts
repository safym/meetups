export interface Role {
  id: number;
  name: 'ADMIN' | 'USER';
}

export interface RoleResponse extends Role {
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
