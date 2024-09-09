import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from '../common/interfaces/store.interface';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    return this.prisma.store.create({ data: createStoreDto });
  }

  async findAll(): Promise<Store[]> {
    return this.prisma.store.findMany();
  }

  async findOne(id: number): Promise<Store | null> {
    return this.prisma.store.findUnique({ where: { id } });
  }

  async update(id: number, updateStoreDto: UpdateStoreDto): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data: updateStoreDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.store.delete({ where: { id } });
  }
}
