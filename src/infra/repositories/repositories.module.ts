import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/database/database.module';
import { Todo } from './entities/todo.entity';
import { User } from './entities/user.entity';
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
  exports: [TypeOrmModule, TodoRepository, UserRepository],
})
export class RepositoriesModule {}
