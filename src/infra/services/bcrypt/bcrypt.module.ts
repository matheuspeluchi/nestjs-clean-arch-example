import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { EncryptionService } from '../../adapters/encryption.interface';

@Module({
  providers: [{ provide: EncryptionService, useClass: BcryptService }],
  exports: [EncryptionService],
})
export class BcryptModule {}
