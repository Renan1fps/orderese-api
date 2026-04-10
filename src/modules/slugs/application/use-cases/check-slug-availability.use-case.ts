import { Inject, Injectable } from '@nestjs/common';
import { ISlugRepository, SLUG_REPOSITORY } from '../../domain/ports/slug.repository.port';

export interface SlugAvailabilityResult {
  available: boolean;
}

export interface ICheckSlugAvailabilityUseCase {
  checkAvailability(slug: string): Promise<SlugAvailabilityResult>;
}

@Injectable()
export class CheckSlugAvailabilityUseCase implements ICheckSlugAvailabilityUseCase {
  constructor(
    @Inject(SLUG_REPOSITORY)
    private readonly slugRepository: ISlugRepository,
  ) {}

  async checkAvailability(slug: string): Promise<SlugAvailabilityResult> {
    const exists = await this.slugRepository.existsBySlug(slug);
    return { available: !exists };
  }
}
