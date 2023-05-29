import { TodoModel } from '../../../infra/repositories/models/todo.model';
import { ITodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';

export class GetTodoUseCases {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: number): Promise<TodoModel> {
    return await this.todoRepository.findById(id);
  }
}
