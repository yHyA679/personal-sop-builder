import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TEMPORARY_DEVELOPMENT_USER } from './temporary-development-user';

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

  async findAll() {
    const sops = await this.prisma.sop.findMany({
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

  async create(data: { title: string; description?: string }) {
    const userId = await this.getTemporaryDevelopmentUserId();

    return this.prisma.sop.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
      },
      select: sopResponseSelect,
    });
  }

  async findOne(id: number) {
    const sop = await this.prisma.sop.findUnique({
      where: { id },
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

  async update(id: number, data: { title?: string; description?: string }) {
    const existingSop = await this.prisma.sop.findUnique({
      where: { id },
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

  async remove(id: number): Promise<void> {
    const result = await this.prisma.sop.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException(`SOP with ID ${id} not found`);
    }
  }

  private async getTemporaryDevelopmentUserId(): Promise<number> {
    const user = await this.prisma.user.upsert({
      where: { email: TEMPORARY_DEVELOPMENT_USER.email },
      update: {},
      create: TEMPORARY_DEVELOPMENT_USER,
      select: { id: true },
    });

    return user.id;
  }
}
