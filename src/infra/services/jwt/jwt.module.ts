import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtTokenService } from './jwt.service';
import { JwtService } from '../../adapters/jwt.interface';

@Module({
  imports: [
    Jwt.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [{ provide: JwtService, useClass: JwtTokenService }],
  exports: [JwtService],
})
export class JwtModule {}
