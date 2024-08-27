import { Prisma, PrismaClient } from '@prisma/client';

export const attendanceSeedList = [
  {
    idx: 1,
    studentIdx: 1,
    checkInAt: new Date(),
  },
  {
    idx: 2,
    studentIdx: 2,
    checkInAt: new Date(),
  },
  {
    idx: 3,
    studentIdx: 3,
    checkInAt: new Date(),
  },
];
const prisma = new PrismaClient();

export async function seedAttendances(
  attendance: Prisma.AttendanceCreateManyInput[],
) {
  await prisma.attendance.createMany({
    data: attendance,
  });
}
