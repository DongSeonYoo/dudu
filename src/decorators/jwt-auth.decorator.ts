import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { ApiExceptions } from './api-exception.decorator';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';
import { JwtAccessGuard } from 'src/apis/auth/guards/jwt.guard';

export const LoginAuthGuard = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),
    UseGuards(JwtAccessGuard),
    ApiExceptions(JwtAuthException),
  );
};
