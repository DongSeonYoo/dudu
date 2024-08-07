import { PrismaService } from 'src/prisma/prisma.service';

export class EnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}
}
