import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../../adapters/auth.interface';
import { AuthTokenService } from './auth.service';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [{ provide: AuthService, useClass: AuthTokenService }],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
