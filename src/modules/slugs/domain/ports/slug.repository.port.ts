export const SLUG_REPOSITORY = Symbol('SLUG_REPOSITORY');

export interface ISlugRepository {
  existsBySlug(slug: string): Promise<boolean>;
}
