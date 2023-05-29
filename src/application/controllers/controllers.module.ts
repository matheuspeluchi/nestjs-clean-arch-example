import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { TodoController } from './todo/todo.controller';
import { TodoUseCaseModule } from '../../domain/useCases/todo/todoUsecase.module';
import { AuthUseCaseModule } from '../../domain/useCases/auth/authUseCase.module';

@Module({
  imports: [TodoUseCaseModule, AuthUseCaseModule],
  controllers: [TodoController, AuthController],
})
export class ControllersModule {}
