import { Module, DynamicModule } from '@nestjs/common';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { RepositoriesModule } from '../repositories/repositories.module';

import { UseCaseProxy } from './usecases-proxy';
import { AddTodoUseCases } from '../../domain/useCases/todo/addTodo.usecase';
import { DeleteTodoUseCases } from '../../domain/useCases/todo/deleteTodo.usecase';
import { GetTodoUseCases } from '../../domain/useCases/todo/getTodo.usecase';
import { ListTodosUseCases } from '../../domain/useCases/todo/listTodos.usecase';
import { UpdateTodoUseCases } from '../../domain/useCases/todo/updateTodo.usecase';
import { TodoRepository } from '../repositories/todo/todo.repository';

@Module({
  imports: [LoggerModule, RepositoriesModule, ExceptionsModule],
})
export class UsecasesProxyModule {
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';

  static GET_TODO_USECASES_PROXY = 'getTodoUsecasesProxy';
  static GET_TODOS_USECASES_PROXY = 'getTodosUsecasesProxy';
  static POST_TODO_USECASES_PROXY = 'postTodoUsecasesProxy';
  static DELETE_TODO_USECASES_PROXY = 'deleteTodoUsecasesProxy';
  static PUT_TODO_USECASES_PROXY = 'putTodoUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        LoggerService,
        {
          inject: [TodoRepository],
          provide: UsecasesProxyModule.GET_TODO_USECASES_PROXY,
          useFactory: (todoRepository: TodoRepository) =>
            new UseCaseProxy(new GetTodoUseCases(todoRepository)),
        },
        {
          inject: [TodoRepository],
          provide: UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
          useFactory: (todoRepository: TodoRepository) =>
            new UseCaseProxy(new ListTodosUseCases(todoRepository)),
        },
        {
          inject: [LoggerService, TodoRepository],
          provide: UsecasesProxyModule.POST_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: TodoRepository) =>
            new UseCaseProxy(new AddTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, TodoRepository],
          provide: UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: TodoRepository) =>
            new UseCaseProxy(new UpdateTodoUseCases(logger, todoRepository)),
        },
        {
          inject: [LoggerService, TodoRepository],
          provide: UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
          useFactory: (logger: LoggerService, todoRepository: TodoRepository) =>
            new UseCaseProxy(new DeleteTodoUseCases(logger, todoRepository)),
        },
      ],
      exports: [
        UsecasesProxyModule.GET_TODO_USECASES_PROXY,
        UsecasesProxyModule.GET_TODOS_USECASES_PROXY,
        UsecasesProxyModule.POST_TODO_USECASES_PROXY,
        UsecasesProxyModule.PUT_TODO_USECASES_PROXY,
        UsecasesProxyModule.DELETE_TODO_USECASES_PROXY,
      ],
    };
  }
}
