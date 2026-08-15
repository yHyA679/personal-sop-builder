import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({
    description: 'The user was registered.',
    schema: {
      example: {
        id: 1,
        fullName: 'Yahya Bsharat',
        email: 'yahya@example.com',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiConflictResponse({ description: 'The email is already registered.' })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive access and refresh tokens' })
  @ApiOkResponse({
    description: 'Access and refresh tokens with the current user.',
    schema: {
      example: {
        accessToken: 'jwt-access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 1,
          fullName: 'Yahya Bsharat',
          email: 'yahya@example.com',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiUnauthorizedResponse({ description: 'The credentials are invalid.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new access token' })
  @ApiOkResponse({
    description: 'A new access token.',
    schema: {
      example: {
        accessToken: 'new-jwt-access-token',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiUnauthorizedResponse({
    description: 'The refresh token is invalid, expired, or revoked.',
  })
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a refresh token' })
  @ApiNoContentResponse({ description: 'The refresh token was revoked.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  logout(@Body() body: RefreshTokenDto): Promise<void> {
    return this.authService.logout(body);
  }
}
