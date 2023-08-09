import { PartnerLogo } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class logoEntity implements PartnerLogo {
  id: string;
  partnerId: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  publicUrl: string;
}
