import { v4 as uuid } from 'uuid';

export abstract class Entity<T extends { id: string }> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = props;
  }

  static generateId(): string {
    return uuid();
  }

  get id(): string {
    return this.props.id;
  }

  equals(other: Entity<T>): boolean {
    if (!(other instanceof Entity)) return false;
    return this.props.id === other.props.id;
  }
}
