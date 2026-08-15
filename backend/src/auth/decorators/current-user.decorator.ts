import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

type AuthenticatedRequest = Request & { user: JwtPayload };

export const CurrentUser = createParamDecorator(
  (field: keyof JwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return field ? request.user[field] : request.user;
  },
);
