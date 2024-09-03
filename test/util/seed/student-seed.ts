import { $Enums, Prisma, PrismaClient, Student } from '@prisma/client';

export const studentSeedList = [
  {
    idx: 1,
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
    idx: 2,
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
    idx: 3,
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

const prisma = new PrismaClient();

export async function seedStudents(
  studentList: Prisma.StudentCreateManyInput[],
): Promise<Student[]> {
  await prisma.student.createMany({
    data: studentList,
  });

  return await prisma.student.findMany().then((res) => res);
}
