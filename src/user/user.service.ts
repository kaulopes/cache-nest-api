import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, PublicUser } from '../common/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
    return { id: user.id, email: user.email };
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
    }));
  }

  async findOne(id: number): Promise<PublicUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return { id: user.id, email: user.email };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    const data: Partial<User> = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    return { id: updatedUser.id, email: updatedUser.email };
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
