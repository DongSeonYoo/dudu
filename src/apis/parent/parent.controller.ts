import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateParentRequestDto } from './dto/parent-update.dto';
import { ApiExceptionsTest } from 'src/decorators/api-exception.decorator';
import { ParentNotFoundException } from './exception/parent-not-found.exception';

@ApiTags('Parent')
@Controller('/api/parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  /**
   * 부모님 정보 수정
   *
   * @param parentIdx
   */
  @Put(':parentIdx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiExceptionsTest(HttpStatus.NOT_FOUND, [
    {
      exampleTitle: '부모 정보가 존재하지 않을 경우',
      schema: ParentNotFoundException,
    },
  ])
  async updateParent(
    @Param('parentIdx') parentIdx: number,
    @Body() updateParent: UpdateParentRequestDto,
  ) {
    return await this.parentService.updateParent(parentIdx, updateParent);
  }
}
