import { Vacancy } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VacancyEntity implements Vacancy {
  id: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  descriptionItem: string[];

  @ApiProperty()
  contact: string;

  @ApiProperty()
  salary: string;
}
