import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    validateUserOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return the result', async () => {
      const dto: CreateUserDto = { email: 'test@example.com', password: 'password123' };
      const createdUser = { id: 1, ...dto };
      mockAuthService.register.mockResolvedValue(createdUser);

      const result = await authController.register(dto);

      expect(result).toEqual(createdUser);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const user = { id: 1, email: dto.email };
      const token = { access_token: 'mock-token' };

      mockAuthService.validateUserOrThrow.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(token);

      const result = await authController.login(dto);

      expect(result).toEqual(token);
      expect(mockAuthService.validateUserOrThrow).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });
  });
});
