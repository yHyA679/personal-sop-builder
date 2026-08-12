import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { StepsService } from './steps.service';

@Controller()
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post('sops/:sopId/steps')
  create(@Param('sopId') sopId: string, @Body() body: { content: string }) {
    return this.stepsService.create(Number(sopId), body);
  }

  @Patch('steps/:id')
  update(@Param('id') id: string, @Body() body: { content: string }) {
    return this.stepsService.update(Number(id), body);
  }
}
