import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../todo/models/todo.model';
import { TodoRepository } from '../../interfaces/todo.repository';
import { TodoDTO } from '../dto/Todo.dto';
import { Usecase } from '../../interfaces/useCase.interface';
@Injectable()
export class GetTodoUseCases extends Usecase<number, TodoDTO> {
  constructor(private readonly todoRepository: TodoRepository) {
    super();
  }

  async execute(id: number): Promise<TodoModel> {
    return await this.todoRepository.findById(id);
  }
}
