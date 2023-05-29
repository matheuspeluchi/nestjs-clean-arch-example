import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../../infra/repositories/models/todo.model';
import { TodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';
import { Usecase } from '../UseCase.interface';

@Injectable()
export class ListTodosUseCases implements Usecase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<TodoModel[]> {
    return await this.todoRepository.findAll();
  }
}
