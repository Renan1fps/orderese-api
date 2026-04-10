import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../domain/ports/password-hasher.port';

@Injectable()
export class BcryptHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 12;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
