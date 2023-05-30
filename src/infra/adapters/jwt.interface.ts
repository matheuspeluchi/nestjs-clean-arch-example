export interface IJwtServicePayload {
  username: string;
}

export abstract class JwtService {
  abstract checkToken(token: string): Promise<any>;
  abstract createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
