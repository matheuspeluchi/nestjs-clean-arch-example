import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../../infra/repositories/todo/todo.repository';
import { LoggerService } from '../../../infra/logger/logger.service';
import { Usecase } from '../../../infra/adapters/useCase.interface';
@Injectable()
export class DeleteTodoUseCases extends Usecase<void> {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {
    super();
  }

  async execute(id: number) {
    await this.todoRepository.deleteById(id);
    this.logger.log(
      'deleteTodoUseCases execute',
      `Todo ${id} have been deleted`,
    );
  }
}
