import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'A valid access token is required.' })
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user' })
  @ApiOkResponse({
    description: 'The authenticated user.',
    schema: {
      example: {
        id: 1,
        fullName: 'Yahya Bsharat',
        email: 'yahya@example.com',
      },
    },
  })
  findMe(@CurrentUser('sub') userId: number) {
    return this.usersService.findMe(userId);
  }
}
