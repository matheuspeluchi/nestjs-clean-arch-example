import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITodoRepository } from './todoRepository.interface';
import { Todo } from '../../../domain/entities/todo.entity';
import { TodoModel } from '../models/todo.model';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly todoEntityRepository: Repository<Todo>,
  ) {}

  async updateContent(id: number, isDone: boolean): Promise<void> {
    await this.todoEntityRepository.update(
      {
        id: id,
      },
      { isDone: isDone },
    );
  }
  async insert(todo: TodoModel): Promise<void> {
    const todoEntity = this.toTodoEntity(todo);
    await this.todoEntityRepository.insert(todoEntity);
  }
  async findAll(): Promise<TodoModel[]> {
    const todosEntity = await this.todoEntityRepository.find();
    return todosEntity.map((todoEntity) => this.toTodo(todoEntity));
  }
  async findById(id: number): Promise<TodoModel> {
    const todoEntity = await this.todoEntityRepository.findOneOrFail({
      where: { id },
    });
    return this.toTodo(todoEntity);
  }
  async deleteById(id: number): Promise<void> {
    await this.todoEntityRepository.delete({ id: id });
  }

  private toTodo(todoEntity: Todo): TodoModel {
    const todo: TodoModel = new TodoModel();

    todo.id = todoEntity.id;
    todo.content = todoEntity.content;
    todo.isDone = todoEntity.isDone;
    todo.createdate = todoEntity.createdate;
    todo.updateddate = todoEntity.updateddate;

    return todo;
  }

  private toTodoEntity(todo: TodoModel): Todo {
    const todoEntity: Todo = new Todo();

    todoEntity.id = todo.id;
    todoEntity.content = todo.content;
    todoEntity.isDone = todo.isDone;

    return todoEntity;
  }
}
