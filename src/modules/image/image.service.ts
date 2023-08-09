import { Injectable } from '@nestjs/common';
import { Image, PartnerLogo, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage.provider';

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

  async createLogo(
    imageDto: Prisma.PartnerLogoUncheckedCreateInput,
  ): Promise<PartnerLogo> {
    const newLogo = await this.prisma.partnerLogo.create({ data: imageDto });

    return newLogo;
  }

  async deleteLogo(id: PartnerLogo['id']): Promise<PartnerLogo> {
    const partnerLogo = await this.prisma.partnerLogo.findFirst({
      where: { id },
    });
    await this.storageProvider.delete(partnerLogo.path);

    return partnerLogo;
  }
}
