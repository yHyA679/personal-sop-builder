import {
  Body,
  Controller,
  Delete,
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
import { CreateStepDto } from './dto/create-step.dto';
import { ReorderStepsDto } from './dto/reorder-steps.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { StepsService } from './steps.service';

@ApiTags('Steps')
@Controller()
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post('sops/:sopId/steps')
  @ApiOperation({ summary: 'Add a step to an SOP' })
  @ApiCreatedResponse({ description: 'The step was created.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ description: 'The parent SOP does not exist.' })
  create(@Param('sopId') sopId: string, @Body() body: CreateStepDto) {
    return this.stepsService.create(Number(sopId), body);
  }

  @Patch('steps/:id')
  @ApiOperation({ summary: 'Update a step' })
  @ApiOkResponse({ description: 'The step was updated.' })
  @ApiBadRequestResponse({ description: 'The request body is invalid.' })
  @ApiNotFoundResponse({ description: 'The step does not exist.' })
  update(@Param('id') id: string, @Body() body: UpdateStepDto) {
    return this.stepsService.update(Number(id), body);
  }

  @Patch('sops/:sopId/steps/reorder')
  @ApiOperation({ summary: 'Reorder all steps in an SOP' })
  @ApiOkResponse({ description: 'The reordered steps.' })
  @ApiBadRequestResponse({
    description: 'The step IDs are invalid, incomplete, or duplicated.',
  })
  @ApiNotFoundResponse({ description: 'The parent SOP does not exist.' })
  reorder(@Param('sopId') sopId: string, @Body() body: ReorderStepsDto) {
    return this.stepsService.reorder(Number(sopId), body.stepIds);
  }

  @Delete('steps/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a step' })
  @ApiNoContentResponse({ description: 'The step was deleted.' })
  @ApiNotFoundResponse({ description: 'The step does not exist.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.stepsService.remove(Number(id));
  }
}
