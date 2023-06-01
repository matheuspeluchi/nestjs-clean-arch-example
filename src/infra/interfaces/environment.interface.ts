export abstract class EnvironmentConfig {
  abstract getEnvironment(): string;
  abstract getDatabaseHost(): string;
  abstract getDatabasePort(): number;
  abstract getDatabaseUser(): string;
  abstract getDatabasePassword(): string;
  abstract getDatabaseName(): string;
  abstract getDatabaseSchema(): string;
  abstract getDatabaseSync(): boolean;
  abstract getJwtSecret(): string;
  abstract getJwtExpirationTime(): string;
  abstract getJwtRefreshSecret(): string;
  abstract getJwtRefreshExpirationTime(): string;
}
