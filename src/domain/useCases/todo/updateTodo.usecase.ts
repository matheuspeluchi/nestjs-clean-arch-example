import { ILogger } from '../../../infra/logger/logger.interface';
import { ITodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';

export class updateTodoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(id: number, isDone: boolean): Promise<void> {
    await this.todoRepository.updateContent(id, isDone);
    this.logger.log(
      'updateTodoUseCases execute',
      `Todo ${id} have been updated`,
    );
  }
}
