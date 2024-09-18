import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OutingService } from './outing.service';
import { ApiTags } from '@nestjs/swagger';
import { GoOutingRequestDto } from './dto/go-outing.dto';
import { ApiExceptions } from 'src/decorators/api-exception.decorator';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import { NotCheckInException } from '../attendance/exception/not-check-in.exception';
import { AlreadyOutingException } from './exception/already-outing.exception';

@ApiTags('Outing')
@Controller('outing')
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
