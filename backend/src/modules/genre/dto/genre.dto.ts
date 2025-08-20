import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenreDTO {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  name: string;
}
