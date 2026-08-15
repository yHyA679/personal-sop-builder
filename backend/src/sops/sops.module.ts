import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SopsController } from './sops.controller';
import { SopsService } from './sops.service';

@Module({
  imports: [PrismaModule],
  controllers: [SopsController],
  providers: [SopsService],
  exports: [SopsService],
})
export class SopsModule {}
