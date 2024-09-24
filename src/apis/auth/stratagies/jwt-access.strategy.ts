import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IAuth } from '../interfaces/auth.interface';
import { RedisService } from 'src/redis/redis.service';
import { TokenService } from 'src/token/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthException } from 'src/exceptions/jwt-auth.exception';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger: Logger = new Logger(JwtAccessStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: IAuth.IJwtPayload) {
    const session = await this.redisService.get('admin');
    if (!session) {
      this.logger.error('세션을 찾을 수 없습니다.');

      throw new JwtAuthException();
    }

    const sessionInfo = this.tokenService.verifyToken(session);
    if (sessionInfo.number !== payload.number) {
      this.logger.error('세션 정보가 일치하지 않습니다.');

      throw new JwtAuthException();
    }

    if (payload.loggedInAt < sessionInfo.loggedInAt) {
      this.logger.error('세션이 만료되었습니다.');

      throw new JwtAuthException();
    }

    return payload;
  }
}
