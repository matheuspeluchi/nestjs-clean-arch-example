import { Usecase } from '../../interfaces/useCase.interface';
import { LogoutDTO } from '../dto/logout.dto';

export class LogoutUseCase extends Usecase<LogoutDTO> {
  async execute() {
    return {
      authorization: '; HttpOnly; Path=/; Max-Age=0',
      refresh: '; HttpOnly; Path=/; Max-Age=0',
    };
  }
}
