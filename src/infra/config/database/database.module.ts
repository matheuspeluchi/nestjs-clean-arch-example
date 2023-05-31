import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';

import { DatabaseConfigService } from './databaseConfig.service';
import { EnvironmentConfig } from '../../adapters/environment.mixin';

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfig],
      useClass: DatabaseConfigService,
    }),
  ],
})
export class TypeOrmConfigModule {}
