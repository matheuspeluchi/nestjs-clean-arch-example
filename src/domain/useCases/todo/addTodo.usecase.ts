import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../models/todo.model';
import { TodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';
import { Usecase } from '../UseCase.interface';
import { LoggerService } from '../../../infra/logger/logger.service';

@Injectable()
export class AddTodoUseCases implements Usecase {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {}

  async execute(content: string): Promise<TodoModel> {
    const todo = new TodoModel();
    todo.content = content;
    todo.isDone = false;
    await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return todo;
  }
}
