import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiException } from 'src/decorators/api-exception.decorator';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * 등원 체크
   */
  @Post('check-in/:studentIdx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(HttpStatus.NOT_FOUND, '존재하지 않는 학생입니다.')
  @ApiException(
    HttpStatus.BAD_REQUEST,
    '이미 등원한 학생입니다.',
    '이미 하원한 학생입니다.',
  )
  async checkIn(@Param('studentIdx') studentIdx: number): Promise<void> {
    await this.attendanceService.checkIn(studentIdx);

    return;
  }

  /**
   * 하원 체크
   */
  @Post('check-out/:studentIdx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(HttpStatus.NOT_FOUND, '존재하지 않는 학생입니다.')
  @ApiException(
    HttpStatus.BAD_REQUEST,
    '등원하지 않은 학생입니다.',
    '이미 하원한 학생입니다.',
  )
  async checkOut(@Param('studentIdx') studentIdx: number) {
    await this.attendanceService.checkOut(studentIdx);

    return;
  }
}
