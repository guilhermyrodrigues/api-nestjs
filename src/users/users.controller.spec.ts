import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const usersServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate create to UsersService', async () => {
    usersServiceMock.create.mockResolvedValue({ id: 'user-1' });

    await expect(
      controller.create({
        name: 'Alice',
        email: 'alice@example.com',
        password: '12345678',
        role: 'ADMIN',
      }),
    ).resolves.toEqual({ id: 'user-1' });

    expect(usersServiceMock.create).toHaveBeenCalled();
  });
});
