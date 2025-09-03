import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_COVER_SIZE = 3 * 1024 * 1024;

export class UpdatePlaylistDTO {
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
