import { Controller } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parent')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}
}
