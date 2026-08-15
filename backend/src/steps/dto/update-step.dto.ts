import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStepDto {
  @ApiProperty({ example: 'Run unit and integration tests' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
