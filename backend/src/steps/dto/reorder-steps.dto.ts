import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsInt,
} from 'class-validator';

export class ReorderStepsDto {
  @ApiProperty({
    example: [103, 100, 102, 101],
    type: [Number],
  })
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  stepIds!: number[];
}
