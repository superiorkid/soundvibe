import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AudioRepository } from '../audio/audio.repository';
import { RepostRepository } from './repost.repository';

@Injectable()
export class RepostService {
  protected logger = new Logger(RepostService.name);

  constructor(
    private repostRepository: RepostRepository,
    private audioRepository: AudioRepository,
  ) {}

  async repost(params: { audioId: string; userId: string }) {
    const { audioId, userId } = params;

    const audioExist = await this.audioRepository.exists({ id: audioId });
    if (!audioExist) throw new NotFoundException('');

    const alreadyRepost = await this.repostRepository.exists({
      userId_audioId: { audioId, userId },
    });
    if (alreadyRepost) throw new ConflictException();

    try {
      await Promise.all([
        this.repostRepository.create({
          data: {
            audio: { connect: { id: audioId } },
            user: { connect: { id: userId } },
          },
        }),
        this.audioRepository.update({
          where: { id: audioId },
          data: { repostsCount: { increment: 1 } },
        }),
      ]);

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }

  async undoRepost(params: { audioId: string; userId: string }) {
    const { audioId, userId } = params;

    const audioExist = await this.audioRepository.exists({ id: audioId });
    if (!audioExist) throw new NotFoundException();

    const alreadyRepost = await this.repostRepository.findOne({
      where: {
        userId_audioId: { audioId, userId },
      },
    });
    if (!alreadyRepost) throw new BadRequestException();

    try {
      await Promise.all([
        this.repostRepository.delete({ where: { id: alreadyRepost.id } }),
        this.audioRepository.update({
          where: { id: audioId },
          data: { repostsCount: { decrement: 1 } },
        }),
      ]);

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }
}
