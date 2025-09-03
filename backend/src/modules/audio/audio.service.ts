import { UserSession } from '@mguay/nestjs-better-auth';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { createReadStream, statSync } from 'node:fs';
import path, { join } from 'node:path';
import slugify from 'slugify';
import { DatabaseService } from 'src/shared/database/database.service';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { RepostRepository } from '../repost/repost.repository';
import { UsersRepository } from '../users/users.repository';
import { AudioPlaysRepository } from './audio-plays.repository';
import { AudioRepository } from './audio.repository';
import { UploadAudioDTO } from './dto/upload-audio.dto';
import { LikeRepository } from './like.repository';

@Injectable()
export class AudioService {
  protected readonly logger = new Logger(AudioService.name);

  constructor(
    private audioRepository: AudioRepository,
    private fileUploadService: FileUploadService,
    private databaseService: DatabaseService,
    private likeRepository: LikeRepository,
    private audioPlaysRepository: AudioPlaysRepository,
    private usersRepository: UsersRepository,
    private repostRepository: RepostRepository,
  ) {}

  async uploadTrack(uploadAudioDto: UploadAudioDTO, session: UserSession) {
    const audioSlug = slugify(uploadAudioDto.title, { lower: true });
    const userId = session.user.id;

    const audio = await this.audioRepository.findOne({
      where: { slug: audioSlug },
    });
    if (audio)
      throw new ConflictException('Audio with this title already exists.');

    let savedAudioFile: string | null = null;
    let savedCoverFile: string | null = null;

    const trackFolder = `${userId}/${audioSlug}`;

    try {
      return await this.databaseService.$transaction(async (trx) => {
        // Upload audio
        const audioExtension =
          path.extname(uploadAudioDto.audioFile.originalName) || '.mp3';
        savedAudioFile = await this.fileUploadService.upload(
          uploadAudioDto.audioFile.buffer,
          `${audioSlug}${audioExtension}`,
          trackFolder,
        );

        const duration = await this.getAudioDuration(
          uploadAudioDto.audioFile.buffer,
        );

        // Upload cover if exists
        if (uploadAudioDto.cover) {
          const coverExtension =
            path.extname(uploadAudioDto.cover.originalName) || '.png';
          savedCoverFile = await this.fileUploadService.upload(
            uploadAudioDto.cover.buffer,
            `${audioSlug}-cover${coverExtension}`,
            trackFolder, // pass folder
          );
        }

        // Save audio & cover in database
        const newAudio = await trx.audio.create({
          data: {
            duration,
            artist: uploadAudioDto.artist,
            title: uploadAudioDto.title,
            slug: audioSlug,
            description: uploadAudioDto.description,
            genreId: uploadAudioDto.genreId,
            userId: session.user.id,
          },
        });

        await trx.audioFile.create({
          data: {
            url: savedAudioFile,
            format: audioExtension.replace('.', ''),
            size: uploadAudioDto.audioFile.size,
            audioId: newAudio.id,
          },
        });

        if (savedCoverFile) {
          await trx.coverFile.create({
            data: {
              url: savedCoverFile,
              alt: `${uploadAudioDto.title} cover`,
              audioId: newAudio.id,
            },
          });
        }

        if (uploadAudioDto.additionalTags?.length) {
          await trx.tag.createMany({
            data: uploadAudioDto.additionalTags.map((tag) => ({
              name: tag,
              audioId: newAudio.id,
            })),
            skipDuplicates: true,
          });
        }

        return { success: true, message: 'Upload track successfully' };
      });
    } catch (error) {
      if (savedAudioFile) await this.fileUploadService.remove(savedAudioFile);
      if (savedCoverFile) await this.fileUploadService.remove(savedCoverFile);

      throw new InternalServerErrorException(
        'Something went wrong',
        (error as Error).message,
      );
    }
  }

