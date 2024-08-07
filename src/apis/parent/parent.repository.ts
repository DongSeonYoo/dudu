import { PrismaService } from 'src/prisma/prisma.service';

export class ParentRepository {
  constructor(private readonly prisma: PrismaService) {}
}
