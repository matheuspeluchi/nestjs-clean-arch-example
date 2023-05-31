import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EncryptionService } from '../../../infra/adapters/encryption.interface';
import {
  IJwtServicePayload,
  AuthService,
} from '../../../infra/adapters/auth.interface';
import { UserRepository } from '../../../infra/repositories/user/user.repository';
import { LoggerService } from '../../../infra/logger/logger.service';
import { EnvironmentConfig } from '../../../infra/adapters/environment.mixin';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly logger: LoggerService,
    private readonly authTokenService: AuthService,
    private readonly configService: EnvironmentConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: EncryptionService,
  ) {}

  async authenticate(username: string, password: string): Promise<boolean> {
    let isValidUsernameAndPassword = false;
    const user = await this.userRepository.getUserByUsername(username);
    if (user)
      isValidUsernameAndPassword = await this.bcryptService.compare(
        password,
        user.password,
      );

    if (isValidUsernameAndPassword) return isValidUsernameAndPassword;

    throw new UnauthorizedException('Invalid username or password');
  }

  async getCookieWithJwtToken(username: string) {
    this.logger.log(
      'LoginUseCase execute',
      `The user ${username} have been logged.`,
    );
    const payload: IJwtServicePayload = { username: username };
    const secret = this.configService.getJwtSecret();
    const expiresIn = this.configService.getJwtExpirationTime() + 's';
    const token = this.authTokenService.createToken(payload, secret, expiresIn);
    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${this.configService.getJwtExpirationTime()}`;
  }

  async getCookieWithJwtRefreshToken(username: string) {
    this.logger.log(
      'LoginUseCase execute',
      `The user ${username} have been logged.`,
    );
    const payload: IJwtServicePayload = { username: username };
    const secret = this.configService.getJwtRefreshSecret();
    const expiresIn = this.configService.getJwtRefreshExpirationTime() + 's';
    const token = this.authTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, username);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.getJwtRefreshExpirationTime()}`;
    return cookie;
  }

  async validateUser(username: string) {
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
