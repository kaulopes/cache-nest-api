import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../common/interfaces/product.interface';
import { faker } from '@faker-js/faker';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService, // Injetando o CacheService
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    // Cache the newly created product
    await this.cacheService.set(`product:${product.id}`, product);

    return product;
  }

  async findAll(): Promise<Product[]> {
    const cachedProducts = await this.cacheService.get<Product[]>('products');
    if (cachedProducts) {
      return cachedProducts;
    }

    const products = await this.prisma.product.findMany();
    await this.cacheService.set('products', products);
    return products;
  }

  async findOne(id: number): Promise<Product | null> {
    const cachedProduct = await this.cacheService.get<Product>(`product:${id}`);
    if (cachedProduct) {
      return cachedProduct;
    }

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (product) {
      await this.cacheService.set(`product:${product.id}`, product);
    }
    return product;
  }

  async createBulk(storeId: number, count: number): Promise<void> {
    const products: CreateProductDto[] = [];

    for (let i = 0; i < count; i++) {
      const product = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.datatype.number({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        storeId,
      };
      products.push(product);
    }

    await this.prisma.product.createMany({ data: products });

    // Atualiza o cache com os novos produtos
    const allProducts = await this.prisma.product.findMany();
    await this.cacheService.set('products', allProducts);
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
    await this.cacheService.del(`product:${id}`);

    // Invalidate cache for all products
    await this.cacheService.del('products');
  }
}
