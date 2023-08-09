import { Partner } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PartnerEntity implements Partner {
  id: string;

  @ApiProperty()
  text: string;
}
