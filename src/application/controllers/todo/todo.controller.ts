import {
  Controller,
  Inject,
  Get,
  Query,
  ParseIntPipe,
  Put,
  Body,
  Delete,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { addTodoUseCases } from '../../../domain/useCases/todo/addTodo.usecase';
import { deleteTodoUseCases } from '../../../domain/useCases/todo/deleteTodo.usecase';
import { GetTodoUseCases } from '../../../domain/useCases/todo/getTodo.usecase';
import { getTodosUseCases } from '../../../domain/useCases/todo/getTodos.usecase';
import { updateTodoUseCases } from '../../../domain/useCases/todo/updateTodo.usecase';
import { ApiResponseType } from '../../../infra/common/swagger/response.decorator';
import { UseCaseProxy } from '../../../infra/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../../infra/usecases-proxy/usecases-proxy.module';
import { AddTodoDto } from './addTodo.dto';
import { TodoPresenter } from '../../presenters/todo/todo.presenter';
import { UpdateTodoDto } from './updateTodo.dto';

@Controller('todo')
@ApiTags('todo')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TodoPresenter)
export class TodoController {
  constructor(
    @Inject(UsecasesProxyModule.GET_TODO_USECASES_PROXY)
    private readonly getTodoUsecaseProxy: UseCaseProxy<GetTodoUseCases>,
    @Inject(UsecasesProxyModule.GET_TODOS_USECASES_PROXY)
    private readonly getAllTodoUsecaseProxy: UseCaseProxy<getTodosUseCases>,
    @Inject(UsecasesProxyModule.PUT_TODO_USECASES_PROXY)
    private readonly updateTodoUsecaseProxy: UseCaseProxy<updateTodoUseCases>,
    @Inject(UsecasesProxyModule.DELETE_TODO_USECASES_PROXY)
    private readonly deleteTodoUsecaseProxy: UseCaseProxy<deleteTodoUseCases>,
    @Inject(UsecasesProxyModule.POST_TODO_USECASES_PROXY)
    private readonly addTodoUsecaseProxy: UseCaseProxy<addTodoUseCases>,
  ) {}

  @Get('todo')
  @ApiResponseType(TodoPresenter, false)
  async getTodo(@Query('id', ParseIntPipe) id: number) {
    const todo = await this.getTodoUsecaseProxy.getInstance().execute(id);
    return new TodoPresenter(todo);
  }

  @Get('todos')
  @ApiResponseType(TodoPresenter, true)
  async getTodos() {
    const todos = await this.getAllTodoUsecaseProxy.getInstance().execute();
    return todos.map((todo) => new TodoPresenter(todo));
  }

  @Put('todo')
  @ApiResponseType(TodoPresenter, true)
  async updateTodo(@Body() updateTodoDto: UpdateTodoDto) {
    const { id, isDone } = updateTodoDto;
    await this.updateTodoUsecaseProxy.getInstance().execute(id, isDone);
    return 'success';
  }

  @Delete('todo')
  @ApiResponseType(TodoPresenter, true)
  async deleteTodo(@Query('id', ParseIntPipe) id: number) {
    await this.deleteTodoUsecaseProxy.getInstance().execute(id);
    return 'success';
  }

  @Post('todo')
  @ApiResponseType(TodoPresenter, true)
  async addTodo(@Body() addTodoDto: AddTodoDto) {
    const { content } = addTodoDto;
    const todoCreated = await this.addTodoUsecaseProxy
      .getInstance()
      .execute(content);
    return new TodoPresenter(todoCreated);
  }
}
