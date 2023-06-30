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
