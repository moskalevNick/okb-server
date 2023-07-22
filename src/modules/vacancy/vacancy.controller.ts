import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma, Vacancy } from '@prisma/client';
import { VacancyService } from './vacancy.service';
import { VacancyEntity } from './entity/vacancy.entity';

@ApiTags('vacancy')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @ApiOperation({ summary: 'Create vacancy' })
  @ApiCreatedResponse({ type: VacancyEntity })
  @ApiBody({ type: VacancyEntity })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createVacancytDto: Prisma.VacancyCreateInput,
  ) {
    return this.vacancyService.create(createVacancytDto);
  }

  @ApiOperation({ summary: 'Get all vacancies' })
  @ApiOkResponse({ type: VacancyEntity, isArray: true })
  @Get()
  findAll(): Promise<Vacancy[]> {
    return this.vacancyService.findAll();
  }

  @ApiOperation({ summary: 'Get vacancy' })
  @ApiOkResponse({ type: VacancyEntity })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Vacancy> {
    return this.vacancyService.getbyId(id);
  }

  @ApiOperation({ summary: 'Edit vacancy' })
  @ApiOkResponse({ type: VacancyEntity })
  @ApiBody({ type: VacancyEntity })
  @Put(':id')
  update(
    @Body()
    updateVacancyDto: Prisma.VacancyUpdateInput,
    @Param('id') id: string,
  ): Promise<Vacancy> {
    return this.vacancyService.update(id, updateVacancyDto);
  }

  @ApiOperation({ summary: 'Delete vacancy' })
  @ApiOkResponse({ type: VacancyEntity })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Vacancy> {
    return this.vacancyService.delete(id);
  }
}
