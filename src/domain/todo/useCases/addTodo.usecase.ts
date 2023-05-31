import { Injectable } from '@nestjs/common';
import { TodoModel } from '../models/todo.model';
import { TodoRepository } from '../../../infra/repositories/todo/todo.repository';
import { Usecase } from '../../../infra/adapters/useCase.interface';
import { LoggerService } from '../../../infra/logger/logger.service';
import { TodoDTO } from '../dto/Todo.dto';

@Injectable()
export class AddTodoUseCases extends Usecase<TodoDTO> {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {
    super();
  }

  async execute(title: string, description: string) {
    const todo = new TodoModel();
    todo.title = title;
    todo.description = description;
    todo.isDone = false;
    todo.createdAt = new Date();
    await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return todo;
  }
}
