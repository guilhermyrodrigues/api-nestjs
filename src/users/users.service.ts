import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private validateEmail(email?: string) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('E-mail inválido.');
    }
  }

  private validatePassword(password?: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException('Senha deve ter no mínimo 8 caracteres.');
    }
  }

  private isPrismaError(error: unknown, code: string): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === code
    );
  }

  async create(createUserDto: CreateUserDto) {
    this.validateEmail(createUserDto.email);
    this.validatePassword(createUserDto.password);

    try {
      return await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (this.isPrismaError(error, 'P2002')) {
        throw new ConflictException('E-mail já está em uso.');
      }

      throw error;
    }
  }

  findAll() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      this.validateEmail(updateUserDto.email);
    }

    if (updateUserDto.password) {
      this.validatePassword(updateUserDto.password);
    }

    const data = {
      ...updateUserDto,
      ...(updateUserDto.password
        ? { password: await bcrypt.hash(updateUserDto.password, 10) }
        : {}),
    };

    try {
      return await this.prismaService.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (this.isPrismaError(error, 'P2002')) {
        throw new ConflictException('E-mail já está em uso.');
      }

      if (this.isPrismaError(error, 'P2025')) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.user.delete({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (this.isPrismaError(error, 'P2025')) {
        throw new NotFoundException('Usuário não encontrado.');
      }

      throw error;
    }
  }
}
