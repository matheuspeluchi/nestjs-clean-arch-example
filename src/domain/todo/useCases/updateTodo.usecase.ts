import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../../infra/repositories/todo/todo.repository';
import { LoggerService } from '../../../infra/logger/logger.service';
import { Usecase } from '../../../infra/adapters/useCase.interface';
import { TodoDTO } from '../dto/Todo.dto';
@Injectable()
export class UpdateTodoUseCases extends Usecase<void> {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {
    super();
  }

  async execute(id: number, isDone: boolean) {
    await this.todoRepository.updateContent(id, isDone);
    this.logger.log(
      'updateTodoUseCases execute',
      `Todo ${id} have been updated`,
    );
  }
}
