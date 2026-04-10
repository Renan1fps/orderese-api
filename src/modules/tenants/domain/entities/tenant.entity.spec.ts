import { Tenant, SubscriptionStatus } from './tenant.entity';
import { BusinessRuleViolationException } from '../../../../shared/exceptions/domain.exception';

describe('Tenant', () => {
  it('should create tenant with TRIAL status', () => {
    const tenant = Tenant.create({ name: 'Padaria do Zé', slug: 'padaria-do-ze' });
    expect(tenant.subscriptionStatus).toBe(SubscriptionStatus.TRIAL);
    expect(tenant.isActive()).toBe(true);
  });

  it('should be active during trial period', () => {
    const tenant = Tenant.create({ name: 'Test', slug: 'test', trialDays: 14 });
    expect(tenant.isActive()).toBe(true);
  });

  it('should become inactive if trial expired', () => {
    const tenant = Tenant.create({ name: 'Test', slug: 'test', trialDays: 0 });
    // trialEndsAt = now, already expired
    expect(tenant.isActive()).toBe(false);
  });

  it('should activate subscription', () => {
    const tenant = Tenant.create({ name: 'Test', slug: 'test' });
    tenant.activateSubscription({
      gatewayName: 'stripe',
      gatewayCustomerId: 'cus_123',
      gatewaySubscriptionId: 'sub_123',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    expect(tenant.subscriptionStatus).toBe(SubscriptionStatus.ACTIVE);
    expect(tenant.isActive()).toBe(true);
  });

  it('should reject invalid slug', () => {
    expect(() => Tenant.create({ name: 'Test', slug: 'Invalid Slug!' })).toThrow();
  });
});
