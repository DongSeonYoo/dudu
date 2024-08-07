import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StudentRepository } from './student.repository';
import {
  CreateStudentRequestDto,
  CreateStudentResponseDto,
} from './dto/create-student.dto';
import { StudentDetailResponseDto } from './dto/student-detail.dto';
import { StudentEntity } from './entity/students.entity';

@Injectable()
export class StudentsService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async createStudent(
    dto: CreateStudentRequestDto,
  ): Promise<CreateStudentResponseDto> {
    await Promise.all([this.checkDuplicateStudentNumber(dto.studentNumber)]);
    const studentEntity = dto.toEntity();

    const student = await this.studentRepository.createStudent(studentEntity);
    return CreateStudentResponseDto.of(student);
  }

  async checkDuplicateStudentNumber(studentNumber: string): Promise<void> {
    const result =
      await this.studentRepository.checkDuplicateStudentNumber(studentNumber);
    if (result) {
      throw new ConflictException('이미 존재하는 학번입니다.');
    }
  }

  async getStudentDetail(
    studentIdx: number,
  ): Promise<StudentDetailResponseDto> {
    const student = await this.studentRepository.getStudentDetail(studentIdx);
    if (!student) {
      throw new NotFoundException('학생을 찾을 수 없습니다.');
    }

    return StudentDetailResponseDto.of(student);
  }
}
