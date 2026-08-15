import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { SopsService } from './sops.service';

@ApiTags('SOPs')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'A valid access token is required.' })
@UseGuards(JwtAuthGuard)
@Controller('sops')
export class SopsController {
  constructor(private readonly sopsService: SopsService) {}

  @Get()
  @ApiOperation({ summary: 'List all SOPs' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Case-insensitive title or description search.',
  })
  @ApiOkResponse({ description: 'SOPs ordered by most recently updated.' })
  findAll(
    @CurrentUser('sub') userId: number,
    @Query('search') search?: string,
  ) {
    return this.sopsService.findAll(userId, search);
  }

  @Post()
  @ApiOperation({ summary: 'Create an SOP' })
  @ApiCreatedResponse({ description: 'The SOP was created.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  create(@CurrentUser('sub') userId: number, @Body() body: CreateSopDto) {
    return this.sopsService.create(userId, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an SOP with its steps' })
  @ApiOkResponse({ description: 'The SOP and its ordered steps.' })
  @ApiNotFoundResponse({ description: 'The SOP does not exist.' })
  findOne(@Param('id') id: string, @CurrentUser('sub') userId: number) {
    return this.sopsService.findOne(Number(id), userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an SOP' })
  @ApiOkResponse({ description: 'The SOP was updated.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ description: 'The SOP does not exist.' })
  update(
    @Param('id') id: string,
    @CurrentUser('sub') userId: number,
    @Body() body: UpdateSopDto,
  ) {
    return this.sopsService.update(Number(id), userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an SOP' })
  @ApiNoContentResponse({ description: 'The SOP was deleted.' })
  @ApiNotFoundResponse({ description: 'The SOP does not exist.' })
  remove(
    @Param('id') id: string,
    @CurrentUser('sub') userId: number,
  ): Promise<void> {
    return this.sopsService.remove(Number(id), userId);
  }
}
