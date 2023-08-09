import { Global, Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage.provider';

@Global()
@Module({
  controllers: [PartnerController],
  providers: [PartnerService, FirebaseStorageProvider],
  exports: [PartnerService],
})
export class PartnerModule {}
