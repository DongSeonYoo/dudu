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
  ValidationPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { ApiSuccess } from 'src/decorators/api-success.decorator';
import { ApiException } from 'src/decorators/api-exception.decorator';
import { StudentDetailResponseDto } from './dto/student-detail.dto';
import { UpdateStudentRequestDto } from './dto/update-student.dto';
import { ApiOperation, ApiProperty, ApiTags, PickType } from '@nestjs/swagger';
import { ParseNumberStringPipe } from 'src/filters/parse-number-string.pipe';
import { StudentEntity } from './entity/students.entity';

@ApiTags('Student')
@Controller('student')
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

  /**
   * 학생 정보 수정
   */
  @Put(':idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(HttpStatus.NOT_FOUND, '학생을 찾을 수 없습니다.')
  @ApiException(HttpStatus.CONFLICT, '이미 존재하는 학번입니다.')
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
  @ApiException(HttpStatus.NOT_FOUND, '학생을 찾을 수 없습니다.')
  async deleteStudent(@Param('idx') studentIdx: number) {
    await this.studentsService.deleteStudent(studentIdx);

    return;
  }

  /**
   * 학생번호로 학생 정보 조회
   */
  @Get('number/:studentNumber')
  @HttpCode(HttpStatus.OK)
  @ApiException(HttpStatus.NOT_FOUND, '해당하는 학생이 존재하지 않습니다')
  @ApiException(HttpStatus.BAD_REQUEST, 'Not convertible string to number')
  @ApiSuccess(PickType(StudentEntity, ['name']))
  async getStudentByStudentNumber(
    @Param('studentNumber', ParseNumberStringPipe) studentNumber: string,
  ) {
    return await this.studentsService.getStudentNameByStudentNumber(
      studentNumber,
    );
  }
}
