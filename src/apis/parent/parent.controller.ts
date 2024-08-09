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
import { ApiException } from 'src/decorators/api-exception.decorator';

@ApiTags('Parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  /**
   * 부모님 정보 수정
   *
   * @param parentIdx
   */
  @Put(':parentIdx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiException(
    HttpStatus.NOT_FOUND,
    '해당하는 부모님 정보가 존재하지 않습니다.',
  )
  async updateParent(
    @Param('parentIdx') parentIdx: number,
    @Body() updateParent: UpdateParentRequestDto,
  ) {
    return await this.parentService.updateParent(parentIdx, updateParent);
  }
}
