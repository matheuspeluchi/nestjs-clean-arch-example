import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../todo/models/todo.model';
import { TodoRepository } from '../../../infra/repositories/todo/todo.repository';
import { TodoDTO } from '../dto/Todo.dto';
import { Usecase } from '../../../infra/adapters/useCase.interface';
@Injectable()
export class GetTodoUseCases extends Usecase<TodoDTO> {
  constructor(private readonly todoRepository: TodoRepository) {
    super();
  }

  async execute(id: number): Promise<TodoModel> {
    return await this.todoRepository.findById(id);
  }
}
