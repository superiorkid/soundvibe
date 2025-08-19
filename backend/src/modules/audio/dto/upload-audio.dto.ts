import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export const MAX_AUDIO_SIZE = 100 * 1024 * 1024;
export const MAX_COVER_SIZE = 3 * 1024 * 1024;
export const ACCEPTED_AUDIO_TYPES = [
  'audio/wav',
  'audio/x-wav',
  'audio/flac',
  'audio/x-flac',
  'audio/aiff',
  'audio/x-aiff',
  'audio/alac',
  'audio/x-alac',
  'audio/mpeg',
  'audio/mp3',
];
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class UploadAudioDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file (WAV, FLAC, AIFF, ALAC, up to 100MB)',
  })
  @IsFile()
  @MaxFileSize(MAX_AUDIO_SIZE)
  @HasMimeType(ACCEPTED_AUDIO_TYPES)
  audioFile: MemoryStoredFile;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Cover image (JPG, PNG, WEBP, MP3 up to 3MB)',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(MAX_COVER_SIZE)
  @HasMimeType(ACCEPTED_IMAGE_TYPES)
  cover?: MemoryStoredFile;

  @ApiProperty({
    description: 'Title of the audio track',
    example: 'My First Track',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Genre ID of the track (cuid)',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^c[a-z0-9]{24}$/, {
    message: 'genre must be a valid cuid',
  })
  genreId: string;

  // @ApiPropertyOptional({
  //   description: 'Additional tags for the track',
  //   example: ['study', 'chill', 'instrumental'],
  //   type: [String],
  // })
  // @IsString({ each: true })
  // @IsArray()
  // @IsOptional()
  // additionalTags?: string[];

  @ApiPropertyOptional({
    description: 'Description of the track',
    example: 'A relaxing lo-fi beat for study sessions',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
