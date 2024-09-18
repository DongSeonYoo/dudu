import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiExceptions } from './api-exception.decorator';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';

export const LoginAuth = () => {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(),
    ApiExceptions(JwtAuthException),
  );
};
