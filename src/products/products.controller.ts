import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, Query, UseGuards } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role, Services } from 'src/utils/constants';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';
import { IProductService } from './products.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/role.decorator';
import { RolesGuard } from '../auth/guards/role.guard';

@ApiTags()
@UseFilters(new HttpExceptionFilter())
@Controller()
export class ProductsController {
  constructor(@Inject(Services.PRODUCTS) private readonly productService: IProductService) { }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.create(createProductDto);
    }
    catch (error) {
      throw new HttpException(error.sqlMessage, error.code | 400);
    }
  }

  @Get()
  @ApiQuery({ name: 'stock', required: false, type: Number, description: 'Filter by stock quantity' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum price range' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum price range' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit per page' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Search by product name' })
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const Product = await this.productService.findOne(id);
    if (!Product) throw new HttpException(`no Product with id: ${id}`, HttpStatus.BAD_REQUEST);
    return Product;
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    const Product = await this.productService.findOne(id);
    if (!Product) throw new HttpException(`no product with id: ${id}`, HttpStatus.NOT_FOUND);

    return this.productService.update(id, updateProductDto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    const result = await this.productService.remove(id);
    if (result.affected === 0) throw new HttpException(`no product with id: ${id}`, HttpStatus.NOT_FOUND);
  }
}
