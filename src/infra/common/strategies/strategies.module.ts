import { Module } from '@nestjs/common';
import { AuthUseCaseModule } from '../../../domain/useCases/auth/authUseCase.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwtRefresh.strategy';
import { LoggerModule } from '../../logger/logger.module';
import { ExceptionsModule } from '../../exceptions/exceptions.module';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';
import { JwtModule } from '../../services/jwt/jwt.module';
import { RepositoriesModule } from '../../repositories/repositories.module';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';

@Module({
  imports: [
    AuthUseCaseModule,
    JwtModule,
    LoggerModule,
    ExceptionsModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    BcryptModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class StrategyModule {}
