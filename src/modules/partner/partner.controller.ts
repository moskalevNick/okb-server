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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma, Image, Partner, PartnerLogo } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { PartnerEntity } from './entity/partner.entity';
import { PartnerService } from './partner.service';
import { logoEntity } from './entity/logo.entity';

@ApiTags('partner')
@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @ApiOperation({ summary: 'Create partner' })
  @ApiCreatedResponse({ type: PartnerEntity })
  @ApiBody({ type: PartnerEntity })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createPartnerDto: Prisma.PartnerCreateInput,
  ) {
    return this.partnerService.create(createPartnerDto);
  }

  @ApiOperation({ summary: 'Get all partners' })
  @ApiOkResponse({ type: PartnerEntity, isArray: true })
  @Get()
  findAll() {
    return this.partnerService.findAll();
  }

  @ApiOperation({ summary: 'Get partner' })
  @ApiOkResponse({ type: PartnerEntity })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Partner> {
    return this.partnerService.getbyId(id);
  }

  @ApiOperation({ summary: 'Edit partner' })
  @ApiOkResponse({ type: PartnerEntity })
  @ApiBody({ type: PartnerEntity })
  @Put(':id')
  update(
    @Body()
    updatePartnerDto: Omit<Prisma.PartnerUpdateInput, 'logo'>,
    @Param('id') id: string,
  ): Promise<Partner> {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @ApiOperation({ summary: 'Delete partner' })
  @ApiOkResponse({ type: PartnerEntity })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Partner> {
    return this.partnerService.delete(id);
  }

  @ApiOperation({ summary: 'upload partner logo' })
  @Post('logo/:partnerId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ type: logoEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          format: 'binary',
        },
      },
    },
  })
  public async uploadLogo(
    @Param('partnerId') partnerId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PartnerLogo> {
    return this.partnerService.uploadLogo(partnerId, file);
  }
}
