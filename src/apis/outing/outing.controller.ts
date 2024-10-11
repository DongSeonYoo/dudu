import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OutingService } from './outing.service';
import { ApiTags } from '@nestjs/swagger';
import { GoOutingRequestDto } from './dto/go-outing.dto';
import { ApiExceptions } from 'src/decorators/api-exception.decorator';
import { NotCheckInException } from '../attendance/exception/not-check-in.exception';
import { AlreadyOutingException } from './exception/already-outing.exception';
import { ReturnOutingRequestDto } from './dto/return-outing.dto';
import { NotOutingException } from './exception/not-outing.exception';
import { AlreadyCheckOutException } from '../attendance/exception/already-check-out.exception';

@ApiTags('Outing')
@Controller('/api/outing')
export class OutingController {
  constructor(private readonly outingService: OutingService) {}

  /**
   * 외출
   */
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptions(
    {
      exampleTitle: '이미 외출 중인 학생인 경우',
      schema: AlreadyOutingException,
    },
    {
      exampleTitle: '등원하지 않은 학생인 경우',
      schema: NotCheckInException,
    },
    {
      exampleTitle: '이미 하원 한 학생인 경우',
      schema: AlreadyCheckOutException,
    },
  )
  async goOuting(@Body() goOutingRequestDto: GoOutingRequestDto) {
    await this.outingService.goOuting(goOutingRequestDto);

    return;
  }

  /**
   * 외출 복귀
   */
  @Post('return')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptions({
    exampleTitle: '외출 중인 학생이 아닐 경우',
    schema: NotOutingException,
  })
  async returnFromOuting(
    @Body() returnOutingRequestDto: ReturnOutingRequestDto,
  ) {
    return await this.outingService.returnFromOuting(returnOutingRequestDto);
  }
}
