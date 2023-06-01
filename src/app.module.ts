import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infra/config/environment-config/environment-config.module';
import { LoggerModule } from './infra/logger/logger.module';
import { ExceptionsModule } from './infra/exceptions/exceptions.module';
import { BcryptModule } from './infra/services/bcrypt/bcrypt.module';
import { ControllersModule } from './application/controllers/controllers.module';
import { TokenModule } from './infra/services/token/token.module';

@Module({
  imports: [
    TokenModule,
    LoggerModule,
    ExceptionsModule,
    ControllersModule,
    BcryptModule,
    EnvironmentConfigModule,
  ],
  providers: [],
})
export class AppModule {}
