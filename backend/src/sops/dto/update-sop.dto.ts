import { Exclude } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateSopDto {
  @ApiPropertyOptional({ example: 'Deploy Website Safely' })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated deployment instructions' })
  @ValidateIf((_object, value) => value !== undefined)
  @IsString()
  description?: string;

  @Exclude()
  @ValidateIf(
    (object: UpdateSopDto) =>
      object.title === undefined && object.description === undefined,
  )
  @IsDefined({ message: 'At least one of title or description is required' })
  private readonly atLeastOneField?: never;
}
