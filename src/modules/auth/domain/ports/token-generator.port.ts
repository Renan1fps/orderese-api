export const TOKEN_GENERATOR = Symbol('TOKEN_GENERATOR');

export interface TokenPayload {
  sub: string;
  tenantId: string;
  role: string;
}

export interface ITokenGenerator {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
