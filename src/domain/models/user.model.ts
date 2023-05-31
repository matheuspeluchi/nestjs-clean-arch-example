export class UserModel {
  id: number;
  username: string;
  password: string;
  createdAT: Date;
  updatedAt: Date;
  lastLogin: Date;
  hashRefreshToken: string;
}
