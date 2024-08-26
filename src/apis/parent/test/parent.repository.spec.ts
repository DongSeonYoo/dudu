import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { $Enums, Parent, Prisma, Student } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParentRepository } from '../parent.repository';
import { ParentEntity } from '../entity/parent.entity';

describe('ParentRepository Test', () => {
  let parentRepository: ParentRepository;
  let prisma: PrismaService;
  let studentParentSeed = {
    idx: 1,
    name: '홍길동',
    studentNumber: '1234',
    birthDate: new Date('2000-01-01'),
    email: 'email1@naver.com',
    phoneNumber: '01012345678',
    gender: 'male',
    school: 'school',
    type: $Enums.TYPE.STUDENT,
    parent: {
      name: '홍길동 모',
      phoneNumber: '01011111111',
    },
  };
  let parentIdx: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ParentRepository],
    }).compile();

    parentRepository = module.get<ParentRepository>(ParentRepository);
    prisma = module.get<PrismaService>(PrismaService);

    const { parent, ...student } = studentParentSeed;

    await prisma.$transaction(async (tx) => {
      const { idx: studentIdx } = await tx.student.create({
        data: {
          ...student,
        },
        select: {
          idx: true,
        },
      });

      parentIdx = await tx.parent
        .create({
          data: {
            studentIdx: studentIdx,
            ...parent,
          },
          select: {
            idx: true,
          },
        })
        .then((res) => res.idx);
    });
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.parent.deleteMany(),
      prisma.student.deleteMany(),
    ]);

    await prisma.$disconnect();
  });

  describe('updateParent', () => {
    it('학생의 부모님 정보를 업데이트 한다', async () => {
      // given
      const originalParent = studentParentSeed.parent;
      const updateParentEntity: Partial<ParentEntity> = {
        name: '홍길',
        phoneNumber: '01011111111',
      };

      // when
      const act = await parentRepository.updateParent(
        parentIdx,
        updateParentEntity,
      );

      // then
      expect(act).toBeInstanceOf(ParentEntity);
      expect(act.name).toBe(updateParentEntity.name);
      expect(originalParent.name).not.toBe(act.name);
    });

    it('부분 업데이트 시 변경된 부분만 반영한다', async () => {
      // given
      const originalParent = studentParentSeed.parent;
      const updateParentEntity: Partial<ParentEntity> = {
        phoneNumber: '01011122221',
      };

      // when
      const act = await parentRepository.updateParent(
        parentIdx,
        updateParentEntity,
      );

      // then
      expect(originalParent.phoneNumber).not.toBe(act.phoneNumber);
      expect(originalParent.name).not.toBe(act.name);
    });
  });

  describe('findParentByIdx', () => {
    it('부모의 인덱스를 받아 해당하는 부모의 엔티티를 반환한다', async () => {
      // when
      const spy = jest.spyOn(ParentEntity, 'from');
      const act = await parentRepository.findParentByIdx(parentIdx);

      // then
      expect(spy).toHaveBeenCalled();
      expect(act).toBeInstanceOf(ParentEntity);
    });

    it('만약 해당하는 부모의 인덱스가 존재하지 않는다면 null을 반환한다', async () => {
      // given
      const notExistParentIdx = parentIdx + 1;

      // when
      const spy = jest.spyOn(ParentEntity, 'from');
      const act = await parentRepository.findParentByIdx(notExistParentIdx);

      // then
      expect(spy).not.toHaveBeenCalled();
      expect(act).toBeNull();
    });
  });
});
