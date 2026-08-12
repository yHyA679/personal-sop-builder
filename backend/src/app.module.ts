import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SopsModule } from './sops/sops.module';

@Module({
  imports: [SopsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
