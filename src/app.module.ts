import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductModule } from './modules/product/product.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ImageModule } from './modules/image/image.module';
import { VacancyModule } from './modules/vacancy/vacancy.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    ProductModule,
    ImageModule,
    VacancyModule,
  ],
})
export class AppModule {}
