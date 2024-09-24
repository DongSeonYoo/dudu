import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  /**
   * 로그인 아이디
   */
  @IsNotEmpty()
  @IsString()
  loginId: string;

  /**
   * 비밀번호
   */
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginResponseDto {
  /**
   * JWT 토큰
   */
  accessToken: string;
}
