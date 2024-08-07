import { Module } from '@nestjs/common';
import { OutingService } from './outing.service';
import { OutingController } from './outing.controller';

@Module({
  controllers: [OutingController],
  providers: [OutingService],
})
export class OutingModule {}
