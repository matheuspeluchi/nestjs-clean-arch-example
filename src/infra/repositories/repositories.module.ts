import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { Todo } from '../../domain/entities/todo.entity';
import { User } from '../../domain/entities/user.entity';
import { TodoRepository } from './todo/todo.repository';
import { UserRepository } from './user/user.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([Todo, User])],
  providers: [TodoRepository, UserRepository],
  exports: [TodoRepository, UserRepository],
})
export class RepositoriesModule {}
