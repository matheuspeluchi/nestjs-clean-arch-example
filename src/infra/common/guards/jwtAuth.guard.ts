import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../adapters/auth.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const token =
      request.cookies['Authorization'] ??
      request.headers.authorization?.replace('Bearer ', '');

    const isValid = this.authService.verify(token);

    return isValid;
  }
}
