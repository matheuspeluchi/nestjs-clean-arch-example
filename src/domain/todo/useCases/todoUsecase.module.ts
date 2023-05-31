import { Module } from '@nestjs/common';
import { AddTodoUseCases } from './addTodo.usecase';
import { DeleteTodoUseCases } from './deleteTodo.usecase';
import { ListTodosUseCases } from './listTodos.usecase';
import { GetTodoUseCases } from './getTodo.usecase';
import { UpdateTodoUseCases } from './updateTodo.usecase';
import { RepositoriesModule } from '../../../infra/repositories/repositories.module';
import { LoggerModule } from '../../../infra/logger/logger.module';

@Module({
  imports: [RepositoriesModule, LoggerModule],
  providers: [
    AddTodoUseCases,
    DeleteTodoUseCases,
    ListTodosUseCases,
    GetTodoUseCases,
    UpdateTodoUseCases,
  ],
  exports: [
    AddTodoUseCases,
    DeleteTodoUseCases,
    ListTodosUseCases,
    GetTodoUseCases,
    UpdateTodoUseCases,
  ],
})
export class TodoUseCaseModule {}
