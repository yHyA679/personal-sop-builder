import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SopsModule } from './sops/sops.module';
import { StepsModule } from './steps/steps.module';

@Module({
  imports: [SopsModule, StepsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
