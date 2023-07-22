import { Injectable } from '@nestjs/common';
import { Image, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';

@Injectable()
export class ImageService {
  constructor(
    private prisma: PrismaService,
    private storageProvider: FirebaseStorageProvider,
  ) {}

  async create(imageDto: Prisma.ImageUncheckedCreateInput): Promise<Image> {
    const newImage = await this.prisma.image.create({ data: imageDto });

    return newImage;
  }

  async delete(id: Image['id']): Promise<Image> {
    const image = await this.prisma.image.findFirst({ where: { id } });
    await this.storageProvider.delete(image.path);

    return image;
  }
}
