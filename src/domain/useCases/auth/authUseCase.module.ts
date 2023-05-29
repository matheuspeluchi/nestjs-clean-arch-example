import { Module } from '@nestjs/common';
import { IsAuthenticatedUseCases } from './isAuthenticated.usecases';
import { LoginUseCases } from './login.usecases';
import { LogoutUseCases } from './logout.usecases';
import { LoggerModule } from '../../../infra/logger/logger.module';
import { JwtModule } from '../../../infra/services/jwt/jwt.module';
import { BcryptModule } from '../../../infra/services/bcrypt/bcrypt.module';

@Module({
  imports: [LoggerModule, JwtModule, BcryptModule],
  providers: [IsAuthenticatedUseCases, LoginUseCases, LogoutUseCases],
  exports: [IsAuthenticatedUseCases, LoginUseCases, LogoutUseCases],
})
export class AuthUseCaseModule {}

// private readonly logger: ILogger,
// private readonly jwtTokenService: IJwtService,
// private readonly jwtConfig: JWTConfig,
// private readonly userRepository: UserRepository,
// private readonly bcryptService: IBcryptService,
