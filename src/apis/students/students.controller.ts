import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { ApiException } from 'src/decorators/api-exception.decorator';
import { StudentDetailResponseDto } from './dto/student-detail.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * 학생을 생성합니다
   *
   * @param createStudentDto
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiSuccess(CreateStudentResponseDto)
  @ApiException(HttpStatus.CONFLICT, '이미 존재하는 학번입니다.')
  async createStudent(@Body() createStudentDto: CreateStudentRequestDto) {
    return await this.studentsService.createStudent(createStudentDto);
  }

  /**
   * 학생 정보 상세 조회
   *
   * @param idx
   */
  @Get(':idx')
  @HttpCode(HttpStatus.OK)
  @ApiSuccess(StudentDetailResponseDto)
  @ApiException(HttpStatus.NOT_FOUND, '학생을 찾을 수 없습니다.')
  async getStudentDetail(@Param('idx') idx: number) {
    return await this.studentsService.getStudentDetail(idx);
  }
}
