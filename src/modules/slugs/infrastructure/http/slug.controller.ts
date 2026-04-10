import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CheckSlugAvailabilityUseCase } from '../../application/use-cases/check-slug-availability.use-case';

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

@ApiTags('Slugs')
@Controller('slugs')
export class SlugController {
  constructor(
    private readonly checkSlugAvailability: CheckSlugAvailabilityUseCase,
  ) {}

  @Get('availability')
  @ApiOperation({ summary: 'Check if a slug is available' })
  @ApiQuery({ name: 'slug', required: true, description: 'Slug to check' })
  @ApiResponse({ status: 200, description: 'Slug is available' })
  @ApiResponse({ status: 400, description: 'Slug is already taken' })
  @ApiResponse({ status: 422, description: 'Invalid slug format' })
  async checkAvailability(@Query('slug') slug: string) {
    if (!slug || !SLUG_REGEX.test(slug)) {
      throw new HttpException(
        { message: 'O slug informado é inválido' },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const result = await this.checkSlugAvailability.checkAvailability(slug);

    if (!result.available) {
      throw new HttpException(
        { available: false, message: 'Slug já está em uso' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return { available: true };
  }
}
