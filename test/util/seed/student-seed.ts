import { $Enums, Prisma } from '@prisma/client';

const studentSeedList = [
  {
    name: '홍길동',
    studentNumber: '1234',
    birthDate: new Date('2000-01-01'),
    email: 'email1@naver.com',
    phoneNumber: '01012345678',
    gender: 'male',
    school: 'school',
    type: $Enums.TYPE.STUDENT,
  },
  {
    name: '홍길동2',
    studentNumber: '2234',
    birthDate: new Date('2000-01-01'),
    email: 'email2@naver.com',
    phoneNumber: '01012345678',
    gender: 'male',
    school: 'school',
    type: $Enums.TYPE.STUDENT,
  },
  {
    name: '홍길동3',
    studentNumber: '3234',
    birthDate: new Date('2000-01-01'),
    email: 'email3@naver.com',
    phoneNumber: '01012345678',
    gender: 'male',
    school: 'school',
    type: $Enums.TYPE.STUDENT,
  },
];

export async function studentSeed(tx: Prisma.TransactionClient) {
  await tx.student.createMany({
    data: studentSeedList,
  });

  return tx.student.findMany();
}
