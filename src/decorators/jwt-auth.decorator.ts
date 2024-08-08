import { HttpStatus, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiException } from './api-exception.decorator';

export const LoginAuth = () => {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(),
    ApiException(HttpStatus.UNAUTHORIZED, '로그인 필요한 서비스입니다'),
  );
};
