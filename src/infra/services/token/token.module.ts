import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '../../interfaces/jwt-service.interface';
import { TokenService } from './token.service';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentConfigModule } from '../../config/environment-config/environment-config.module';

@Global()
@Module({
  imports: [
    PassportModule,
    EnvironmentConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [{ provide: JwtService, useClass: TokenService }],
  exports: [JwtService, JwtModule],
})
export class TokenModule {}
