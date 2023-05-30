import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../models/todo.model';
import { TodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';
import { Usecase } from '../UseCase.interface';
@Injectable()
export class GetTodoUseCases implements Usecase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(id: number): Promise<TodoModel> {
    return await this.todoRepository.findById(id);
  }
}
