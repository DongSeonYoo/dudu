import { PrismaService } from 'src/prisma/prisma.service';
import { ParentEntity } from './entity/parent.entity';
import { Prisma } from '@prisma/client';

export class ParentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createParent(
    studentIdx: number,
    input: ParentEntity,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx ?? this.prisma).parent.create({
      data: {
        studentIdx: studentIdx,
        name: input.name,
        phoneNumber: input.phoneNumber,
      },
    });

    return;
  }
}
