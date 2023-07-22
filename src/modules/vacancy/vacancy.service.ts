import { Injectable } from '@nestjs/common';
import { Prisma, Vacancy } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VacancyService {
  constructor(private prisma: PrismaService) {}

  async create(vacancyDto: Omit<Prisma.VacancyCreateInput, 'id'>) {
    const createdVacancy = await this.prisma.vacancy.create({
      data: vacancyDto,
    });

    return createdVacancy;
  }

  async findAll(): Promise<Vacancy[]> {
    return await this.prisma.vacancy.findMany();
  }

  async getbyId(id: Vacancy['id']): Promise<Vacancy> {
    return this.prisma.vacancy.findUnique({
      where: { id },
    });
  }

  async update(
    id: Vacancy['id'],
    vacancyDto: Prisma.VacancyUpdateInput,
  ): Promise<Vacancy> {
    return this.prisma.vacancy.update({
      where: {
        id,
      },
      data: {
        ...vacancyDto,
      },
    });
  }

  async delete(id: Vacancy['id']): Promise<Vacancy> {
    return this.prisma.vacancy.delete({
      where: {
        id,
      },
    });
  }
}
