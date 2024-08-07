import { Controller } from '@nestjs/common';
import { OutingService } from './outing.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Outing')
@Controller('outing')
export class OutingController {
  constructor(private readonly outingService: OutingService) {}
}
