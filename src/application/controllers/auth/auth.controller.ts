import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthLoginDto } from './dto/auth-dto.class';
import { IsAuthPresenter } from '../../presenters/auth/auth.presenter';

import { IsAuthenticatedUseCase } from '../../../domain/auth/useCases/isAuthenticated.usecases';
import { LoginUseCase } from '../../../domain/auth/useCases/login.usecases';
import { LogoutUseCase } from '../../../domain/auth/useCases/logout.usecases';
import { Usecase } from '../../../infra/adapters/useCase.interface';
import { Response } from 'express';
import { AuthenticatedDTO } from '../../../domain/auth/dto/authenticate.dto';
import { UserDTO } from '../../../domain/auth/dto/user.dto';
import JwtRefreshGuard from '../../../infra/common/guards/jwtRefresh.guard';
import { JwtAuthGuard } from '../../../infra/common/guards/jwtAuth.guard';
import { ApiResponseType } from '../../../infra/common/swagger/response.decorator';
import { LogoutDTO } from '../../../domain/auth/dto/logout.dto';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(LoginUseCase)
    private readonly loginUsecase: Usecase<AuthenticatedDTO>,
    @Inject(LogoutUseCase)
    private readonly logoutUsecase: Usecase<LogoutDTO>,
    @Inject(IsAuthenticatedUseCase)
    private readonly isAuthUsecase: Usecase<UserDTO>,
  ) {}

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Res() response: Response) {
    const { username, password } = auth;

    const cookies = await this.loginUsecase.execute(username, password);
    const { accessTokenCookie, refreshTokenCookie } = cookies;
    response.cookie('authorization', accessTokenCookie);
    response.cookie('refresh', refreshTokenCookie);
    return response.json({ message: 'Login successful' });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Res() response: Response): Promise<string> {
    const cookie: LogoutDTO = await this.logoutUsecase.execute();
    response.cookie('authorization', cookie.authorization);
    response.cookie('refresh', cookie.refresh);
    return 'Logout successful';
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecase.execute(request.user.username);
    const response = new IsAuthPresenter();
    response.username = user.username;
    return response;
  }

  // @Get('refresh')
  // @UseGuards(JwtRefreshGuard)
  // @ApiBearerAuth()
  // async refresh(@Req() request: any) {
  //   const accessTokenCookie = await this.loginUsecase.getCookieWithJwtToken(
  //     request.user.username,
  //   );
  //   request.res.setHeader('Set-Cookie', accessTokenCookie);
  //   return 'Refresh successful';
  // }
}
