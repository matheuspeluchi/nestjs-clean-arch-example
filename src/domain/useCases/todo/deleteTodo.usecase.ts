import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';
import { Usecase } from '../UseCase.interface';
import { LoggerService } from '../../../infra/logger/logger.service';
@Injectable()
export class DeleteTodoUseCases implements Usecase {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
    this.logger.log(
      'deleteTodoUseCases execute',
      `Todo ${id} have been deleted`,
    );
  }
}
