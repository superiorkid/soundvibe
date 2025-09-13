import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
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
    description: 'Audio file (WAV, FLAC, AIFF, ALAC, MP3 up to 100MB)',
    example: 'audio-file.mp3',
  })
  @IsFile({ message: 'audioFile must be a valid file' })
  @MaxFileSize(MAX_AUDIO_SIZE, {
    message: `Audio file size must be less than ${MAX_AUDIO_SIZE / (1024 * 1024)}MB`,
  })
  @HasMimeType(ACCEPTED_AUDIO_TYPES, {
    message: `Invalid audio format. Accepted types: ${ACCEPTED_AUDIO_TYPES.join(', ')}`,
  })
  audioFile: MemoryStoredFile;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Cover image (JPG, PNG, WEBP up to 3MB)',
    example: 'cover-image.jpg',
  })
  @IsOptional()
  @IsFile({ message: 'cover must be a valid image file' })
  @MaxFileSize(MAX_COVER_SIZE, {
    message: `Cover image size must be less than ${MAX_COVER_SIZE / (1024 * 1024)}MB`,
  })
  @HasMimeType(ACCEPTED_IMAGE_TYPES, {
    message: `Invalid image format. Accepted types: ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
  })
  cover?: MemoryStoredFile;

  @ApiProperty({
    description: 'Title of the audio track',
    example: 'My First Track',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @Length(1, 255, { message: 'title must be between 1 and 255 characters' })
  title: string;

  @ApiProperty({
    description:
      'The artist(s) responsible for the audio track. For multiple artists, separate with commas.',
    example: 'Martin Garrix, Kygo',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'artist must be a string' })
  @IsNotEmpty({ message: 'artist is required' })
  @Length(1, 255, { message: 'artist must be between 1 and 255 characters' })
  artist: string;

  @ApiProperty({
    description: 'Genre ID of the track (cuid)',
    example: 'ckv8z1o1a0000r4d7h8f7xj9w',
    pattern: '^c[a-z0-9]{24}$',
  })
  @IsString({ message: 'genreId must be a string' })
  @IsNotEmpty({ message: 'genreId is required' })
  @Matches(/^c[a-z0-9]{24}$/, {
    message:
      'genreId must be a valid cuid format (starts with "c" followed by 24 alphanumeric characters)',
  })
  genreId: string;

  @ApiPropertyOptional({
    description: 'Additional tags for the track',
    example: ['study', 'chill', 'instrumental'],
    type: [String],
    maxItems: 10,
  })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @IsArray({ message: 'additionalTags must be an array' })
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 tags' })
  @IsOptional()
  additionalTags?: string[];

  @ApiPropertyOptional({
    description: 'Description of the track',
    example: 'A relaxing lo-fi beat for study sessions',
    maxLength: 1000,
  })
  @IsString({ message: 'description must be a string' })
  @MaxLength(1000, { message: 'description cannot exceed 1000 characters' })
  @IsOptional()
  description?: string;
}
