import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../models/user.entity';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @Exclude()
  password: string;
}
