import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJWT } from '@nestjs/jwt';
import {
  IJwtServicePayload,
  JwtService,
} from '../../interfaces/jwt-service.interface';
import { EnvironmentConfig } from '../../interfaces/environment.interface';

@Injectable()
export class TokenService extends JwtService {
  constructor(
    private readonly jwtService: NestJWT,
    private readonly confiService: EnvironmentConfig,
  ) {
    super();
  }

  async verify(token: string, secret: string = null): Promise<boolean> {
    if (!secret) secret = this.confiService.getJwtSecret();
    try {
      const decode = await this.jwtService.verify(token, { secret });
      return decode;
    } catch (error) {
      throw new UnauthorizedException('Invalid token ');
    }
  }

  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string {
    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  getUserFromToken(token: string): string {
    const decoded: any = this.jwtService.decode(token, { json: true });
    return decoded.username;
  }
}
