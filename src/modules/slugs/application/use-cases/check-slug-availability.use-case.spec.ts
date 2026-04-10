import { CheckSlugAvailabilityUseCase } from './check-slug-availability.use-case';
import { ISlugRepository } from '../../domain/ports/slug.repository.port';

const makeRepository = (exists: boolean): ISlugRepository => ({
  existsBySlug: jest.fn().mockResolvedValue(exists),
});

describe('CheckSlugAvailabilityUseCase', () => {
  it('should return available: true when slug does not exist', async () => {
    const useCase = new CheckSlugAvailabilityUseCase(makeRepository(false));
    const result = await useCase.checkAvailability('my-slug');
    expect(result).toEqual({ available: true });
  });

  it('should return available: false when slug already exists', async () => {
    const useCase = new CheckSlugAvailabilityUseCase(makeRepository(true));
    const result = await useCase.checkAvailability('taken-slug');
    expect(result).toEqual({ available: false });
  });

  it('should delegate to the repository with the given slug', async () => {
    const repo = makeRepository(false);
    const useCase = new CheckSlugAvailabilityUseCase(repo);
    await useCase.checkAvailability('some-slug');
    expect(repo.existsBySlug).toHaveBeenCalledWith('some-slug');
  });
});
