import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should delegate login to AuthService', async () => {
    authServiceMock.login.mockResolvedValue({ access_token: 'token' });

    await expect(
      controller.login({ email: 'alice@example.com', password: '12345678' }),
    ).resolves.toEqual({ access_token: 'token' });

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'alice@example.com',
      password: '12345678',
    });
  });
});
