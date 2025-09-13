import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CommentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'Comment content cannot be empty' })
  @MaxLength(1000, { message: 'Comment cannot exceed 1000 characters' })
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This track is amazing! The production quality is outstanding.',
    minLength: 1,
    maxLength: 1000,
  })
  content: string;

  @IsNumber()
  @Min(0, { message: 'Timestamp cannot be negative' })
  @Max(3600, { message: 'Timestamp cannot exceed 3600 seconds (1 hour)' })
  @ApiProperty({
    description: 'The track time in seconds where the comment is placed',
    example: 45.2,
    minimum: 0,
    maximum: 3600,
  })
  timestamp: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The ID of the parent comment if this is a reply',
    example: 'comment123',
    required: false,
  })
  parentId?: string;
}
