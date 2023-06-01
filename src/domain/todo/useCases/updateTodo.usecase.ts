import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../interfaces/todo.repository';
import { LoggerService } from '../../../infra/logger/logger.service';
import { Usecase } from '../../interfaces/useCase.interface';
import { UpdateTodoDTO } from '../../../application/controllers/todo/dto/updateTodo.dto';
@Injectable()
export class UpdateTodoUseCases extends Usecase<UpdateTodoDTO, void> {
  constructor(
    private readonly logger: LoggerService,
    private readonly todoRepository: TodoRepository,
  ) {
    super();
  }

  async execute(updateTodoDTO: UpdateTodoDTO) {
    const { id, isDone } = updateTodoDTO;
    await this.todoRepository.updateContent(id, isDone);
    this.logger.log(
      'updateTodoUseCases execute',
      `Todo ${id} have been updated`,
    );
  }
}
