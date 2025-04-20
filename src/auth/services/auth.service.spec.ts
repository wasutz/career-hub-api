import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../user/models/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
    role: UserRole.USER,
  };

  const mockUserService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUserOrThrow', () => {
    it('should return user data if credentials are valid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const compareMock = jest.spyOn(bcrypt, 'compare') as jest.Mock;
      compareMock.mockResolvedValue(true);

      const result = await authService.validateUserOrThrow(mockUser.email, 'password');

      expect(result).toEqual({ id: mockUser.id, email: mockUser.email, role: UserRole.USER });
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(mockUser.email);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const compareMock = jest.spyOn(bcrypt, 'compare') as jest.Mock;
      compareMock.mockResolvedValue(false);

      await expect(authService.validateUserOrThrow(mockUser.email, 'wrong-password'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(undefined);

      await expect(authService.validateUserOrThrow('notfound@example.com', 'password'))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return JWT token', async () => {
      mockJwtService.sign.mockReturnValue('mock-token');

      const result = await authService.login({ id: 1, email: 'test@example.com' });

      expect(result).toEqual({ access_token: 'mock-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'test@example.com',
        sub: 1,
      });
    });
  });

  describe('register', () => {
    it('should hash password and call createUser', async () => {
      const password = 'plain-password';
      const hashed = 'hashed-password';

      const compareMock = jest.spyOn(bcrypt, 'hash') as jest.Mock;
      compareMock.mockResolvedValue(hashed);

      const userDto = { id: 1, email: 'test@example.com', role: UserRole.USER };

      mockUserService.createUser.mockResolvedValue(userDto);

      const result = await authService.register('test@example.com', password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: hashed,
        role: UserRole.USER
      });

      expect(result).toEqual(userDto);
    });
  });
});