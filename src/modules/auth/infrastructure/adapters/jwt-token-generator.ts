import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenGenerator, TokenPayload } from '../../domain/ports/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }
}
