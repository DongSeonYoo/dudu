import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OutingService } from './outing.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/decorators/api-exception.decorator';
import { GoOutingRequestDto } from './dto/go-outing.dto';

@ApiTags('Outing')
@Controller('outing')
export class OutingController {
  constructor(private readonly outingService: OutingService) {}

  /**
   * 외출
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(
    HttpStatus.BAD_REQUEST,
    '학생이 존재하지 않습니다',
    '등원하지 않은 학생입니다',
    '이미 외출 중인 학생입니다',
    '외출 시작 시간은 현재 시간보다 이후이어야 하며, 외출 종료 시간보다 이전이어야 합니다',
  )
  async goOuting(@Body() goOutingRequestDto: GoOutingRequestDto) {
    await this.outingService.goOuting(goOutingRequestDto);

    return;
  }

  // /**
  //  * 외출 복귀
  //  */
  // @Post()
  // @HttpCode(HttpStatus.NO_CONTENT)
  // returnFromOuting() {}
}
