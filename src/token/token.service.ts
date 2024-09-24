import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuth } from 'src/apis/auth/interfaces/auth.interface';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';
import { createRandomNumberString } from 'src/utils/random.number';

@Injectable()
export class TokenService {
  private readonly logger: Logger = new Logger(TokenService.name);
  constructor(private readonly jwtService: JwtService) {}

  generateToken() {
    this.logger.log('token generated');

    return this.jwtService.sign({
      number: createRandomNumberString(6),
      loggedInAt: new Date().toISOString(),
    });
  }

  verifyToken(token: string) {
    this.logger.log('token decoded');

    try {
      const payload = <IAuth.IJwtPayload>this.jwtService.verify(token);

      return payload;
    } catch (error) {
      this.logger.error('토큰 검증에 실패했습니다.');
      throw new JwtAuthException();
    }
  }
}
