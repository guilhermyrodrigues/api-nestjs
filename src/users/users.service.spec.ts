import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  const prismaServiceMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create user with hashed password', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    prismaServiceMock.user.create.mockResolvedValue({ id: 'user-1' });

    await service.create({
      name: 'Alice',
      email: 'alice@example.com',
      password: '12345678',
      role: 'ADMIN',
    });

    expect(prismaServiceMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ password: 'hashed' }),
      }),
    );
  });

  it('should throw ConflictException when email is already in use', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    prismaServiceMock.user.create.mockRejectedValue({ code: 'P2002' });

    await expect(
      service.create({
        name: 'Alice',
        email: 'alice@example.com',
        password: '12345678',
        role: 'ADMIN',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should throw BadRequestException for invalid email', async () => {
    await expect(
      service.create({
        name: 'Alice',
        email: 'invalid',
        password: '12345678',
        role: 'ADMIN',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should throw NotFoundException when user is not found in findOne', async () => {
    prismaServiceMock.user.findUnique.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should throw NotFoundException when remove gets P2025', async () => {
    prismaServiceMock.user.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.remove('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
