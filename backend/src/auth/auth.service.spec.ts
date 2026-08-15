import { UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { createHash } from 'crypto';
import type { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('../generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {},
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
  },
}));

type CreateRefreshTokenArgs = {
  data: {
    tokenHash: string;
    userId: number;
    expiresAt: Date;
  };
};

type RevokeRefreshTokenArgs = {
  where: {
    tokenHash: string;
    revokedAt: null;
  };
  data: {
    revokedAt: Date;
  };
};

describe('AuthService refresh tokens', () => {
  const user = {
    id: 7,
    fullName: 'Yahya Bsharat',
    email: 'yahya@example.com',
  };

  let prisma: {
    user: { findUnique: jest.Mock };
    refreshToken: {
      create: jest.Mock;
      findUnique: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let jwtService: { signAsync: jest.Mock };
  let service: AuthService;

  beforeEach(() => {
    prisma = {
      user: { findUnique: jest.fn() },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    jwtService = { signAsync: jest.fn().mockResolvedValue('access-token') };
    service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
    );
  });

  it('returns a refresh token on login but stores only its hash', async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...user,
      passwordHash: await hash('StrongPass123', 4),
    });

    const result = await service.login({
      email: 'YAHYA@example.com',
      password: 'StrongPass123',
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(prisma.refreshToken.create).toHaveBeenCalledTimes(1);
    const createCalls = prisma.refreshToken.create.mock.calls as unknown as [
      CreateRefreshTokenArgs,
    ][];
    const createArgument = createCalls[0][0];

    expect(createArgument.data.tokenHash).toBe(
      createHash('sha256').update(result.refreshToken).digest('hex'),
    );
    expect(createArgument.data.tokenHash).not.toBe(result.refreshToken);
    expect(createArgument.data.userId).toBe(user.id);
    expect(createArgument.data.expiresAt).toBeInstanceOf(Date);
  });

  it('creates a new access token for a valid refresh token', async () => {
    prisma.refreshToken.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
      user: { id: user.id, email: user.email },
    });

    await expect(
      service.refresh({ refreshToken: 'valid-refresh-token' }),
    ).resolves.toEqual({ accessToken: 'access-token' });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
  });

  it('rejects a revoked refresh token', async () => {
    prisma.refreshToken.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: new Date(),
      user: { id: user.id, email: user.email },
    });

    await expect(
      service.refresh({ refreshToken: 'revoked-refresh-token' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an expired refresh token', async () => {
    prisma.refreshToken.findUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() - 60_000),
      revokedAt: null,
      user: { id: user.id, email: user.email },
    });

    await expect(
      service.refresh({ refreshToken: 'expired-refresh-token' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown refresh token', async () => {
    prisma.refreshToken.findUnique.mockResolvedValue(null);

    await expect(
      service.refresh({ refreshToken: 'unknown-refresh-token' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('revokes the matching active refresh token on logout', async () => {
    await service.logout({ refreshToken: 'refresh-token' });

    expect(prisma.refreshToken.updateMany).toHaveBeenCalledTimes(1);
    const updateCalls = prisma.refreshToken.updateMany.mock
      .calls as unknown as [RevokeRefreshTokenArgs][];
    const updateArgument = updateCalls[0][0];

    expect(updateArgument.where).toEqual({
      tokenHash: createHash('sha256').update('refresh-token').digest('hex'),
      revokedAt: null,
    });
    expect(updateArgument.data.revokedAt).toBeInstanceOf(Date);
  });
});
