import { Body, Controller, Param, Post } from '@nestjs/common';
import { StepsService } from './steps.service';

@Controller('sops/:sopId/steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  create(@Param('sopId') sopId: string, @Body() body: { content: string }) {
    return this.stepsService.create(Number(sopId), body);
  }
}
