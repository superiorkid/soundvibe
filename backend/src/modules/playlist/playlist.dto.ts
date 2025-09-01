import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_COVER_SIZE = 3 * 1024 * 1024;

export class PlaylistDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'The title of the playlist',
    example: 'My Favorite Songs',
    maxLength: 100,
  })
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiPropertyOptional({
    description: 'Optional description of the playlist',
    example: 'A collection of my all-time favorite tracks',
    maxLength: 500,
  })
  description?: string;

  @IsFile()
  @IsOptional()
  @MaxFileSize(MAX_COVER_SIZE)
  @HasMimeType(ACCEPTED_IMAGE_TYPES)
  @ApiPropertyOptional({
    description: 'Cover image for the playlist',
    type: 'string',
    format: 'binary',
    example: 'playlist-cover.jpg',
  })
  cover?: MemoryStoredFile;
}
