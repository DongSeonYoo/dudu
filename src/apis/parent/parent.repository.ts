import { PrismaService } from 'src/prisma/prisma.service';
import { ParentEntity } from './entity/parent.entity';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ParentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findParentByIdx(
    parentIdx: number,
    tx?: Prisma.TransactionClient,
  ): Promise<ParentEntity | null> {
    const parent = await (tx ?? this.prisma).parent.findFirst({
      where: {
        idx: parentIdx,
        Student: {
          deletedAt: null,
        },
      },
    });

    return parent ? ParentEntity.from(parent) : null;
  }

  async createParent(
    studentIdx: number,
    input: ParentEntity,
    tx?: Prisma.TransactionClient,
  ) {
    const createdParent = await (tx ?? this.prisma).parent.create({
      data: {
        studentIdx: studentIdx,
        name: input.name,
        phoneNumber: input.phoneNumber,
      },
    });

    return ParentEntity.from(createdParent);
  }

  async updateParent(
    parentIdx: number,
    input: Partial<ParentEntity>,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx ?? this.prisma).parent.update({
      data: {
        name: input.name,
        phoneNumber: input.phoneNumber,
      },
      where: {
        idx: parentIdx,
        Student: {
          deletedAt: null,
        },
      },
    });

    return;
  }
}
