import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnrollmentEntity } from './entity/enrollment.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEnrollment(
    studentIdx: number,
    input: EnrollmentEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<EnrollmentEntity> {
    const enrollment = await (tx ?? this.prisma).enrollment.create({
      data: {
        studentIdx: studentIdx,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
        amount: input.amount,
      },
    });

    return EnrollmentEntity.from(enrollment);
  }
}
