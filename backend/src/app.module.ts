import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SopsModule } from './sops/sops.module';
import { StepsModule } from './steps/steps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SopsModule,
    StepsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
