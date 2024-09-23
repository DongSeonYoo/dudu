import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParentRepository } from '../parent.repository';
import { ParentEntity } from '../entity/parent.entity';
import { Parent } from '@prisma/client';
import { studentSeed } from 'test/util/seed/student-seed';
import { parentSeed } from 'test/util/seed/parent-seed';

describe('ParentRepository Test', () => {
  let parentRepository: ParentRepository;
  let prisma: PrismaService;
  let findFirstParent: Parent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ParentRepository],
    }).compile();

    parentRepository = module.get<ParentRepository>(ParentRepository);
    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$transaction(async (tx) => {
      const students = await studentSeed(tx);
      await parentSeed(students, tx);
    });
  });

  beforeEach(async () => {
    findFirstParent = await prisma.parent.findFirstOrThrow({});
  });

  afterEach(async () => {
    await prisma.$transaction([
      prisma.parent.deleteMany(),
      prisma.student.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('updateParent', () => {
    it('학생의 부모님 정보를 업데이트 한다', async () => {
      // given

      const updateParentEntity: Partial<ParentEntity> = {
        name: '홍길',
        phoneNumber: '01011111111',
      };

      // when
      const act = await parentRepository.updateParent(
        findFirstParent.idx,
        updateParentEntity,
      );

      // then
      expect(act).toBeInstanceOf(ParentEntity);
      expect(act.name).toBe(updateParentEntity.name);
      expect(findFirstParent.name).not.toBe(act.name);
    });

    it('부분 업데이트 시 변경된 부분만 반영한다', async () => {
      // given
      const originalParent = findFirstParent;
      const updateParentEntity = ParentEntity.update({
        phoneNumber: '01011122221',
      });

      // when
      const act = await parentRepository.updateParent(
        originalParent.idx,
        updateParentEntity,
      );

      // then
      expect(originalParent.phoneNumber).not.toBe(act.phoneNumber);
      expect(originalParent.name).toBe(act.name);
    });
  });

  describe('findParentByIdx', () => {
    it('부모의 인덱스를 받아 해당하는 부모의 엔티티를 반환한다', async () => {
      // when
      const spy = jest.spyOn(ParentEntity, 'from');
      const act = await parentRepository.findParentByIdx(findFirstParent.idx);

      // then
      expect(spy).toHaveBeenCalled();
      expect(act).toBeInstanceOf(ParentEntity);
    });

    it('만약 해당하는 부모의 인덱스가 존재하지 않는다면 null을 반환한다', async () => {
      // given
      const notExistParentIdx = findFirstParent.idx + 99;

      // when
      const spy = jest.spyOn(ParentEntity, 'from');
      const act = await parentRepository.findParentByIdx(notExistParentIdx);

      // then
      expect(spy).not.toHaveBeenCalled();
      expect(act).toBeNull();
    });
  });
});
