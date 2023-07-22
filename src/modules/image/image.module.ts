import { Global, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage.provider';

@Global()
@Module({
  providers: [ImageService, FirebaseStorageProvider],
  exports: [ImageService],
})
export class ImageModule {}
