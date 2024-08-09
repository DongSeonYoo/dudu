import { Injectable, NotFoundException } from '@nestjs/common';
import { ParentRepository } from './parent.repository';
import { UpdateParentRequestDto } from './dto/parent-update.dto';

@Injectable()
export class ParentService {
  constructor(private readonly parentRepository: ParentRepository) {}

  async updateParent(parentIdx: number, dto: UpdateParentRequestDto) {
    const foundStudent =
      await this.parentRepository.findStudentIdxByParentIdx(parentIdx);
    if (!foundStudent) {
      throw new NotFoundException('해당하는 부모님 정보가 존재하지 않습니다.');
    }

    const updateParentEntity = dto.toEntity();
    await this.parentRepository.updateParent(parentIdx, updateParentEntity);

    return;
  }
}
