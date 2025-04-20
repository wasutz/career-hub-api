import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dto/user-response.dto';

export class JobResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  createdBy: UserResponseDto;
}
