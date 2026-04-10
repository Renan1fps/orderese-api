import { ValueObject } from '../../../../shared/domain/value-object.base';

interface TenantSlugProps {
  value: string;
}

export class TenantSlug extends ValueObject<TenantSlugProps> {
  private static readonly SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MAX_LENGTH = 63;

  private constructor(props: TenantSlugProps) {
    super(props);
  }

  static create(value: string): TenantSlug {
    const slug = value.toLowerCase().trim();
    if (!TenantSlug.SLUG_REGEX.test(slug)) {
      throw new Error('Slug must contain only lowercase letters, numbers and hyphens');
    }
    if (slug.length > TenantSlug.MAX_LENGTH) {
      throw new Error(`Slug must be at most ${TenantSlug.MAX_LENGTH} characters`);
    }
    return new TenantSlug({ value: slug });
  }

  get value(): string {
    return this.props.value;
  }
}
