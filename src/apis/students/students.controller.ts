import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { StudentDetailResponseDto } from './dto/student-detail.dto';
import { UpdateStudentRequestDto } from './dto/update-student.dto';
import { ApiOperation, ApiProperty, ApiTags, PickType } from '@nestjs/swagger';
import { ParseNumberStringPipe } from 'src/filters/parse-number-string.pipe';
import { StudentEntity } from './entity/students.entity';
import { StudentNotFoundException } from './exception/student-not-found.exception';
import { NumberStringException } from 'src/exceptions/number-string.exception';
import { StudentNumberConflictException } from './exception/student-number-conflict.exception';
import { ApiExceptionsTest } from 'src/decorators/api-exception.decorator';

@ApiTags('Student')
@Controller('/api/student')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * 학생을 생성합니다
   *
   * @param createStudentDto
   */
  @ApiOperation({
    description:
      '학생과 학생의 부모님을 생성하고, 학생 등록 정보를 생성합니다.',
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiSuccess(CreateStudentResponseDto)
  @ApiExceptionsTest(HttpStatus.CONFLICT, [
    {
      exampleTitle: '중복된 학생 번호가 존재할 경우',
      schema: StudentNumberConflictException,
    },
  ])
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
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생을 찾지 못했을 경우',
      schema: StudentNotFoundException,
    },
  ])
  async getStudentDetail(@Param('idx', ParseIntPipe) idx: number) {
    return await this.studentsService.getStudentDetail(idx);
  }

  /**
   * 학생 정보 수정
   */
  @Put(':idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생을 찾지 못했을 경우',
      schema: StudentNotFoundException,
    },
  ])
  @ApiExceptionsTest(HttpStatus.CONFLICT, [
    {
      exampleTitle: '학생 번호가 중복되었을 경우',
      schema: StudentNumberConflictException,
    },
  ])
  async updateStudent(
    @Param('idx') studentIdx: number,
    @Body() updateStudentDto: UpdateStudentRequestDto,
  ) {
    await this.studentsService.updateStudent(studentIdx, updateStudentDto);

    return;
  }

  /**
   * 학생 정보 삭제
   */
  @Delete(':idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생을 찾지 못했을 경우',
      schema: StudentNotFoundException,
    },
  ])
  async deleteStudent(@Param('idx') studentIdx: number) {
    await this.studentsService.deleteStudent(studentIdx);

    return;
  }

  /**
   * 학생번호로 학생 정보 조회
   */
  @Get('number/:studentNumber')
  @HttpCode(HttpStatus.OK)
  @ApiSuccess(PickType(StudentEntity, ['name']))
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '학생을 찾지 못했을 경우',
      schema: StudentNotFoundException,
    },
  ])
  async getStudentByStudentNumber(
    @Param('studentNumber', ParseNumberStringPipe) studentNumber: string,
  ) {
    return await this.studentsService.getStudentNameByStudentNumber(
      studentNumber,
    );
  }
}
