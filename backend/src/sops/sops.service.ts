import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SopsService {
  private readonly sops = [
    {
      id: 10,
      title: 'Deploy Website',
      description: 'Steps I use to deploy my website',
      createdAt: '2026-08-11T20:00:00Z',
      updatedAt: '2026-08-11T20:00:00Z',
      steps: [
        {
          id: 100,
          content: 'Run tests',
          order: 1,
        },
        {
          id: 101,
          content: 'Build project',
          order: 2,
        },
      ],
    },
  ];

  findAll() {
    return this.sops.map((sop) => ({
      id: sop.id,
      title: sop.title,
      description: sop.description,
      stepsCount: sop.steps.length,
      createdAt: sop.createdAt,
      updatedAt: sop.updatedAt,
    }));
  }

  create(data: { title: string; description: string }) {
    const id = Math.max(0, ...this.sops.map((sop) => sop.id)) + 1;
    const timestamp = new Date().toISOString();
    const sop = {
      id,
      title: data.title,
      description: data.description,
      createdAt: timestamp,
      updatedAt: timestamp,
      steps: [],
    };

    this.sops.push(sop);

    return {
      id: sop.id,
      title: sop.title,
      description: sop.description,
      createdAt: sop.createdAt,
      updatedAt: sop.updatedAt,
    };
  }

  findOne(id: number) {
    const sop = this.sops.find((item) => item.id === id);

    if (!sop) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    return sop;
  }

  getNextStepId(): number {
    const stepIds = this.sops.flatMap((sop) =>
      sop.steps.map((step) => step.id),
    );

    return Math.max(0, ...stepIds) + 1;
  }

  update(id: number, data: { title?: string; description?: string }) {
    const sop = this.sops.find((item) => item.id === id);

    if (!sop) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    if (data.title !== undefined) {
      sop.title = data.title;
    }

    if (data.description !== undefined) {
      sop.description = data.description;
    }

    sop.updatedAt = new Date().toISOString();

    return {
      id: sop.id,
      title: sop.title,
      description: sop.description,
      createdAt: sop.createdAt,
      updatedAt: sop.updatedAt,
    };
  }

  remove(id: number): void {
    const sopIndex = this.sops.findIndex((sop) => sop.id === id);

    if (sopIndex === -1) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    this.sops.splice(sopIndex, 1);
  }
}
