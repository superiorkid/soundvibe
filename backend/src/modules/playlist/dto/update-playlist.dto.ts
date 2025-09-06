import { ApiPropertyOptional } from '@nestjs/swagger';
import { PlaylistTypeEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_COVER_SIZE = 3 * 1024 * 1024;

export class UpdatePlaylistDTO {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Title of the playlist',
    example: 'My Playlist',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Description of the playlist',
    example: 'My favorite tracks',
  })
  description?: string;

  @IsOptional()
  @IsEnum(PlaylistTypeEnum)
  @ApiPropertyOptional({
    enum: PlaylistTypeEnum,
    description: 'Playlist type (public/private)',
  })
  type?: PlaylistTypeEnum;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Cover URL if not uploading a new file',
    example: 'https://example.com/cover.jpg',
  })
  coverUrl?: string;

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
  coverFile?: MemoryStoredFile;
}
