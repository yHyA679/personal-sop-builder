import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepsModule {}
