import { Injectable } from '@nestjs/common';
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
}
