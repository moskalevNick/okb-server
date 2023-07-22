import { Product } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductEntity implements Product {
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  client: string;

  @ApiProperty()
  materials: string;

  @ApiProperty()
  time: string;

  @ApiProperty()
  description: string;
}
