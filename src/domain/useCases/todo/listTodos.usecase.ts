import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../models/todo.model';
import { TodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';
import { Usecase } from '../UseCase.interface';

@Injectable()
export class ListTodosUseCases implements Usecase {
  constructor(private readonly todoRepository: TodoRepository) {}

  async execute(): Promise<TodoModel[]> {
    const todoList = await this.todoRepository.findAll();
    return todoList;
  }
}
