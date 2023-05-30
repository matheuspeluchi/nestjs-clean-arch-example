import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infra/config/environment-config/environment-config.module';
import { LoggerModule } from './infra/logger/logger.module';
import { ExceptionsModule } from './infra/exceptions/exceptions.module';
import { PassportModule } from '@nestjs/passport';
import { BcryptModule } from './infra/services/bcrypt/bcrypt.module';
import { JwtStrategy } from './infra/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './infra/common/strategies/jwtRefresh.strategy';
import { LocalStrategy } from './infra/common/strategies/local.strategy';
import { ControllersModule } from './application/controllers/controllers.module';
import { JwtModule as JwtServiceModule } from './infra/services/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';
import { StrategyModule } from './infra/common/strategies/strategies.module';
import { AuthUseCaseModule } from './domain/useCases/auth/authUseCase.module';

@Module({
  imports: [
    StrategyModule,
    AuthUseCaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
