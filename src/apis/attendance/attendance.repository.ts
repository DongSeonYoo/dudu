import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceEntity } from './entity/attendance.entity';
import { Injectable } from '@nestjs/common';
import { DateUtilService } from 'src/utils/attendance.util';

@Injectable()
export class AttendanceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateUtilService: DateUtilService,
  ) {}

  async findAttendance(
    studentIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<AttendanceEntity | null> {
    const attendace = await (tx ?? this.prisma).attendance.findFirst({
      where: {
        studentIdx: studentIdx,
        Student: {
          deletedAt: null,
        },
        createdAt: {
          gte: this.dateUtilService.getToday(),
          lt: this.dateUtilService.getTommorow(),
        },
      },
    });

    return attendace ? AttendanceEntity.from(attendace) : null;
  }

  async checkIn(
    studentIdx: number,
    attendace: AttendanceEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {}

  async checkOut(
    studentIdx: number,
    attendace: AttendanceEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {}
}
