import { ILogger } from '../../../infra/logger/logger.interface';
import { ITodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';

export class deleteTodoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
    this.logger.log(
      'deleteTodoUseCases execute',
      `Todo ${id} have been deleted`,
    );
  }
}
