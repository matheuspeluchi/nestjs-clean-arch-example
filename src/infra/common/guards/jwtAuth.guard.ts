import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '../../interfaces/jwt-service.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: JwtService) {}
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const token =
      request.cookies['authorization'] ??
      request.headers.authorization?.replace('Bearer ', '');

    const isValid = this.authService.verify(token);

    return isValid;
  }
}
