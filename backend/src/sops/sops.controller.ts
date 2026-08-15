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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { SopsService } from './sops.service';

@ApiTags('SOPs')
@Controller('sops')
export class SopsController {
  constructor(private readonly sopsService: SopsService) {}

  @Get()
  @ApiOperation({ summary: 'List all SOPs' })
  @ApiOkResponse({ description: 'SOPs ordered by most recently updated.' })
  findAll() {
    return this.sopsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create an SOP' })
  @ApiCreatedResponse({ description: 'The SOP was created.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  create(@Body() body: CreateSopDto) {
    return this.sopsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an SOP with its steps' })
  @ApiOkResponse({ description: 'The SOP and its ordered steps.' })
  @ApiNotFoundResponse({ description: 'The SOP does not exist.' })
  findOne(@Param('id') id: string) {
    return this.sopsService.findOne(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an SOP' })
  @ApiOkResponse({ description: 'The SOP was updated.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ description: 'The SOP does not exist.' })
  update(@Param('id') id: string, @Body() body: UpdateSopDto) {
    return this.sopsService.update(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an SOP' })
  @ApiNoContentResponse({ description: 'The SOP was deleted.' })
  @ApiNotFoundResponse({ description: 'The SOP does not exist.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.sopsService.remove(Number(id));
  }
}
