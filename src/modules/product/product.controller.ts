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
import { Prisma, Image, Product } from '@prisma/client';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductEntity } from './entity/product.entity';
import { ImageEntity } from './entity/image.entity';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiCreatedResponse({ type: ProductEntity })
  @ApiBody({ type: ProductEntity })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createProductDto: Prisma.ProductCreateInput,
  ) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get product' })
  @ApiOkResponse({ type: ProductEntity })
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Product> {
    return this.productService.getbyId(id);
  }

  @ApiOperation({ summary: 'Edit product' })
  @ApiOkResponse({ type: ProductEntity })
  @ApiBody({ type: ProductEntity })
  @Put(':id')
  update(
    @Body()
    updateProductDto: Omit<Prisma.ProductUpdateInput, 'image'>,
    @Param('id') id: string,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiOkResponse({ type: ProductEntity })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<Product> {
    return this.productService.delete(id);
  }

  @ApiOperation({ summary: 'upload product image' })
  @Post('image/:productId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ type: ImageEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async uploadImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return this.productService.uploadImage(productId, file, 'productImage');
  }

  @ApiOperation({ summary: 'upload product background' })
  @Post('background/:productId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ type: ImageEntity })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  public async uploadBackground(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Image> {
    return this.productService.uploadImage(
      productId,
      file,
      'productBackground',
    );
  }
}
