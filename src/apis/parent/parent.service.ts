import { Injectable } from '@nestjs/common';
import { ParentRepository } from './parent.repository';
import { UpdateParentRequestDto } from './dto/parent-update.dto';
import { ParentNotFoundException } from './exception/parent-not-found.exception';

@Injectable()
export class ParentService {
  constructor(private readonly parentRepository: ParentRepository) {}

  async updateParent(parentIdx: number, dto: UpdateParentRequestDto) {
    const foundStudent = await this.parentRepository.findParentByIdx(parentIdx);
    if (!foundStudent) {
      throw new ParentNotFoundException();
    }

    const updateParentEntity = dto.toEntity();
    await this.parentRepository.updateParent(parentIdx, updateParentEntity);

    return;
  }
}
