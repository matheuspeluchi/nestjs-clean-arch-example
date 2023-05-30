import { ApiProperty } from '@nestjs/swagger';
import { TodoModel } from '../../../domain/models/todo.model';

export class TodoPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isDone: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(todo: TodoModel) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description;
    this.isDone = todo.isDone;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
