import { Injectable, NotFoundException } from '@nestjs/common';
import { SopsService } from '../sops/sops.service';

@Injectable()
export class StepsService {
  constructor(private readonly sopsService: SopsService) {}

  create(sopId: number, data: { content: string }) {
    const sop = this.sopsService.findOne(sopId);
    const id = this.sopsService.getNextStepId();
    const order = Math.max(0, ...sop.steps.map((step) => step.order)) + 1;
    const step = {
      id,
      content: data.content,
      order,
    };

    sop.steps.push(step);

    return step;
  }

  update(stepId: number, data: { content: string }) {
    const step = this.sopsService.findStep(stepId);

    if (!step) {
      throw new NotFoundException(`Step with ID ${stepId} not found`);
    }

    step.content = data.content;

    return step;
  }

  remove(stepId: number): void {
    const result = this.sopsService.findStepWithParent(stepId);

    if (!result) {
      throw new NotFoundException(`Step with ID ${stepId} not found`);
    }

    const { sop, stepIndex } = result;
    sop.steps.splice(stepIndex, 1);
    sop.steps.forEach((step, index) => {
      step.order = index + 1;
    });
  }
}
