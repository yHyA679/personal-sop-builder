import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const stepResponseSelect = {
  id: true,
  content: true,
  order: true,
} as const;

@Injectable()
export class StepsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sopId: number, userId: number, data: { content: string }) {
    return this.prisma.$transaction(async (transaction) => {
      const sop = await transaction.sop.findFirst({
        where: { id: sopId, userId },
        select: { id: true },
      });

      if (!sop) {
        throw new NotFoundException(`SOP with ID ${sopId} not found`);
      }

      const orderAggregation = await transaction.step.aggregate({
        where: { sopId },
        _max: { order: true },
      });

      return transaction.step.create({
        data: {
          content: data.content,
          order: (orderAggregation._max.order ?? 0) + 1,
          sopId,
        },
        select: stepResponseSelect,
      });
    });
  }

  async update(stepId: number, userId: number, data: { content: string }) {
    const step = await this.prisma.step.findFirst({
      where: {
        id: stepId,
        sop: { userId },
      },
      select: { id: true },
    });

    if (!step) {
      throw new NotFoundException(`Step with ID ${stepId} not found`);
    }

    return this.prisma.step.update({
      where: { id: stepId },
      data: { content: data.content },
      select: stepResponseSelect,
    });
  }

  async reorder(sopId: number, userId: number, stepIds: number[]) {
    if (!Array.isArray(stepIds)) {
      throw new BadRequestException('stepIds must be an array');
    }

    if (new Set(stepIds).size !== stepIds.length) {
      throw new BadRequestException('Step IDs must not be duplicated');
    }

    return this.prisma.$transaction(async (transaction) => {
      const sop = await transaction.sop.findFirst({
        where: { id: sopId, userId },
        select: { id: true },
      });

      if (!sop) {
        throw new NotFoundException(`SOP with ID ${sopId} not found`);
      }

      const currentSteps = await transaction.step.findMany({
        where: { sopId },
        select: { id: true },
      });

      if (stepIds.length !== currentSteps.length) {
        throw new BadRequestException(
          'stepIds must include every Step in the SOP exactly once',
        );
      }

      const currentStepIds = new Set(currentSteps.map((step) => step.id));

      for (const stepId of stepIds) {
        if (!currentStepIds.has(stepId)) {
          throw new BadRequestException(
            `Step with ID ${stepId} does not belong to SOP ${sopId}`,
          );
        }
      }

      for (const [index, stepId] of stepIds.entries()) {
        await transaction.step.update({
          where: { id: stepId },
          data: { order: index + 1 },
        });
      }

      return transaction.step.findMany({
        where: { sopId },
        orderBy: { order: 'asc' },
        select: stepResponseSelect,
      });
    });
  }

  async remove(stepId: number, userId: number): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const step = await transaction.step.findFirst({
        where: {
          id: stepId,
          sop: { userId },
        },
        select: {
          id: true,
          sopId: true,
        },
      });

      if (!step) {
        throw new NotFoundException(`Step with ID ${stepId} not found`);
      }

      await transaction.step.delete({
        where: { id: stepId },
      });

      const remainingSteps = await transaction.step.findMany({
        where: { sopId: step.sopId },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        select: { id: true },
      });

      for (const [index, remainingStep] of remainingSteps.entries()) {
        await transaction.step.update({
          where: { id: remainingStep.id },
          data: { order: index + 1 },
        });
      }
    });
  }
}
