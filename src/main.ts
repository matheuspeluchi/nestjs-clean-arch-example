import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { LoggerService } from './infra/logger/logger.service';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './infra/common/filter/exception.filter';
import { LoggingInterceptor } from './infra/common/interceptors/logger.interceptor';
import {
  ResponseInterceptor,
  ResponseFormat,
} from './infra/common/interceptors/response.interceptor';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Clean Architecture Nestjs')
      .setDescription('Example with todo list')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
