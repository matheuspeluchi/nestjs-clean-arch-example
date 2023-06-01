import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EncryptionService } from '../../interfaces/encryption.interface';

@Injectable()
export class BcryptService extends EncryptionService {
  rounds = 10;

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
