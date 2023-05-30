import { Module } from '@nestjs/common';
import { IsAuthenticatedUseCase } from './isAuthenticated.usecases';
import { LoginUseCase } from './login.usecases';
import { LogoutUseCase } from './logout.usecases';
import { LoggerModule } from '../../../infra/logger/logger.module';
import { BcryptModule } from '../../../infra/services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from '../../../infra/config/environment-config/environment-config.module';
import { RepositoriesModule } from '../../../infra/repositories/repositories.module';
import { JwtModule } from '../../../infra/services/jwt/jwt.module';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
  ],
  providers: [IsAuthenticatedUseCase, LoginUseCase, LogoutUseCase],
  exports: [IsAuthenticatedUseCase, LoginUseCase, LogoutUseCase],
})
export class AuthUseCaseModule {}

// private readonly logger: ILogger,
// private readonly jwtTokenService: IJwtService,
// private readonly jwtConfig: JWTConfig,
// private readonly userRepository: UserRepository,
// private readonly bcryptService: IBcryptService,
