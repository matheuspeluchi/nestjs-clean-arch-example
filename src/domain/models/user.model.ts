export class UserModel {
  id: number;
  username: string;
  createDate: Date;
  password: string;
  updatedDate: Date;
  lastLogin: Date;
  hashRefreshToken: string;
}
