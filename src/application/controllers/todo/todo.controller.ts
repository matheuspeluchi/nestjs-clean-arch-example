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
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { JwtAuthGuard } from '../../../infra/common/guards/jwtAuth.guard';
import { DeleteTodoUseCases } from '../../../domain/todo/useCases/deleteTodo.usecase';
import { GetTodoUseCases } from '../../../domain/todo/useCases/getTodo.usecase';
import { ListTodosUseCases } from '../../../domain/todo/useCases/listTodos.usecase';
import { UpdateTodoUseCases } from '../../../domain/todo/useCases/updateTodo.usecase';
import { Usecase } from '../../../domain/interfaces/useCase.interface';
import { TodoDTO } from '../../../domain/todo/dto/Todo.dto';

@Controller('todos')
@ApiTags('todo')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(TodoPresenter)
export class TodoController {
  constructor(
    @Inject(GetTodoUseCases)
    private readonly getTodoUsecaseProxy: Usecase<number, TodoDTO>,
    @Inject(ListTodosUseCases)
    private readonly listUsecase: Usecase<null, TodoDTO[]>,
    @Inject(UpdateTodoUseCases)
    private readonly updateTodoUsecaseProxy: Usecase<any, TodoDTO>,
    @Inject(DeleteTodoUseCases)
    private readonly deleteTodoUsecaseProxy: Usecase<number, void>,
    @Inject(AddTodoUseCases)
    private readonly addTodoUsecaseProxy: Usecase<AddTodoDto, TodoDTO>,
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
  async updateTodo(@Body() updateTodoDto: UpdateTodoDTO) {
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
  @UseGuards(JwtAuthGuard)
  @ApiResponseType(TodoPresenter, true)
  async addTodo(@Body() addTodoDto: AddTodoDto) {
    const todoCreated = await this.addTodoUsecaseProxy.execute(addTodoDto);
    return new TodoPresenter(todoCreated);
  }
}
