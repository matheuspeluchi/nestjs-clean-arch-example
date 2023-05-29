import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
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
import { UsecasesProxyModule } from '../../../infra/usecases-proxy/usecases-proxy.module';

import { UseCaseProxy } from '../../../infra/usecases-proxy/usecases-proxy';
import { JwtAuthGuard } from '../../../infra/common/guards/jwtAuth.guard';
import JwtRefreshGuard from '../../../infra/common/guards/jwtRefresh.guard';
import { LoginGuard } from '../../../infra/common/guards/login.guard';
import { ApiResponseType } from '../../../infra/common/swagger/response.decorator';
import { IsAuthenticatedUseCases } from '../../../domain/useCases/auth/isAuthenticated.usecases';
import { LoginUseCases } from '../../../domain/useCases/auth/login.usecases';
import { LogoutUseCases } from '../../../domain/useCases/auth/logout.usecases';

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
    private readonly loginUsecaseProxy: LoginUseCases,
    private readonly logoutUsecaseProxy: LogoutUseCases,
    private readonly isAuthUsecaseProxy: IsAuthenticatedUseCases,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const accessTokenCookie =
      await this.loginUsecaseProxy.getCookieWithJwtToken(auth.username);
    const refreshTokenCookie =
      await this.loginUsecaseProxy.getCookieWithJwtRefreshToken(auth.username);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return 'Login successful';
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUsecaseProxy.execute();
    request.res.setHeader('Set-Cookie', cookie);
    return 'Logout successful';
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecaseProxy.execute(request.user.username);
    const response = new IsAuthPresenter();
    response.username = user.username;
    return response;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: any) {
    const accessTokenCookie =
      await this.loginUsecaseProxy.getCookieWithJwtToken(request.user.username);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return 'Refresh successful';
  }
}
