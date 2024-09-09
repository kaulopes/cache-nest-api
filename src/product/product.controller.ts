import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../common/interfaces/product.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, description: 'Return product by ID.' })
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productService.findOne(+id);
  }

  @Post('bulk/:storeId')
  @ApiOperation({ summary: 'Create products in bulk' })
  @ApiResponse({
    status: 201,
    description: 'Products have been successfully created in bulk.',
  })
  createBulk(@Param('storeId') storeId: string): Promise<void> {
    return this.productService.createBulk(+storeId, 50); // Criando 50 produtos por padrão
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({
    status: 204,
    description: 'The product has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.productService.remove(+id);
  }
}
