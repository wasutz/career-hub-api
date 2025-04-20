import { ApiProperty } from '@nestjs/swagger';

export class LoggedInResponseDto {
  @ApiProperty()
  access_token: string;
}
