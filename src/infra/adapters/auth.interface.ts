export interface IJwtServicePayload {
  username: string;
}

export abstract class AuthService {
  abstract verify(token: string): Promise<boolean>;
  abstract createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
}
