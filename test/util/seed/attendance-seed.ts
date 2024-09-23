import { Prisma, Student } from '@prisma/client';

const attendanceSeedList = [
  {
    checkInAt: new Date(),
  },
  {
    checkInAt: new Date(),
  },
  {
    checkInAt: new Date(),
  },
];

export async function attendanceSeed(
  students: Student[],
  tx: Prisma.TransactionClient,
) {
  await tx.attendance.createMany({
    data: students.map((e, i) => ({
      studentIdx: e.idx,
      checkInAt: attendanceSeedList[i].checkInAt,
    })),
  });
}
