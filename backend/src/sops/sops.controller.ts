import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
