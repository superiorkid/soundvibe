import { UserSession } from '@mguay/nestjs-better-auth';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { createReadStream, statSync } from 'node:fs';
import path, { join } from 'node:path';
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

    const audio = await this.audioRepository.findOne({
      where: { slug: audioSlug },
    });
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
      if (savedAudioFile) await this.fileUploadService.remove(savedAudioFile);
      if (savedCoverFile) await this.fileUploadService.remove(savedCoverFile);

      throw new InternalServerErrorException(
        'Something went wrong ::',
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
          _count: true,
        },
      });
      if (!audio) throw new NotFoundException('');

      return {
        data: {
          ...audio,
          audioFile: {
            ...audio.audioFile,
            streamUrl: `/api/audio/stream/${audio.id}`,
          },
        },
        success: true,
        message: 'get detail audio successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('');
    }
  }

  async allAudios() {
    try {
      const audios = await this.audioRepository.findAll({
        orderBy: { createdAt: 'desc' },
        include: {
          audioFile: true,
          user: true,
          genre: true,
          tags: true,
          coverFile: true,
        },
      });

      const enrichedAudios = audios.map((audio) => ({
        ...audio,
        streamUrl: `/api/audio/stream/${audio.id}`,
      }));

      return {
        success: true,
        message: '',
        data: enrichedAudios,
      };
    } catch {
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
          _count: true,
        },
      });
      if (!audio) throw new NotFoundException('');

      return {
        data: {
          ...audio,
          audioFile: {
            ...audio.audioFile,
            streamUrl: `/api/audio/stream/${audio.id}`,
          },
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
