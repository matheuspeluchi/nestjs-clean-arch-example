import { UserRepository } from '../../../interfaces/user.repository';
import { BcryptService } from '../../../../infra/services/bcrypt/bcrypt.service';
import { UserModel } from '../../../user/models/user.model';
import { IsAuthenticatedUseCase } from '../isAuthenticated.usecases';
import { LoginUseCase } from '../login.usecases';
import { LogoutUseCase } from '../logout.usecases';
import { LoggerService } from '../../../../infra/logger/logger.service';
import { AuthService } from '../../../../infra/interfaces/jwt-service.interface';
import { EnvironmentConfig } from '../../../../infra/interfaces/environment.interface';

describe('uses_cases/authentication', () => {
  let loginUseCases: LoginUseCase;
  let logoutUseCases: LogoutUseCase;
  let isAuthenticated: IsAuthenticatedUseCase;
  let logger: LoggerService;
  let authService: AuthService;
  let jwtConfig: EnvironmentConfig;
  let adminUserRepo: UserRepository;
  let bcryptService: BcryptService;

  beforeEach(() => {
    logger = {} as LoggerService;
    logger.log = jest.fn();

    authService.createToken = jest.fn();

    jwtConfig.getJwtExpirationTime = jest.fn();
    jwtConfig.getJwtSecret = jest.fn();
    jwtConfig.getJwtRefreshSecret = jest.fn();
    jwtConfig.getJwtRefreshExpirationTime = jest.fn();

    adminUserRepo = {} as UserRepository;
    adminUserRepo.getUserByUsername = jest.fn();
    adminUserRepo.updateLastLogin = jest.fn();
    adminUserRepo.updateRefreshToken = jest.fn();

    bcryptService = {} as BcryptService;
    bcryptService.compare = jest.fn();
    bcryptService.hash = jest.fn();

    loginUseCases = new LoginUseCase(
      logger,
      authService,
      jwtConfig,
      adminUserRepo,
      bcryptService,
    );
    logoutUseCases = new LogoutUseCase();
    isAuthenticated = new IsAuthenticatedUseCase(adminUserRepo);
  });

  describe('creating a cookie', () => {
    it('should return a cookie', async () => {
      const expireIn = '200';
      const token = 'token';
      (jwtConfig.getJwtSecret as jest.Mock).mockReturnValue(() => 'secret');
      (jwtConfig.getJwtExpirationTime as jest.Mock).mockReturnValue(expireIn);
      (authService.createToken as jest.Mock).mockReturnValue(token);

      expect(await loginUseCases.getCookieWithJwtToken('username')).toEqual(
        `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expireIn}`,
      );
    });
    it('should return a refresh cookie', async () => {
      const expireIn = '200';
      const token = 'token';
      (jwtConfig.getJwtRefreshSecret as jest.Mock).mockReturnValue(
        () => 'secret',
      );
      (jwtConfig.getJwtRefreshExpirationTime as jest.Mock).mockReturnValue(
        expireIn,
      );
      (authService.createToken as jest.Mock).mockReturnValue(token);
      (bcryptService.hash as jest.Mock).mockReturnValue(
        Promise.resolve('hashed password'),
      );
      (adminUserRepo.updateRefreshToken as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );

      expect(
        await loginUseCases.getCookieWithJwtRefreshToken('username'),
      ).toEqual(`Refresh=${token}; HttpOnly; Path=/; Max-Age=${expireIn}`);
      expect(adminUserRepo.updateRefreshToken).toBeCalledTimes(1);
    });
  });

  describe('Validation refresh token', () => {
    it('should return null because user not found', async () => {
      (adminUserRepo.getUserByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );

      expect(
        await loginUseCases.getUserIfRefreshTokenMatches(
          'refresh token',
          'username',
        ),
      ).toEqual(null);
    });

    it('should return null because user not found', async () => {
      const user: UserModel = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refresh token',
      };
      (adminUserRepo.getUserByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(false),
      );

      expect(
        await loginUseCases.getUserIfRefreshTokenMatches(
          'refresh token',
          'username',
        ),
      ).toEqual(null);
    });

    it('should return user', async () => {
      const user: UserModel = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refresh token',
      };
      (adminUserRepo.getUserByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(true),
      );

      expect(
        await loginUseCases.getUserIfRefreshTokenMatches(
          'refresh token',
          'username',
        ),
      ).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should return an array to invalid the cookie', async () => {
      expect(await logoutUseCases.execute()).toEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ]);
    });
  });

  describe('isAuthenticated', () => {
    it('should return an array to invalid the cookie', async () => {
      const user: UserModel = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refresh token',
      };
      (adminUserRepo.getUserByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );

      const { password, ...rest } = user;

      expect(await isAuthenticated.execute('username')).toEqual(rest);
    });
  });
});
