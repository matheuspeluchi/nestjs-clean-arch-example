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
import { AddTodoUseCases } from '../../../domain/useCases/todo/addTodo.usecase';
import { DeleteTodoUseCases } from '../../../domain/useCases/todo/deleteTodo.usecase';
import { GetTodoUseCases } from '../../../domain/useCases/todo/getTodo.usecase';
import { ListTodosUseCases } from '../../../domain/useCases/todo/listTodos.usecase';
import { UpdateTodoUseCases } from '../../../domain/useCases/todo/updateTodo.usecase';
import { ApiResponseType } from '../../../infra/common/swagger/response.decorator';
import { AddTodoDto } from './dto/addTodo.dto';
import { TodoPresenter } from '../../presenters/todo/todo.presenter';
import { UpdateTodoDto } from './dto/updateTodo.dto';

@Controller('todo')
@ApiTags('todo')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TodoPresenter)
export class TodoController {
  constructor(
    private readonly getTodoUsecaseProxy: GetTodoUseCases,
    private readonly getAllTodoUsecaseProxy: ListTodosUseCases,
    private readonly updateTodoUsecaseProxy: UpdateTodoUseCases,
    private readonly deleteTodoUsecaseProxy: DeleteTodoUseCases,
    private readonly addTodoUsecaseProxy: AddTodoUseCases,
  ) {}

  @Get('todo')
  @ApiResponseType(TodoPresenter, false)
  async getTodo(@Query('id', ParseIntPipe) id: number) {
    const todo = await this.getTodoUsecaseProxy.execute(id);
    return new TodoPresenter(todo);
  }

  @Get('todos')
  @ApiResponseType(TodoPresenter, true)
  async getTodos() {
    const todos = await this.getAllTodoUsecaseProxy.execute();
    return todos.map((todo) => new TodoPresenter(todo));
  }

  @Put('todo')
  @ApiResponseType(TodoPresenter, true)
  async updateTodo(@Body() updateTodoDto: UpdateTodoDto) {
    const { id, isDone } = updateTodoDto;
    await this.updateTodoUsecaseProxy.execute(id, isDone);
    return 'success';
  }

  @Delete('todo')
  @ApiResponseType(TodoPresenter, true)
  async deleteTodo(@Query('id', ParseIntPipe) id: number) {
    await this.deleteTodoUsecaseProxy.execute(id);
    return 'success';
  }

  @Post('todo')
  @ApiResponseType(TodoPresenter, true)
  async addTodo(@Body() addTodoDto: AddTodoDto) {
    const { content } = addTodoDto;
    const todoCreated = await this.addTodoUsecaseProxy.execute(content);
    return new TodoPresenter(todoCreated);
  }
}
