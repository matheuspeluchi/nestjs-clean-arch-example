import { Injectable } from '@nestjs/common';
import { EncryptionService } from '../../../infra/adapters/encryption.interface';
import {
  IJwtServicePayload,
  JwtService,
} from '../../../infra/adapters/jwt.interface';
import { UserRepository } from '../../../infra/repositories/user/userRepository.interface';
import { LoggerService } from '../../../infra/logger/logger.service';
import { EnvironmentConfigService } from '../../../infra/config/environment-config/environment-config.service';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly jwtTokenService: JwtService,
    private readonly configService: EnvironmentConfigService,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: EncryptionService,
  ) {}

  async getCookieWithJwtToken(username: string) {
    this.logger.log(
      'LoginUseCase execute',
      `The user ${username} have been logged.`,
    );
    const payload: IJwtServicePayload = { username: username };
    const secret = this.configService.getJwtSecret();
    const expiresIn = this.configService.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.getJwtExpirationTime()}`;
  }

  async getCookieWithJwtRefreshToken(username: string) {
    this.logger.log(
      'LoginUseCase execute',
      `The user ${username} have been logged.`,
    );
    const payload: IJwtServicePayload = { username: username };
    const secret = this.configService.getJwtRefreshSecret();
    const expiresIn = this.configService.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, username);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.getJwtRefreshExpirationTime()}`;
    return cookie;
  }

  async validateUserForLocalStragtegy(username: string, pass: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const match = await this.bcryptService.compare(pass, user.password);
    if (user && match) {
      await this.updateLoginTime(user.username);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserForJWTStragtegy(username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateLoginTime(username: string) {
    await this.userRepository.updateLastLogin(username);
  }

  async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );
    await this.userRepository.updateRefreshToken(
      username,
      currentHashedRefreshToken,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.hashRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }
}
