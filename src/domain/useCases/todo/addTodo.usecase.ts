import { ILogger } from '../../../infra/logger/logger.interface';
import { TodoModel } from '../../../infra/repositories/models/todo.model';
import { ITodoRepository } from '../../../infra/repositories/todo/todoRepository.interface';

export class addTodoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly todoRepository: ITodoRepository,
  ) {}

  async execute(content: string): Promise<TodoModel> {
    const todo = new TodoModel();
    todo.content = content;
    todo.isDone = false;
    await this.todoRepository.insert(todo);
    this.logger.log('addTodoUseCases execute', 'New todo have been inserted');
    return todo;
  }
}
