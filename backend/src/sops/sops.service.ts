import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const sopResponseSelect = {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class SopsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: number, search?: string) {
    const normalizedSearch = typeof search === 'string' ? search.trim() : '';

    const sops = await this.prisma.sop.findMany({
      where: {
        userId,
        ...(normalizedSearch && {
          OR: [
            {
              title: {
                contains: normalizedSearch,
                mode: 'insensitive' as const,
              },
            },
            {
              description: {
                contains: normalizedSearch,
                mode: 'insensitive' as const,
              },
            },
          ],
        }),
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        ...sopResponseSelect,
        _count: {
          select: { steps: true },
        },
      },
    });

    return sops.map((sop) => ({
      id: sop.id,
      title: sop.title,
      description: sop.description,
      stepsCount: sop._count.steps,
      createdAt: sop.createdAt,
      updatedAt: sop.updatedAt,
    }));
  }

  async create(userId: number, data: { title: string; description?: string }) {
    return this.prisma.sop.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
      select: sopResponseSelect,
    });
  }

  async findOne(id: number, userId: number) {
    const sop = await this.prisma.sop.findFirst({
      where: { id, userId },
      select: {
        ...sopResponseSelect,
        steps: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            content: true,
            order: true,
          },
        },
      },
    });

    if (!sop) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    return sop;
  }

  async update(
    id: number,
    userId: number,
    data: { title?: string; description?: string },
  ) {
    const existingSop = await this.prisma.sop.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!existingSop) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }

    return this.prisma.sop.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: sopResponseSelect,
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.prisma.sop.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }
  }
}
