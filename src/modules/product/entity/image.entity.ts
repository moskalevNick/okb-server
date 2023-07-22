import { Image } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ImageEntity implements Image {
  id: string;
  productId: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  publicUrl: string;

  @ApiProperty()
  type: string;
}
