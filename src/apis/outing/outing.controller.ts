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
  @ApiException(HttpStatus.BAD_REQUEST)
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
