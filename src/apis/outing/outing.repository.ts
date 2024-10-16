import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { OutingEntity } from './entity/outing.entity';
import { DateUtilService } from 'src/utils/date-util/date-util.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OutingRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dateUtilService: DateUtilService,
  ) {}
  async goOuting(
    input: OutingEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<OutingEntity> {
    const outing = await (tx ?? this.prisma).outing.create({
      data: {
        studentIdx: input.studentIdx,
        attendanceIdx: input.attendanceIdx,
        reason: input.reason,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
    });

    return OutingEntity.from(outing);
  }

  async findOutingByIdx(
    studentIdx: number,
    attendanceIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<OutingEntity | null> {
    const outingResult = await (tx ?? this.prisma).outing.findUnique({
      where: {
        attendanceIdx_studentIdx: {
          attendanceIdx,
          studentIdx,
        },
      },
    });

    return outingResult ? OutingEntity.from(outingResult) : null;
  }

  async returnOuting(outing: OutingEntity, tx?: Prisma.TransactionClient) {
    await (tx ?? this.prisma).outing.delete({
      where: {
        attendanceIdx_studentIdx: {
          studentIdx: outing.studentIdx,
          attendanceIdx: outing.attendanceIdx,
        },
      },
    });

    return;
  }
}
