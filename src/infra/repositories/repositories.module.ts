import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { Todo } from '../../domain/entities/todo.entity';
import { User } from '../../domain/entities/user.entity';
import { DatabaseTodoRepository } from './todo/todo.repository';
import { DatabaseUserRepository } from './user/user.repository';
import { UserRepository } from './user/userRepository.interface';
import { TodoRepository } from './todo/todoRepository.interface';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User])],
  providers: [
    { provide: TodoRepository, useClass: DatabaseTodoRepository },
    { provide: UserRepository, useClass: DatabaseUserRepository },
  ],
  exports: [TodoRepository, UserRepository],
})
export class RepositoriesModule {}