  async detailAudio(id: string) {
    try {
      const audio = await this.audioRepository.findOne({
        where: { id },
        include: {
          user: true,
          tags: true,
          audioFile: true,
          coverFile: true,
          genre: true,
          likes: true,
          comments: true,
          _count: true,
        },
      });
      if (!audio) throw new NotFoundException('');

      return {
        data: {
          ...audio,
          streamUrl: `/api/audio/stream/${audio.id}`,
        },
        success: true,
        message: 'get detail audio successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
    }
  }

  async allAudios(params: { showRepost: boolean }) {
    try {
      const [audios, reposts] = await Promise.all([
        this.audioRepository.findAll({
          orderBy: { createdAt: 'desc' },
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
        }),
        // Only fetch reposts if showRepost is true
        params.showRepost
          ? this.repostRepository.findAll({
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
            })
          : Promise.resolve([]),
      ]);

      const audioFeed = audios.map((audio) => ({
        id: audio.id,
        type: 'audio',
        createdAt: audio.createdAt,
        user: audio.user,
        audio: {
          ...audio,
          streamUrl: `/api/audio/stream/${audio.id}`,
        },
      }));

      const repostFeed = reposts.map((repost) => ({
        id: repost.id,
        type: 'repost',
        createdAt: repost.createdAt,
        user: repost.user,
        audio: {
          ...repost.audio,
          streamUrl: `/api/audio/stream/${repost.audio.id}`,
        },
      }));

      // Only include reposts in the merged feed if showRepost is true
      const mergedFeed = params.showRepost
        ? [...audioFeed, ...repostFeed].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          )
        : audioFeed.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );

      return {
        success: true,
        message: '',
        data: mergedFeed,
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException('');
    }
  }

