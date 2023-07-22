import { Injectable } from '@nestjs/common';
import { Product, Prisma, Image } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { FirebaseStorageProvider } from 'src/providers/firebase-storage.provider';
import { ImageService } from '../image/image.service';

@Injectable()
export class ProductService {
  constructor(
    private storageProvider: FirebaseStorageProvider,
    private prisma: PrismaService,
    private imageService: ImageService,
  ) {}

  async create(productDto: Omit<Prisma.ProductCreateInput, 'id' | 'image'>) {
    const createdProduct = await this.prisma.product.create({
      data: productDto,
    });

    return createdProduct;
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async uploadImage(
    productId: string,
    file: Express.Multer.File,
    type: string,
  ): Promise<Image> {
    const product = await this.getbyId(productId);

    let oldImage: Image | undefined;
    switch (type) {
      case 'productImage':
        oldImage = await this.prisma.image.findFirst({
          where: { productId, type },
        });

        if (oldImage) {
          await this.storageProvider.delete(oldImage.path);
          await this.prisma.image.delete({
            where: { id: oldImage.id },
          });
        }
        break;
      case 'productBackground':
        oldImage = await this.prisma.image.findFirst({
          where: { productId, type },
        });

        if (oldImage) {
          await this.storageProvider.delete(oldImage.path);
          await this.prisma.image.delete({
            where: { id: oldImage.id },
          });
        }
        break;
    }

    const { fullName, name } = await this.storageProvider.upload(file, type);

    return this.imageService.create({
      path: fullName,
      productId: product.id,
      type,
      publicUrl: `https://firebasestorage.googleapis.com/v0/b/okb-acad.appspot.com/o/${type}%2F${name}?alt=media`,
    });
  }

  async getbyId(id: Product['id']): Promise<
    Prisma.ProductGetPayload<{
      include: {
        image: true;
      };
    }>
  > {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        client: true,
        description: true,
        materials: true,
        time: true,
        image: true,
      },
    });

    return product;
  }

  async update(
    id: Product['id'],
    productDto: Prisma.ProductUpdateInput,
  ): Promise<
    Prisma.ProductGetPayload<{
      include: {
        image: true;
      };
    }>
  > {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...productDto,
      },
      select: {
        id: true,
        name: true,
        client: true,
        description: true,
        materials: true,
        time: true,
        image: true,
      },
    });
  }

  async delete(id: Product['id']): Promise<Product> {
    const product = await this.getbyId(id);

    product.image.forEach(async (image) => {
      await this.imageService.delete(image.id);
    });

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
