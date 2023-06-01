interface ITodo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TodoDTO {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(todo: ITodo) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description;
    this.isDone = todo.isDone;
    this.createdAt = todo.createdAt;
    this.updatedAt = todo.updatedAt;
  }
}
