import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';

import { TypeOrmConfigService } from './typeOrmConfig.service';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class TypeOrmConfigModule {}
