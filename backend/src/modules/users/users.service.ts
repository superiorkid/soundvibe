import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AudioRepository } from '../audio/audio.repository';
import { CommentRepository } from '../comment/comment.repository';
import { RepostRepository } from '../repost/repost.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(
    private userRepository: UsersRepository,
    private commentRepository: CommentRepository,
    private audioRepository: AudioRepository,
    private repostRepository: RepostRepository,
  ) {}

  async findOneByUsername(username: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { displayUsername: username },
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
        streamUrl: `/api/audio/stream/${track.id}`,
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
          streamUrl: `/api/audio/stream/${repost.audio.id}`,
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
        'Failed to retrieve recent liked tracks.',
      );
    }
  }
}
