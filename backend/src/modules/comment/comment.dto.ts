import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentDTO {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @ApiProperty()
  timestamp: number;

  @IsString()
  @ApiPropertyOptional()
  @IsOptional()
  parentId?: string;
}
