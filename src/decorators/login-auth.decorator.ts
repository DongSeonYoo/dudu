import {
  applyDecorators,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessGuard } from 'src/apis/auth/guards/jwt.guard';
import { ApiExceptions } from './api-exception.decorator';

export const LoginAuthGuard = () => {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAccessGuard),
    ApiExceptions(UnauthorizedException),
  );
};
