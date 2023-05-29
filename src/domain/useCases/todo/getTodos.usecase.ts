import { TodoModel } from '../../../infra/repositories/models/todo.model';
import { ITodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';

export class getTodosUseCases {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<TodoModel[]> {
    return await this.todoRepository.findAll();
  }
}
