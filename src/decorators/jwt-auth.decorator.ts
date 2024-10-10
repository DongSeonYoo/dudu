import { HttpStatus, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { ApiExceptionsTest } from './api-exception.decorator';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';
import { JwtAccessGuard } from 'src/apis/auth/guards/jwt.guard';

export const LoginAuthGuard = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),
    UseGuards(JwtAccessGuard),
    ApiExceptionsTest(HttpStatus.UNAUTHORIZED, [
      {
        exampleTitle: '로그인하지 않았을 경우',
        schema: JwtAuthException,
      },
    ]),
  );
};
