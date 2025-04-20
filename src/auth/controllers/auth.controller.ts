import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { LoggedInResponseDto } from '../dto/logged-in-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({type: LoggedInResponseDto})
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUserOrThrow(loginDto.email, loginDto.password);

    return this.authService.login(user);
  }

  @Post('register')
  @ApiOkResponse({type: UserResponseDto})
  async register(@Body() createUserDto: CreateUserDto) {
    const user = this.authService.register(createUserDto.email, createUserDto.password);

    return plainToInstance(UserResponseDto, user);
  }
}
