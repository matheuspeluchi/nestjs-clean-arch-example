import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';

import { LoggerService } from '../../logger/logger.service';
import { ExceptionsService } from '../../exceptions/exceptions.service';
import { TokenPayload } from '../../../domain/models/auth';
import { LoginUseCase } from '../../../domain/useCases/auth/login.usecases';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: EnvironmentConfigService,
    private readonly loginUsecaseProxy: LoginUseCase,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh;
    const user = this.loginUsecase.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.username,
    );
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found or hash not correct`);
      this.exceptionService.UnauthorizedException({
        message: 'User not found or hash not correct',
      });
    }
    return user;
  }
}
