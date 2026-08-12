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

  findOne(id: number) {
    const sop = this.sops.find((item) => item.id === id);

    if (!sop) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    return sop;
  }
}
