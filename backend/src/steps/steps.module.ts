import { Module } from '@nestjs/common';
import { SopsModule } from '../sops/sops.module';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';

@Module({
  imports: [SopsModule],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepsModule {}
