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
import { SopsService } from './sops.service';

@Controller('sops')
export class SopsController {
  constructor(private readonly sopsService: SopsService) {}

  @Get()
  findAll() {
    return this.sopsService.findAll();
  }

  @Post()
  create(@Body() body: { title: string; description: string }) {
    return this.sopsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sopsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string },
  ) {
    return this.sopsService.update(Number(id), body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.sopsService.remove(Number(id));
  }
}
