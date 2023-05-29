import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infra/config/environment-config/environment-config.module';
import { LoggerModule } from './infra/logger/logger.module';
import { ExceptionsModule } from './infra/exceptions/exceptions.module';
import { ExceptionsService } from './infra/exceptions/exceptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoriesModule } from './infra/repositories/repositories.module';

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmModule,
    LoggerModule,
    ExceptionsModule,
    RepositoriesModule,
  ],
  controllers: [],
  providers: [ExceptionsService],
})
export class AppModule {}
