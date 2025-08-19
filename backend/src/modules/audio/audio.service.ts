import { UserSession } from '@mguay/nestjs-better-auth';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import path from 'node:path';
import slugify from 'slugify';
import { DatabaseService } from 'src/shared/database/database.service';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { AudioRepository } from './audio.repository';
import { UploadAudioDTO } from './dto/upload-audio.dto';

@Injectable()
export class AudioService {
  constructor(
    private audioRepository: AudioRepository,
    private fileUploadService: FileUploadService,
    private databaseService: DatabaseService,
  ) {}

  async uploadTrack(uploadAudioDto: UploadAudioDTO, session: UserSession) {
    const audioSlug = slugify(uploadAudioDto.title);

    const audio = await this.audioRepository.findOneBySlug(audioSlug);
    if (audio)
      throw new ConflictException('Audio with this title already exists.');

    let savedAudioFile: string | null = null;
    let savedCoverFile: string | null = null;

    try {
      return await this.databaseService.$transaction(async (trx) => {
        const audioExtension =
          path.extname(uploadAudioDto.audioFile.originalName) || '.mp3';
        savedAudioFile = await this.fileUploadService.upload(
          uploadAudioDto.audioFile.buffer,
          `${audioSlug}${audioExtension}`,
        );

        const duration = await this.getAudioDuration(
          uploadAudioDto.audioFile.buffer,
        );

        if (uploadAudioDto.cover) {
          const coverExtension =
            path.extname(uploadAudioDto.cover.originalName) || '.png';
          savedCoverFile = await this.fileUploadService.upload(
            uploadAudioDto.cover.buffer,
            `${audioSlug}-cover${coverExtension}`,
          );
        }

        const newAudio = await trx.audio.create({
          data: {
            duration,
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

        // if (uploadAudioDto.additionalTags?.length) {
        //   const tagsData = uploadAudioDto.additionalTags.map((tag) => ({
        //     name: tag,
        //     audioId: newAudio.id,
        //   }));

        //   await trx.tag.createMany({ data: tagsData });
        // }

        return {
          success: true,
          message: 'upload track successfully',
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong ::',
        (error as Error).message,
      );
    }
  }

  async detailAudio(id: string) {
    try {
      const audio = await this.audioRepository.findOne(
        { id },
        {
          user: true,
          tags: true,
          audioFile: true,
          coverFile: true,
          genre: true,
          _count: true,
        },
      );
      if (!audio) throw new NotFoundException('');

      return {
        data: audio,
        success: true,
        message: 'get detail audio successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
    }
  }

  async detailAudioBySlug(slug: string) {
    try {
      const audio = await this.audioRepository.findOne(
        { slug },
        {
          user: true,
          tags: true,
          audioFile: true,
          coverFile: true,
          genre: true,
          _count: true,
        },
      );
      if (!audio) throw new NotFoundException('');

      return {
        data: audio,
        success: true,
        message: 'get detail audio successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
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
