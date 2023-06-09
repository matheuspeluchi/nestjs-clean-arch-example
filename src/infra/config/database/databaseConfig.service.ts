import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentConfig } from '../../interfaces/environment.interface';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: EnvironmentConfig) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.getDatabaseHost(),
      port: this.configService.getDatabasePort(),
      username: this.configService.getDatabaseUser(),
      password: this.configService.getDatabasePassword(),
      database: this.configService.getDatabaseName(),
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }
}
