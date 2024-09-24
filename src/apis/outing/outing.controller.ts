import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OutingService } from './outing.service';
import { ApiTags } from '@nestjs/swagger';
import { GoOutingRequestDto } from './dto/go-outing.dto';
import { ApiExceptions } from 'src/decorators/api-exception.decorator';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import { NotCheckInException } from '../attendance/exception/not-check-in.exception';
import { AlreadyOutingException } from './exception/already-outing.exception';
import { StratedAtEndedAtException } from 'src/exceptions/started-ended-at.exception';
import { ReturnOutingRequestDto } from './dto/return-outing.dto';
import { NotOutingException } from './exception/not-outing.exception';

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
    StudentNotFoundException,
    NotCheckInException,
    AlreadyOutingException,
    StratedAtEndedAtException,
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
  @ApiExceptions(NotOutingException)
  async returnFromOuting(
    @Body() returnOutingRequestDto: ReturnOutingRequestDto,
  ) {
    return await this.outingService.returnFromOuting(returnOutingRequestDto);
  }
}
