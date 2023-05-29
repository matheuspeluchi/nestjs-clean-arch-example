import { UserModel } from '../models/user.model';

export abstract class UserRepository {
  abstract getUserByUsername(username: string): Promise<UserModel>;
  abstract updateLastLogin(username: string): Promise<void>;
  abstract updateRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<void>;
}
