import { Global, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Global()
@Module({
  controllers: [ProductController],
  providers: [ProductService, FirebaseStorageProvider],
  exports: [ProductService],
})
export class ProductModule {}
