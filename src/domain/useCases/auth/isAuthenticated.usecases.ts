import { UserModel } from '../../../infra/repositories/models/user.model';
import { UserRepository } from '../../../infra/repositories/user/userRepository.interface';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepository) {}

  async execute(username: string): Promise<UserModel> {
    const user: UserModel = await this.adminUserRepo.getUserByUsername(
      username,
    );
    return user;
  }
}
