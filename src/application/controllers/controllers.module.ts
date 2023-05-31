import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { TodoController } from './todo/todo.controller';
import { AuthUseCaseModule } from '../../domain/auth/useCases/authUseCase.module';
import { TodoUseCaseModule } from '../../domain/todo/useCases/todoUsecase.module';

@Module({
  imports: [TodoUseCaseModule, AuthUseCaseModule],
  controllers: [TodoController, AuthController],
})
export class ControllersModule {}
