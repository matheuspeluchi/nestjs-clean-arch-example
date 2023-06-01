import { Module } from '@nestjs/common';
import { LoginUseCase } from './login.usecases';
import { LogoutUseCase } from './logout.usecases';
import { LoggerModule } from '../../../infra/logger/logger.module';
import { BcryptModule } from '../../../infra/services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from '../../../infra/config/environment-config/environment-config.module';
import { RepositoriesModule } from '../../../infra/repositories/repositories.module';
import { TokenModule } from '../../../infra/services/token/token.module';
import { RefreshUseCase } from './refresh.usecases';

@Module({
  imports: [
    LoggerModule,
    TokenModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
  ],
  providers: [LoginUseCase, LogoutUseCase, RefreshUseCase],
  exports: [LoginUseCase, LogoutUseCase, RefreshUseCase],
})
export class AuthUseCaseModule {}
