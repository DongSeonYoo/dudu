import { Test, TestingModule } from '@nestjs/testing';
import { ParentService } from '../parent.service';
import { ParentRepository } from '../parent.repository';
import { mock, MockProxy } from 'jest-mock-extended';
import { ParentEntity } from '../entity/parent.entity';
import { UpdateParentRequestDto } from '../dto/parent-update.dto';
import { NotFoundException } from '@nestjs/common';

describe('ParentService', () => {
  let parentService: ParentService;
  let parentRepository: MockProxy<ParentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentService,
        {
          provide: ParentRepository,
          useFactory: (): ParentRepository => mock<ParentRepository>(),
        },
      ],
    }).compile();

    parentService = module.get<ParentService>(ParentService);
    parentRepository = module.get(ParentRepository);
  });

  describe('updateParent', () => {
    let parentIdx = 1;
    const dto = new UpdateParentRequestDto();

    it('학생의 부모 정보를 업데이트한다', async () => {
      // given
      parentRepository.findParentByIdx.mockResolvedValue({} as ParentEntity);

      // when
      await parentService.updateParent(parentIdx, dto);

      // then
      expect(parentRepository.updateParent).toHaveBeenCalledWith(
        parentIdx,
        expect.any(ParentEntity),
      );
    });

    it('만약, 부모 정보가 존재하지 않는다면 NotFoundException이 발생한다', async () => {
      // given
      const notExistParentIdx = parentIdx + 1;
      parentRepository.findParentByIdx.mockResolvedValue(null);

      // when
      const act = async () =>
        parentService.updateParent(notExistParentIdx, dto);

      // then
      await expect(act).rejects.toThrow(NotFoundException);
    });
  });
});
