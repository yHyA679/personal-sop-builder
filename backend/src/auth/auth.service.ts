import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

const publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
} as const;

const REFRESH_TOKEN_BYTES = 48;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const email = this.normalizeEmail(data.email);

    try {
      return await this.prisma.user.create({
        data: {
          fullName: data.fullName,
          email,
          passwordHash: await hash(data.password, 12),
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email is already registered');
      }

      throw error;
    }
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: this.normalizeEmail(data.email) },
      select: {
        ...publicUserSelect,
        passwordHash: true,
      },
    });

    if (!user || !(await compare(data.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const refreshToken = await this.createRefreshToken(user.id);

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }

  async refresh(data: RefreshTokenDto) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hashRefreshToken(data.refreshToken) },
      select: {
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (
      !storedToken ||
      storedToken.revokedAt !== null ||
      storedToken.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const payload: JwtPayload = {
      sub: storedToken.user.id,
      email: storedToken.user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async logout(data: RefreshTokenDto): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash: this.hashRefreshToken(data.refreshToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }

  private async createRefreshToken(userId: number): Promise<string> {
    const refreshToken = randomBytes(REFRESH_TOKEN_BYTES).toString('base64url');

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashRefreshToken(refreshToken),
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
      },
    });

    return refreshToken;
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
