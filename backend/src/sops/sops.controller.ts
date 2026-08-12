import { Controller, Get, Param } from '@nestjs/common';
import { SopsService } from './sops.service';

@Controller('sops')
export class SopsController {
  constructor(private readonly sopsService: SopsService) {}

  @Get()
  findAll() {
    return this.sopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sopsService.findOne(Number(id));
  }
}
