import { UserModel } from '../../models/user.model';
import { UserRepository } from '../../../infra/repositories/user/user.repository';

export class IsAuthenticatedUseCase {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(username: string): Promise<UserModel> {
    const user: UserModel = await this.adminUserRepo.getUserByUsername(
      username,
    );
    return user;
  }
}
