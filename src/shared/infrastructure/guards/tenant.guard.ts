import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user: { tenantId: string } }>();
    const tenantIdFromParam = request.params['tenantId'];

    if (!tenantIdFromParam) return true;

    if (request.user?.tenantId !== tenantIdFromParam) {
      throw new ForbiddenException('You do not have access to this tenant');
    }

    return true;
  }
}
