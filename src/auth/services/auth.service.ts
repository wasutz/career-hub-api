import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/services/user.service';
import { UserRole } from '../../user/models/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserOrThrow(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid email or password');
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    const existedUserWithEmail = await this.userService.findByEmail(email);

    if (existedUserWithEmail) {
      throw new BadRequestException(`Email ${email} is already use`)
    }

    const hashed = await bcrypt.hash(password, 10);

    return this.userService.createUser({ email, password: hashed, role: UserRole.USER  });
  }
}
