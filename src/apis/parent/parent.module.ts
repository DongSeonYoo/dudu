import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { ParentRepository } from './parent.repository';

@Module({
  controllers: [ParentController],
  providers: [ParentService, ParentRepository],
})
export class ParentModule {}
