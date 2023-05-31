import { UserModel } from '../../user/models/user.model';
import { UserRepository } from '../../../infra/repositories/user/user.repository';
import { Usecase } from '../../../infra/adapters/useCase.interface';
import { UserDTO } from '../dto/user.dto';

export class IsAuthenticatedUseCase extends Usecase<UserDTO> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(username: string): Promise<UserModel> {
    const user: UserModel = await this.userRepository.getUserByUsername(
      username,
    );
    return user;
  }
}
