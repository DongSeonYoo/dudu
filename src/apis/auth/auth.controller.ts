import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { ApiExceptions } from 'src/decorators/api-exception.decorator';
import { LoginFailedException } from './exceptions/login-failed.exception';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 로그인
   */
  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiSuccess(LoginResponseDto)
  @ApiExceptions(LoginFailedException)
  async login(
    @Body() input: LoginRequestDto,
    @Res({ passthrough: false }) res: Response,
  ) {
    const adminAccessToken = await this.authService.login(input);

    // Set token to redis
    await this.authService.setTokenToRedis(adminAccessToken);
    res.cookie('accessToken', adminAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.send();
  }
}
