import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EncryptionService } from '../../../infra/adapters/encryption.interface';
import {
  IJwtServicePayload,
  AuthService,
} from '../../../infra/adapters/auth.interface';
import { UserRepository } from '../../../infra/repositories/user/user.repository';
import { LoggerService } from '../../../infra/logger/logger.service';
import { EnvironmentConfig } from '../../../infra/adapters/environment.mixin';
import { Usecase } from '../../../infra/adapters/useCase.interface';
import { AuthenticatedDTO } from '../dto/authenticate.dto';

@Injectable()
export class LoginUseCase extends Usecase<AuthenticatedDTO> {
  constructor(
    private readonly logger: LoggerService,
    private readonly authTokenService: AuthService,
    private readonly configService: EnvironmentConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: EncryptionService,
  ) {
    super();
  }

  async execute(username: string, password: string) {
    let isValidUsernameAndPassword = false;
    const user = await this.userRepository.getUserByUsername(username);
    if (user)
      isValidUsernameAndPassword = await this.bcryptService.compare(
        password,
        user.password,
      );

    if (isValidUsernameAndPassword) {
      const accessTokenCookie = await this.getCookieWithJwtToken(username);
      const refreshTokenCookie = await this.getCookieWithJwtRefreshToken(
        username,
      );
      return { accessTokenCookie, refreshTokenCookie };
    }

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
    return this.authTokenService.createToken(payload, secret, expiresIn);
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
    return token;
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
