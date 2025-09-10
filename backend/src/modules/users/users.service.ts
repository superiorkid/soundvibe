import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { extname, join } from 'node:path';
import { isAbsoluteUrl } from 'src/common/helpers/check-absolute-url';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { AudioRepository } from '../audio/audio.repository';
import { CommentRepository } from '../comment/comment.repository';
import { PlaylistRepository } from '../playlist/playlist.repository';
import { RepostRepository } from '../repost/repost.repository';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';
import { UsersRepository } from './users.repository';
import { Response } from 'express';
import { createReadStream, statSync } from 'node:fs';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(
    private userRepository: UsersRepository,
    private commentRepository: CommentRepository,
    private audioRepository: AudioRepository,
    private repostRepository: RepostRepository,
    private playlistRepository: PlaylistRepository,
    private fileUploadService: FileUploadService,
  ) {}

  async findOneByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { displayUsername: username },
        include: {
          _count: { select: { audios: true } },
        },
      });
      if (!user) throw new NotFoundException();

      return {
        success: true,
        message: '',
        data: user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
    }
  }

  async getRecentComments(params: { limit: number; userId: string }) {
    const { limit, userId } = params;

    try {
      const comments = await this.commentRepository.findAll({
        where: { userId },
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { audio: true },
      });

      return {
        success: true,
        message: '',
        data: comments,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        'Failed to retrieve recent comments tracks.',
      );
    }
  }

  async getUserTracks(params: {
    username: string;
    filter: 'popular' | 'latest';
  }) {
    const { filter, username } = params;
    try {
      const tracks = await this.audioRepository.findAll({
        where: { user: { username } },
        orderBy:
          filter === 'popular' ? { likesCount: 'desc' } : { createdAt: 'desc' },
        include: {
          audioFile: true,
          user: true,
          genre: true,
          tags: true,
          coverFile: true,
          likes: { include: { user: true } },
          reposts: true,
          comments: true,
        },
      });

      // add streamUrl to each track
      const formattedTracks = tracks.map((track) => ({
        ...track,
        streamUrl: `/api/v1/audio/stream/${track.id}`,
      }));

      return {
        success: true,
        message: '',
        data: formattedTracks,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException('Failed to retrieve tracks.');
    }
  }

  async getUserReposts(username: string) {
    try {
      const reposts = await this.repostRepository.findAll({
        where: { user: { displayUsername: username } },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          audio: {
            include: {
              audioFile: true,
              user: true,
              genre: true,
              tags: true,
              coverFile: true,
              likes: { include: { user: true } },
              reposts: true,
              comments: true,
            },
          },
        },
      });

      const repostTracks = reposts.map((repost) => ({
        id: repost.id,
        type: 'repost',
        createdAt: repost.createdAt,
        user: repost.user,
        audio: {
          ...repost.audio,
          streamUrl: `/api/v1/audio/stream/${repost.audio.id}`,
        },
      }));

      return {
        success: true,
        message: '',
        data: repostTracks,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        'Failed to retrieve user reposts.',
      );
    }
  }

  async getUserPlaylists(username: string) {
    try {
      const playlists = await this.playlistRepository.findAll({
        where: { user: { displayUsername: username }, audios: { some: {} } },
        include: {
          playlistCoverFile: true,
          likes: { include: { user: true } },
          audios: {
            include: {
              audio: {
                include: {
                  audioFile: true,
                  coverFile: true,
                  genre: true,
                  user: true,
                  likes: { include: { user: true } },
                  reposts: { include: { user: true } },
                },
              },
            },
          },
          user: true,
        },
      });

      const playlistWithStreamUrl = playlists.map((playlist) => ({
        ...playlist,
        audios: playlist.audios.map((playlistAudio) => ({
          ...playlistAudio,
          audio: {
            ...playlistAudio.audio,
            streamUrl: `/api/v1/audio/stream/${playlistAudio.audio.id}`,
          },
        })),
      }));

      return {
        success: true,
        message: '',
        data: playlistWithStreamUrl,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        'Failed to retrieve user playlists.',
      );
    }
  }

  async updateUserProfile(params: {
    userId: string;
    updateUserProfileDto: UpdateUserProfileDTO;
  }) {
    const { updateUserProfileDto, userId } = params;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('');

    try {
      let profileImagePath: string | null = user.image ?? null;

      if (updateUserProfileDto.newProfileImage) {
        const file = updateUserProfileDto.newProfileImage;
        if (profileImagePath && !isAbsoluteUrl(profileImagePath)) {
          await this.fileUploadService.remove(profileImagePath);
        }

        const profileFolder = `${userId}/profile`;
        profileImagePath = await this.fileUploadService.upload(
          file.buffer,
          `${userId}${extname(file.originalName)}`,
          profileFolder,
        );
      } else if (updateUserProfileDto.existingProfileImage === '') {
        if (profileImagePath && !isAbsoluteUrl(profileImagePath)) {
          await this.fileUploadService.remove(profileImagePath);
        }
        profileImagePath = null;
      } else if (updateUserProfileDto.existingProfileImage) {
        profileImagePath = updateUserProfileDto.existingProfileImage;
      }

      await this.userRepository.update({
        where: { id: userId },
        data: {
          name: updateUserProfileDto.displayName,
          firstName: updateUserProfileDto.firstName,
          lastName: updateUserProfileDto.lastName,
          bio: updateUserProfileDto.bio,
          city: updateUserProfileDto.city,
          country: updateUserProfileDto.country,
          image: profileImagePath,
        },
      });

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException('Failed to update user profile.');
    }
  }

  async getPofileImage(params: { id: string; res: Response }) {
    const { id, res } = params;

    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user || !user.image) {
      throw new NotFoundException('Profile image not found.');
    }

    const filePath = join(process.cwd(), 'public', user.image);

    try {
      const stat = statSync(filePath);
      const fileSize = stat.size;

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-cache',
      });

      createReadStream(filePath).pipe(res);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('profile image file not accessible');
    }
  }
}
