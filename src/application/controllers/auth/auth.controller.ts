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

import { CredentialsDTO } from './dto/credentials.dto';
import { IsAuthPresenter } from '../../presenters/auth/auth.presenter';

import { LoginUseCase } from '../../../domain/auth/useCases/login.usecases';
import { LogoutUseCase } from '../../../domain/auth/useCases/logout.usecases';
import { Usecase } from '../../../domain/interfaces/useCase.interface';
import { Request, Response } from 'express';
import { AuthenticatedDTO } from '../../../domain/auth/dto/authenticate.dto';
import { JwtAuthGuard } from '../../../infra/common/guards/jwtAuth.guard';
import { LogoutDTO } from '../../../domain/auth/dto/logout.dto';
import { RefreshUseCase } from '../../../domain/auth/useCases/refresh.usecases';

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
    private readonly loginUsecase: Usecase<CredentialsDTO, AuthenticatedDTO>,
    @Inject(RefreshUseCase)
    private readonly refreshUseCase: Usecase<string, AuthenticatedDTO>,
    @Inject(LogoutUseCase)
    private readonly logoutUsecase: Usecase<LogoutDTO>,
  ) {}

  @Post('login')
  @ApiBody({ type: CredentialsDTO })
  @ApiOperation({ description: 'login' })
  async login(@Body() credentials: CredentialsDTO, @Res() response: Response) {
    const cookies = await this.loginUsecase.execute(credentials);
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
    response.cookie('Authorization', cookie.authorization);
    response.cookie('refresh', cookie.refresh);
    return 'Logout successful';
  }

  @Get('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: Request, @Res() response: Response) {
    const token = request.cookies['refresh'];
    const newTokens = await this.refreshUseCase.execute(token);
    response.cookie('authorization', newTokens.accessTokenCookie);
    response.cookie('refresh', newTokens.refreshTokenCookie);
    return response.json({ message: 'Refresh successful' });
  }
}
