import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infra/config/environment-config/environment-config.module';
import { LoggerModule } from './infra/logger/logger.module';
import { ExceptionsModule } from './infra/exceptions/exceptions.module';
import { PassportModule } from '@nestjs/passport';
import { BcryptModule } from './infra/services/bcrypt/bcrypt.module';
import { JwtStrategy } from './infra/common/strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from './infra/common/strategies/jwtRefresh.strategy';
import { LocalStrategy } from './infra/common/strategies/local.strategy';
import { UsecasesProxyModule } from './infra/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from './application/controllers/controllers.module';
import { JwtModule as JwtServiceModule } from './infra/services/jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
