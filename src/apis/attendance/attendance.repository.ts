import { PrismaService } from 'src/prisma/prisma.service';

export class AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}
}
