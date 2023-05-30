import { Injectable } from '@nestjs/common';
import { JwtService as NestJSJwtService } from '@nestjs/jwt';
import { JwtService, IJwtServicePayload } from '../../adapters/jwt.interface';

@Injectable()
export class JwtTokenService extends JwtService {
  constructor(private readonly jwtService: NestJSJwtService) {
    super();
  }

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
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
