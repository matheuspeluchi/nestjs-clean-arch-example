import { Module } from '@nestjs/common';
import { IsAuthenticatedUseCase } from './isAuthenticated.usecases';
import { LoginUseCase } from './login.usecases';
import { LogoutUseCase } from './logout.usecases';
import { LoggerModule } from '../../../infra/logger/logger.module';
import { BcryptModule } from '../../../infra/services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from '../../../infra/config/environment-config/environment-config.module';
import { RepositoriesModule } from '../../../infra/repositories/repositories.module';
import { AuthModule } from '../../../infra/services/auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
  ],
  providers: [IsAuthenticatedUseCase, LoginUseCase, LogoutUseCase],
  exports: [IsAuthenticatedUseCase, LoginUseCase, LogoutUseCase],
})
export class AuthUseCaseModule {}
