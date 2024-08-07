import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentEntity } from './entity/students.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createStudent(
    input: StudentEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<StudentEntity> {
    return await (tx ?? this.prisma).student
      .create({
        data: {
          ...input,
        },
      })
      .then(StudentEntity.from);
  }

  async checkDuplicateStudentNumber(studentNumber: string): Promise<boolean> {
    const student = await this.prisma.student.findFirst({
      where: {
        studentNumber,
        deletedAt: null,
      },
    });

    return !!student;
  }

  async getStudentDetail(
    studentIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<StudentEntity | null> {
    return await (tx ?? this.prisma).student
      .findUnique({
        where: {
          idx: studentIdx,
          deletedAt: null,
        },
      })
      .then((student) => {
        return student ? StudentEntity.from(student) : null;
      });
  }
}