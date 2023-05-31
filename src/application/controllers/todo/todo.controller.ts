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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { AddTodoUseCases } from '../../../domain/todo/useCases/addTodo.usecase';

import { ApiResponseType } from '../../../infra/common/swagger/response.decorator';
import { AddTodoDto } from './dto/addTodo.dto';
import { TodoPresenter } from '../../presenters/todo/todo.presenter';
import { UpdateTodoDto } from './dto/updateTodo.dto';
import { JwtAuthGuard } from '../../../infra/common/guards/jwtAuth.guard';
import { DeleteTodoUseCases } from '../../../domain/todo/useCases/deleteTodo.usecase';
import { GetTodoUseCases } from '../../../domain/todo/useCases/getTodo.usecase';
import { ListTodosUseCases } from '../../../domain/todo/useCases/listTodos.usecase';
import { UpdateTodoUseCases } from '../../../domain/todo/useCases/updateTodo.usecase';

@Controller('todos')
@ApiTags('todo')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TodoPresenter)
export class TodoController {
  constructor(
    private readonly getTodoUsecaseProxy: GetTodoUseCases,
    private readonly listUsecase: ListTodosUseCases,
    private readonly updateTodoUsecaseProxy: UpdateTodoUseCases,
    private readonly deleteTodoUsecaseProxy: DeleteTodoUseCases,
    private readonly addTodoUsecaseProxy: AddTodoUseCases,
  ) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponseType(TodoPresenter, false)
  async getTodo(@Query('id') id: number) {
    const todo = await this.getTodoUsecaseProxy.execute(id);
    return new TodoPresenter(todo);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiResponseType(TodoPresenter, true)
  async getTodos() {
    const todos = await this.listUsecase.execute();
    return todos.map((todo) => new TodoPresenter(todo));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponseType(TodoPresenter, true)
  async updateTodo(@Body() updateTodoDto: UpdateTodoDto) {
    const { id, isDone } = updateTodoDto;
    await this.updateTodoUsecaseProxy.execute(id, isDone);
    return 'success';
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponseType(TodoPresenter, true)
  async deleteTodo(@Query('id', ParseIntPipe) id: number) {
    await this.deleteTodoUsecaseProxy.execute(id);
    return 'success';
  }

  @Post()
  @ApiResponseType(TodoPresenter, true)
  async addTodo(@Body() addTodoDto: AddTodoDto) {
    const { title, description } = addTodoDto;
    const todoCreated = await this.addTodoUsecaseProxy.execute(
      title,
      description,
    );
    return new TodoPresenter(todoCreated);
  }
}
