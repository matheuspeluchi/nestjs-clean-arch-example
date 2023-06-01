import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EncryptionService } from '../../../infra/interfaces/encryption.interface';
import {
  IJwtServicePayload,
  JwtService,
} from '../../../infra/interfaces/jwt-service.interface';
import { UserRepository } from '../../interfaces/user.repository';
import { LoggerService } from '../../../infra/logger/logger.service';
import { EnvironmentConfig } from '../../../infra/interfaces/environment.interface';
import { Usecase } from '../../interfaces/useCase.interface';
import { AuthenticatedDTO } from '../dto/authenticate.dto';

@Injectable()
export class RefreshUseCase extends Usecase<string, AuthenticatedDTO> {
  constructor(
    private readonly logger: LoggerService,
    private readonly tokenService: JwtService,
    private readonly configService: EnvironmentConfig,
    private readonly userRepository: UserRepository,
    private readonly bcryptService: EncryptionService,
  ) {
    super();
  }

  async execute(token: string) {
    const refreshSecret = this.configService.getJwtRefreshSecret();

    await this.tokenService.verify(token, refreshSecret);
    const username = this.tokenService.getUserFromToken(token);
    const isValidUser = await this.validateUser(username);
    if (!isValidUser) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const matchRefresh = this.refreshTokenMatches(token, username);

    if (!matchRefresh) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload: IJwtServicePayload = { username };
    const secret = this.configService.getJwtSecret();
    const tokenExpiresIn = this.configService.getJwtExpirationTime() + 's';
    const refreshExpiresIn =
      this.configService.getJwtRefreshExpirationTime() + 's';
    const accessTokenCookie = this.tokenService.createToken(
      payload,
      secret,
      tokenExpiresIn,
    );
    const refreshTokenCookie = this.tokenService.createToken(
      payload,
      refreshSecret,
      refreshExpiresIn,
    );
    await this.setCurrentRefreshToken(refreshTokenCookie, username);
    this.logger.log(
      'LoginUseCase execute',
      `The user ${username} have been logged.`,
    );
    return { accessTokenCookie, refreshTokenCookie };
  }

  private async validateUser(username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    return user;
  }

  private async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken,
    );
    await this.userRepository.updateRefreshToken(
      username,
      currentHashedRefreshToken,
    );
  }

  private async refreshTokenMatches(refreshToken: string, username: string) {
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
