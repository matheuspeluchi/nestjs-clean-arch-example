import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtServicePayload, AuthService } from '../../adapters/auth.interface';

@Injectable()
export class AuthTokenService extends AuthService {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async verify(token: string): Promise<boolean> {
    try {
      const decode = await this.jwtService.verify(token);
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
}
