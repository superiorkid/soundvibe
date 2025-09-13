import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AudioRepository } from '../audio/audio.repository';
import { PlaylistRepository } from '../playlist/playlist.repository';
import { UsersRepository } from '../users/users.repository';
import { isAbsoluteUrl } from 'src/common/helpers/check-absolute-url';

@Injectable()
export class SearchService {
  protected readonly logger = new Logger(SearchService.name);

  constructor(
    private playlistRepository: PlaylistRepository,
    private audioRepository: AudioRepository,
    private userRepository: UsersRepository,
  ) {}

  async searchEverythng(params: { keyword: string; limit?: number }) {
    const { keyword, limit } = params;

    if (!keyword || !keyword.trim())
      throw new BadRequestException('Keyword is required');

    try {
      const [users, playlists, tracks] = await Promise.all([
        this.userRepository.findAll({
          where: { name: { contains: keyword, mode: 'insensitive' } },
          take: limit,
          orderBy: { followersCounts: 'desc' },
        }),
        this.playlistRepository.findAll({
          where: { title: { contains: keyword, mode: 'insensitive' } },
          take: limit,
          include: { playlistCoverFile: true, user: true },
          orderBy: { likeCount: 'desc' },
        }),
        this.audioRepository.findAll({
          where: { title: { contains: keyword, mode: 'insensitive' } },
          take: limit,
          include: { coverFile: true, user: true },
          orderBy: { likesCount: 'desc' },
        }),
      ]);

      const mergedResults = [
        ...users.map((user) => ({
          id: user.id,
          title: user.name,
          slug: user.displayUsername,
          cover: user.image
            ? isAbsoluteUrl(user.image)
              ? user.image
              : `${process.env.BETTER_AUTH_URL}/api/v1/users/cover/${user.id}`
            : 'https://github.com/shadcn.png',
          type: 'user' as const,
        })),
        ...playlists.map((playlist) => ({
          id: playlist.id,
          title: playlist.title,
          slug: playlist.slug,
          username: playlist.user.displayUsername,
          cover: playlist.playlistCoverFile
            ? `${process.env.BETTER_AUTH_URL}/api/v1/playlists/cover/${playlist.id}`
            : 'https://github.com/shadcn.png',
          type: 'playlist' as const,
        })),
        ...tracks.map((track) => ({
          id: track.id,
          username: track.user.displayUsername,
          title: track.title,
          slug: track.slug,
          cover: track.coverFile
            ? `${process.env.BETTER_AUTH_URL}/api/v1/audio/cover/${track.id}`
            : 'https://github.com/shadcn.png',
          type: 'track' as const,
        })),
      ];

      return {
        success: true,
        message: '',
        data: mergedResults,
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to show search results :: ${(error as Error).message}`,
      );
    }
  }
}
