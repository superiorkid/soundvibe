import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

export class UpdateUserProfileDTO {
  @ApiPropertyOptional({ description: 'User biography/about text' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'City where user lives' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Country where user lives' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Display name of the user' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiPropertyOptional({ description: 'First name of the user' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Cover image file',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(MAX_IMAGE_SIZE)
  @HasMimeType(ACCEPTED_IMAGE_TYPES)
  newProfileImage?: MemoryStoredFile;

  @ApiPropertyOptional({
    description:
      'Existing profile image URL/path (kept if absolute URL, removed if relative)',
  })
  @IsOptional()
  @IsString()
  existingProfileImage?: string;
}
