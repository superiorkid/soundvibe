import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AudioRepository } from '../audio/audio.repository';
import { ListeningHistoryRepository } from './listening-history.repository,';

@Injectable()
export class ListeningHistoryService {
  protected readonly logger = new Logger(ListeningHistoryService.name);

  constructor(
    private listeningHistoryRepository: ListeningHistoryRepository,
    private audioRepository: AudioRepository,
  ) {}

  async getListeningHistory(params: {
    take: number;
    userId: string;
    query?: string;
  }) {
    const { userId, take, query } = params;

    try {
      const history = await this.listeningHistoryRepository.findAll({
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
        orderBy: { listenedAt: 'desc' },
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
        take,
      });

      return {
        success: true,
        message:
          history.length > 0
            ? 'Listening history retrieved successfully.'
            : 'No listening history found.',
        data: history.map((record) => ({
          ...record,
          audio: {
            ...record.audio,
            streamUrl: `/api/v1/audio/stream/${record.audioId}`,
          },
        })),
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve listening history for user ${userId}: ${JSON.stringify(
          error,
        )}`,
      );
      throw new InternalServerErrorException(
        'Failed to retrieve listening history.',
      );
    }
  }

  async setListeningHistory(params: { audioId: string; userId: string }) {
    const { audioId, userId } = params;

    const audioExist = await this.audioRepository.exists({ id: audioId });
    if (!audioExist) throw new NotFoundException('Audio not found');

    try {
      const existingInHistory = await this.listeningHistoryRepository.exists({
        userId_audioId: { audioId, userId },
      });

      if (existingInHistory) {
        await this.listeningHistoryRepository.update({
          where: { userId_audioId: { audioId, userId } },
          data: {
            listenedAt: new Date(),
          },
        });
      } else {
        await this.listeningHistoryRepository.create({
          data: {
            audio: { connect: { id: audioId } },
            user: { connect: { id: userId } },
          },
        });
      }

      return {
        success: true,
        message: 'Listening history recorded successfully',
      };
    } catch (error) {
      this.logger.error(`setListeningHistory error: ${JSON.stringify(error)}`);
      throw new InternalServerErrorException(
        'Failed to record listening history',
      );
    }
  }

  async clearListeningHistory(userId: string) {
    try {
      await this.listeningHistoryRepository.deleteMany({ where: { userId } });
      return {
        success: true,
        message: 'clear listening history successfully',
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }
}
