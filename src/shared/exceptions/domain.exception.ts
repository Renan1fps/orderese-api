export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class EntityNotFoundException extends DomainException {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found`);
    this.name = 'EntityNotFoundException';
  }
}

export class UnauthorizedTenantException extends DomainException {
  constructor() {
    super('Access denied: resource does not belong to this tenant');
    this.name = 'UnauthorizedTenantException';
  }
}

export class BusinessRuleViolationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleViolationException';
  }
}
