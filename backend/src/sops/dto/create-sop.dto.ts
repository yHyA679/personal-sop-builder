import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateSopDto {
  @ApiProperty({ example: 'Deploy Website' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Steps used to deploy the website' })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  description?: string;
}
