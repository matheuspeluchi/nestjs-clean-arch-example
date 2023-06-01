import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { EncryptionService } from '../../interfaces/encryption.interface';

@Module({
  providers: [{ provide: EncryptionService, useClass: BcryptService }],
  exports: [EncryptionService],
})
export class BcryptModule {}