  async detailAudioBySlug(slug: string) {
    try {
      const audio = await this.audioRepository.findOne({
        where: { slug },
        include: {
          user: true,
          tags: true,
          audioFile: true,
          coverFile: true,
          genre: true,
          likes: { include: { user: true } },
          comments: true,
          reposts: true,
          _count: true,
        },
      });
      if (!audio) throw new NotFoundException('');

      return {
        data: {
          ...audio,
          streamUrl: `/api/audio/stream/${audio.id}`,
        },
        success: true,
        message: 'get detail audio successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
    }
  }

  async streamAudio(params: { id: string; req: Request; res: Response }) {
    const { id, req, res } = params;

    const audio = await this.audioRepository.findOne({
      where: { id },
      include: { audioFile: true },
    });
    if (!audio) throw new NotFoundException('Audio not found');

    const filePath = join(
      process.cwd(),
      'public',
      audio.audioFile?.url as string,
    );

    try {
      const stat = statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const file = createReadStream(filePath, { start, end });

        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize,
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'no-cache',
        });

        file.pipe(res);
      } else {
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'no-cache',
        });
        createReadStream(filePath).pipe(res);
      }
    } catch (e) {
      console.error('Streaming error:', e);
      throw new InternalServerErrorException('Failed to stream audio');
    }
  }

  async getCover(params: { id: string; res: Response }) {
    const { id, res } = params;
    const audio = await this.audioRepository.findOne({
      where: { id },
      include: { coverFile: true },
    });

    if (!audio || !audio.coverFile)
      throw new NotFoundException('Cover not found');

    const filePath = join(process.cwd(), 'public', audio.coverFile.url);
    try {
      const stat = statSync(filePath);
      const fileSize = stat.size;

      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-cache',
      });

      createReadStream(filePath).pipe(res);
    } catch (err) {
      console.error(err);
      throw new NotFoundException('Cover file not accessible');
    }
  }

  async likeAudio(params: { audioId: string; userId: string }) {
    const { audioId, userId } = params;
    const alreadyLiked = await this.likeRepository.exists({
      userId_audioId: {
        userId: userId,
        audioId: audioId,
      },
    });
    if (alreadyLiked) {
      throw new ConflictException('You have already liked this audio track');
    }

    try {
      await Promise.all([
        this.likeRepository.create({
          data: {
            audio: { connect: { id: audioId } },
            user: { connect: { id: userId } },
          },
        }),
        this.audioRepository.update({
          where: { id: audioId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.error(
        `Failed to like audio ${audioId} by user ${userId}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to like audio track. Please try again later.',
      );
    }
  }

  async unlikeAudio(params: { audioId: string; userId: string }) {
    const { audioId, userId } = params;

    const alreadyLiked = await this.likeRepository.exists({
      userId_audioId: {
        userId: userId,
        audioId: audioId,
      },
    });

    if (!alreadyLiked) {
      throw new NotFoundException('You have not liked this audio track yet');
    }

    try {
      await Promise.all([
        this.likeRepository.delete({
          where: {
            userId_audioId: {
              userId: userId,
              audioId: audioId,
            },
          },
        }),
        this.audioRepository.update({
          where: { id: audioId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      return {
        success: true,
        message: 'Audio track unliked successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to unlike audio ${audioId} by user ${userId}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to unlike audio track. Please try again later.',
      );
    }
  }

  async getRecentLikedTracks(params: {
    userId: string;
    limit: number;
    query?: string;
  }) {
    const { userId, limit, query } = params;

    try {
      const [recentLiked, total] = await Promise.all([
        this.likeRepository.findAll({
          where: {
            userId,
            ...(query
              ? {
                  audio: {
                    OR: [
                      { title: { contains: query } },
                      { artist: { contains: query } },
                    ],
                  },
                }
              : {}),
          },
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            audio: {
              include: {
                genre: true,
                coverFile: true,
                user: true,
                audioFile: true,
                likes: true,
                reposts: true,
              },
            },
          },
        }),
        this.likeRepository.count({ where: { userId } }),
      ]);

      return {
        success: true,
        message:
          recentLiked.length > 0
            ? 'Recent liked tracks retrieved successfully.'
            : 'No liked tracks found.',
        data: {
          total,
          recent: recentLiked.map((track) => ({
            ...track,
            audio: {
              ...track.audio,
              streamUrl: `/api/audio/stream/${track.audioId}`,
            },
          })),
        },
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to retrieve recent liked tracks.',
      );
    }
  }

  async incrementPlay(audioId: string, userId: string) {
    const audioExist = await this.audioRepository.exists({ id: audioId });
    if (!audioExist)
      throw new NotFoundException(`Audio with ID "${audioId}" not found.`);

    try {
      await Promise.all([
        this.audioRepository.update({
          where: { id: audioId },
          data: { playsCount: { increment: 1 } },
        }),
        this.audioPlaysRepository.create({
          data: {
            audio: { connect: { id: audioId } },
            user: { connect: { id: userId } },
          },
        }),
      ]);

      return {
        success: true,
        message: `Play count incremented for audio ID "${audioId}".`,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Failed to increment play count for audio ID "${audioId}". Error: ${(error as Error).message}`,
      );
    }
  }

  async getUsersWhoLikedAudio(params: { slug: string; limit: number }) {
    const { slug, limit } = params;
    const audio = await this.audioRepository.findOne({
      where: { slug },
      select: { id: true },
    });

    if (!audio) {
      throw new NotFoundException(`Audio track with slug "${slug}" not found.`);
    }

    try {
      const [result, total] = await Promise.all([
        this.likeRepository.findAll({
          where: { audioId: audio.id },
          include: { user: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
        }),
        this.likeRepository.count({ where: { audioId: audio.id } }),
      ]);

      if (result.length === 0) {
        return {
          success: true,
          message: 'No users have liked this audio track yet.',
          data: [],
        };
      }

      return {
        success: true,
        message: `Found ${result.length} user(s) who liked the audio track.`,
        data: {
          total,
          result,
        },
      };
    } catch (error) {
      console.error('Error fetching users who liked audio:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve users who liked the audio track. Please try again later.',
      );
    }
  }

  async getTopFans(params: { audioId: string; days?: number; limit: number }) {
    const { audioId, limit, days } = params;

    const audioExist = await this.audioRepository.exists({
      id: audioId,
    });
    if (!audioExist) throw new NotFoundException('Audio not found');

    try {
      const grouped = await this.audioPlaysRepository.groupBy({
        by: ['userId'],
        where: {
          audioId,
          playedAt: days
            ? {
                gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
              }
            : undefined,
        },
        _count: {
          userId: true,
        },
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
      });

      const top = grouped.slice(0, limit);

      const fans = await Promise.all(
        top.map(async (g) => {
          const user = await this.usersRepository.findOne({
            where: { id: g.userId },
            select: { id: true, name: true, image: true },
          });

          return {
            user,
            plays: g._count.userId,
          };
        }),
      );

      return {
        success: true,
        message: 'Top fans retrieved successfully',
        data: fans,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to retrieve top fans');
    }
  }

  private async getAudioDuration(buffer: Buffer): Promise<number> {
    try {
      const mm = await import('music-metadata');
      const metadata = await mm.parseBuffer(buffer, 'audio/mpeg');
      return metadata.format.duration ?? 0;
    } catch {
      throw new BadRequestException('Invalid audio file');
    }
  }
}
