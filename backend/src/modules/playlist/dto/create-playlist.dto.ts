import { ApiProperty } from '@nestjs/swagger';
import { PlaylistTypeEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePlaylistDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    description: 'The title of the playlist',
    example: 'My Favorite Songs',
    maxLength: 100,
  })
  title: string;

  @IsEnum(PlaylistTypeEnum)
  @ApiProperty({
    description: 'The visibility type of the playlist',
    example: PlaylistTypeEnum.public,
    enum: PlaylistTypeEnum,
  })
  type: PlaylistTypeEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The audio file ID or URL associated with the playlist',
    example: 'audio-12345',
  })
  audio: string;
}
