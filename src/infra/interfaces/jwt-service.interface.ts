export interface IJwtServicePayload {
  username: string;
}

export abstract class JwtService {
  abstract verify(token: string, secret?: string): Promise<boolean>;
  abstract getUserFromToken(token: string): string;
  abstract createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
