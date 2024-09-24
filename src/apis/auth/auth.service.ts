import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginRequestDto } from './dto/login.dto';
import { LoginFailedException } from './exceptions/login-failed.exception';
import { RedisService } from 'src/redis/redis.service';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  async login(dto: LoginRequestDto): Promise<string> {
    const adminId = this.configService.get<string>('ADMIN_ID');
    const adminPw = this.configService.get<string>('ADMIN_PASSWPRD');

    if (dto.loginId !== adminId) {
      this.logger.log('아이디가 일치하지 않습니다.');
      throw new LoginFailedException();
    }

    if (dto.password !== adminPw) {
      this.logger.log('비밀번호가 일치하지 않습니다.');
      throw new LoginFailedException();
    }

    return this.tokenService.generateToken();
  }

  async setTokenToRedis(accessToken: string): Promise<void> {
    await this.redisService.set(accessToken);

    return;
  }
}
