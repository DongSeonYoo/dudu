import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';
import { JwtAccessGuard } from 'src/apis/auth/guards/jwt.guard';
import { ApiExceptions } from './api-exception.decorator';

export const LoginAuthGuard = () => {
  return applyDecorators(
    ApiCookieAuth('accessToken'),
    UseGuards(JwtAccessGuard),
    ApiExceptions({
      exampleTitle: '로그인하지 않았을 경우',
      schema: JwtAuthException,
    }),
  );
};
