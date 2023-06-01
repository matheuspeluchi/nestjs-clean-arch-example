import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../interfaces/todo.repository';
import { TodoDTO } from '../dto/Todo.dto';
import { Usecase } from '../../interfaces/useCase.interface';

@Injectable()
export class ListTodosUseCases extends Usecase<TodoDTO[]> {
  constructor(private readonly todoRepository: TodoRepository) {
    super();
  }

  async execute() {
    const todoList = await this.todoRepository.findAll();
    return todoList;
  }
}
