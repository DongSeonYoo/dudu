import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AttendanceEntity } from './entity/attendance.entity';
import { Injectable } from '@nestjs/common';
import { StudentEntity } from '../students/entity/students.entity';
import { DateUtilService } from 'src/utils/date-util/date-util.service';

@Injectable()
export class AttendanceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateUtilService: DateUtilService,
  ) {}

  async findTodayAttendance(
    studentIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<AttendanceEntity | null> {
    const attendance = await (tx ?? this.prisma).attendance.findFirst({
      where: {
        studentIdx: studentIdx,
        Student: {
          deletedAt: null,
        },
        createdAt: {
          gte: this.dateUtilService.getBeginningOfDate(),
          lt: this.dateUtilService.getBeginningOfDateTommorw(),
        },
      },
    });

    return attendance ? AttendanceEntity.from(attendance) : null;
  }

  async checkIn(
    studentIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await (tx ?? this.prisma).attendance.create({
      data: {
        studentIdx: studentIdx,
        checkInAt: new Date(),
      },
    });

    return;
  }

  async checkOut(
    attendanceIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await (tx ?? this.prisma).attendance.update({
      data: {
        checkOutAt: new Date(),
      },
      where: {
        idx: attendanceIdx,
        Student: {
          deletedAt: null,
        },
      },
    });

    return;
  }

  async getAttendanceListOfDate(
    date: Date,
  ): Promise<
    Array<{ student: StudentEntity; attendance: AttendanceEntity | null }>
  > {
    const result = await this.prisma.student.findMany({
      include: {
        Attendance: {
          where: {
            createdAt: {
              gte: this.dateUtilService.getBeginningOfDate(date),
              lt: this.dateUtilService.getBeginningOfDateTommorw(date),
            },
          },
        },
      },
      where: {
        deletedAt: null,
      },
    });

    return result.map((res) => ({
      student: StudentEntity.from(res),
      attendance:
        res.Attendance.length === 0
          ? null
          : AttendanceEntity.from(res.Attendance[0]),
    }));
  }

  async changeOutingState(
    attendanceIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    await (tx ?? this.prisma).attendance.update({
      data: {
        isOuting: true,
      },
      where: {
        idx: attendanceIdx,
      },
    });

    return;
  }
}
