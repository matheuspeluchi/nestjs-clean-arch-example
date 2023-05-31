import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/database/database.module';
import { Todo } from './entities/todo.entity';
import { User } from './entities/user.entity';
import { DatabaseTodoRepository } from './todo/databaseTodo.repository';
import { DatabaseUserRepository } from './user/databaseUser.repository';
import { UserRepository } from './user/user.repository';
import { TodoRepository } from './todo/todo.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User])],
  providers: [
    { provide: TodoRepository, useClass: DatabaseTodoRepository },
    { provide: UserRepository, useClass: DatabaseUserRepository },
  ],
  exports: [TypeOrmModule, TodoRepository, UserRepository],
})
export class RepositoriesModule {}
