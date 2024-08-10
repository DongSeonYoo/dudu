import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags } from '@nestjs/swagger';
import { CheckInRequestDto } from './dto/check-in.dto';
import { CheckOutRequestDto } from './dto/check-out.dto';
import { ApiException } from 'src/decorators/api-exception.decorator';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * 등원 체크
   */
  @Post('check-in')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(HttpStatus.NOT_FOUND, '존재하지 않는 학생입니다.')
  @ApiException(
    HttpStatus.BAD_REQUEST,
    '이미 등원한 학생입니다.',
    '이미 하원한 학생입니다.',
  )
  async checkIn(@Body() checkInDto: CheckInRequestDto): Promise<void> {
    await this.attendanceService.checkIn(checkInDto);

    return;
  }

  /**
   * 하원 체크
   */
  @Post('check-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(HttpStatus.NOT_FOUND, '존재하지 않는 학생입니다.')
  @ApiException(
    HttpStatus.BAD_REQUEST,
    '등원하지 않은 학생입니다.',
    '이미 하원한 학생입니다.',
  )
  async checkOut(@Body() checkOutDto: CheckOutRequestDto) {
    await this.attendanceService.checkOut(checkOutDto);

    return;
  }
}
