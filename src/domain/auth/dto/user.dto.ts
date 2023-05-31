export interface UserDTO {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  hashRefreshToken: string;
}
