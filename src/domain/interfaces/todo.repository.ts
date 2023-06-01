import { TodoModel } from '../todo/models/todo.model';

export abstract class TodoRepository {
  abstract insert(todo: TodoModel): Promise<void>;
  abstract findAll(): Promise<TodoModel[]>;
  abstract findById(id: number): Promise<TodoModel>;
  abstract updateContent(id: number, isDone: boolean): Promise<void>;
  abstract deleteById(id: number): Promise<void>;
}
