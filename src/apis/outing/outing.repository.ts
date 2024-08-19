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
  ): Promise<void> {
    await (tx ?? this.prisma).outing.create({
      data: {
        studentIdx: input.studentIdx,
        attendanceIdx: input.attendanceIdx,
        reason: input.reason,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
    });

    return;
  }
}
