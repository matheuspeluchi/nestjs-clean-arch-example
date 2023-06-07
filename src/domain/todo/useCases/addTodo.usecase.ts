import { Injectable } from '@nestjs/common';
import { TodoModel } from '../models/todo.model';
import { TodoRepository } from '../../interfaces/todo.repository';
import { Usecase } from '../../interfaces/useCase.interface';
import { LoggerService } from '../../../infra/logger/logger.service';
import { TodoDTO } from '../dto/Todo.dto';
import { AddTodoDto } from '../../../application/controllers/todo/dto/addTodo.dto';

@Injectable()
export class AddTodoUseCases extends Usecase<AddTodoDto, TodoDTO> {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {
    super();
  }

  async execute(addTodoDTO: AddTodoDto) {
    const { title, description } = addTodoDTO;
    const todo = new TodoModel();
    todo.title = title;
    todo.description = description;
    todo.isDone = false;
    todo.createdAt = new Date();
    const newTodo = await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return new TodoDTO(newTodo);
  }
}
