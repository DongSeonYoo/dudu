import { Prisma, Student } from '@prisma/client';

const parentSeedList = [
  { name: '홍길동1 모', phoneNumber: '01011111111' },
  { name: '홍길동2 모', phoneNumber: '01022222222' },
  { name: '홍길동3 모', phoneNumber: '01033333333' },
];

export async function parentSeed(
  student: Student[],
  tx: Prisma.TransactionClient,
) {
  await tx.parent.createMany({
    data: student.map((e, i) => ({
      studentIdx: e.idx,
      name: parentSeedList[i].name,
      phoneNumber: parentSeedList[i].phoneNumber,
    })),
  });
}
