import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';
import { validate } from './environment-config.validation';
import { EnvironmentConfig } from '../../interfaces/environment.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      // envFilePath: '.env',
      // ignoreEnvFile:
      //   process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test'
      //     ? false
      //     : true,
      isGlobal: true,
      validate,
    }),
  ],
  providers: [
    { provide: EnvironmentConfig, useClass: EnvironmentConfigService },
  ],
  exports: [EnvironmentConfig],
})
export class EnvironmentConfigModule {}
