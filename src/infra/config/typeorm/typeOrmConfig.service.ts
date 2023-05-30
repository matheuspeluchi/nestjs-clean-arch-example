import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: EnvironmentConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.getDatabaseHost(),
      port: this.configService.getDatabasePort(),
      username: this.configService.getDatabaseUser(),
      password: this.configService.getDatabasePassword(),
      database: this.configService.getDatabaseName(),
      entities: [__dirname + '/../**/*.entity.ts'],
      synchronize: false,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    };
  }
}
