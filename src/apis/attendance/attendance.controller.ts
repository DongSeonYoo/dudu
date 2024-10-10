import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiExceptionsTest } from 'src/decorators/api-exception.decorator';
import {
  AttendanceListRequestDto,
  AttendanceListResponseDto,
} from './dto/attendance-list.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { AlreadyCheckInException } from './exception/already-check-in.exception';
import { AlreadyCheckOutException } from './exception/already-check-out.exception';
import { StudentNotFoundException } from '../students/exception/student-not-found.exception';
import { NotCheckInException } from './exception/not-check-in.exception';
import { LoginAuthGuard } from 'src/decorators/jwt-auth.decorator';

@ApiTags('Attendance')
@Controller('/api/attendance')
@LoginAuthGuard()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * 등원 체크
   */
  @Post('check-in/:studentIdx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생을 찾지 못했을 경우',
      schema: StudentNotFoundException,
    },
  ])
  @ApiExceptionsTest(HttpStatus.BAD_REQUEST, [
    {
      exampleTitle: '이미 등원한 학생인 경우',
      schema: AlreadyCheckInException,
    },
  ])
  @ApiExceptionsTest(HttpStatus.BAD_REQUEST, [
    {
      exampleTitle: '이미 하원한 학생인 경우',
      schema: AlreadyCheckOutException,
    },
  ])
  async checkIn(@Param('studentIdx') studentIdx: number): Promise<void> {
    await this.attendanceService.checkIn(studentIdx);

    return;
  }

  /**
   * 하원 체크
   */
  @Post('check-out/:studentIdx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생을 찾지 못했을 경우',
      schema: StudentNotFoundException,
    },
  ])
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생이 등원하지 않았을 경우',
      schema: NotCheckInException,
    },
    {
      exampleTitle: '학생이 이미 등원하였을 경우',
      schema: AlreadyCheckOutException,
    },
  ])
  async checkOut(@Param('studentIdx') studentIdx: number) {
    await this.attendanceService.checkOut(studentIdx);

    return;
  }

  /**
   * 학생 출결 내역 조회
   */
  @Get('list')
  @ApiSuccess([AttendanceListResponseDto])
  async getAttendanceList(
    @Query() dateQuery: AttendanceListRequestDto,
  ): Promise<AttendanceListResponseDto[]> {
    return await this.attendanceService.getAttendanceList(dateQuery);
  }
}
