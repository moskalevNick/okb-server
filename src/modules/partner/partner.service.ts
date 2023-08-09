import { Injectable } from '@nestjs/common';
import { Partner, Prisma, Image, PartnerLogo } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { FirebaseStorageProvider } from '../../providers/firebase-storage.provider';
import { ImageService } from '../image/image.service';

@Injectable()
export class PartnerService {
  constructor(
    private storageProvider: FirebaseStorageProvider,
    private prisma: PrismaService,
    private imageService: ImageService,
  ) {}

  async create(partnerDto: Omit<Prisma.PartnerCreateInput, 'id' | 'logo'>) {
    const createdPartner = await this.prisma.partner.create({
      data: partnerDto,
    });

    return createdPartner;
  }

  async findAll(): Promise<
    Prisma.PartnerGetPayload<{
      include: {
        logo: true;
      };
    }>[]
  > {
    return await this.prisma.partner.findMany({
      select: {
        id: true,
        text: true,
        logo: true,
      },
    });
  }

  async getbyId(id: Partner['id']): Promise<
    Prisma.PartnerGetPayload<{
      include: {
        logo: true;
      };
    }>
  > {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
      select: {
        id: true,
        text: true,
        logo: true,
      },
    });

    return partner;
  }

  async update(
    id: Partner['id'],
    partnerDto: Prisma.PartnerUpdateInput,
  ): Promise<
    Prisma.PartnerGetPayload<{
      include: {
        logo: true;
      };
    }>
  > {
    return this.prisma.partner.update({
      where: {
        id,
      },
      data: {
        ...partnerDto,
      },
      select: {
        id: true,
        text: true,
        logo: true,
      },
    });
  }

  async delete(id: Partner['id']): Promise<Partner> {
    const partner = await this.getbyId(id);

    if (partner.logo) {
      await this.imageService.deleteLogo(partner.logo.id);
    }

    return this.prisma.partner.delete({
      where: {
        id,
      },
    });
  }

  async uploadLogo(
    partnerId: string,
    file: Express.Multer.File,
  ): Promise<PartnerLogo> {
    const partner = await this.getbyId(partnerId);

    const oldLogo: PartnerLogo | undefined =
      await this.prisma.partnerLogo.findFirst({
        where: { partnerId },
      });

    if (oldLogo) {
      await this.storageProvider.delete(oldLogo.path);
      await this.prisma.partnerLogo.delete({
        where: { id: oldLogo.id },
      });
    }

    const { fullName, name } = await this.storageProvider.upload(
      file,
      'partnerLogo',
    );

    return this.imageService.createLogo({
      path: fullName,
      partnerId: partner.id,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/okb-acad.appspot.com/o/partnerLogo%2F${name}?alt=media`,
    });
  }
}
