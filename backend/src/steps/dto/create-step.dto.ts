import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStepDto {
  @ApiProperty({ example: 'Run tests' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
