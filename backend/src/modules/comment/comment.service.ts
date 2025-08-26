import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CommentDTO } from './comment.dto';
import { AudioRepository } from '../audio/audio.repository';

@Injectable()
export class CommentService {
  protected logger = new Logger(CommentService.name);

  constructor(
    private commentRepository: CommentRepository,
    private audioRepository: AudioRepository,
  ) {}

  async getComments(audioId: string) {
    try {
      const [comments, total] = await Promise.all([
        this.commentRepository.findAll({
          where: { audioId },
          include: {
            user: true,
            commentLikes: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.commentRepository.count({ where: { audioId } }),
      ]);

      type CommentWithRelations = (typeof comments)[number] & {
        replies: CommentWithRelations[];
      };

      const map = new Map<string, CommentWithRelations>();
      const roots: CommentWithRelations[] = [];

      for (const c of comments) {
        map.set(c.id, { ...c, replies: [] });
      }

      for (const c of comments) {
        const node = map.get(c.id)!;
        if (c.parentId) {
          const parent = map.get(c.parentId);
          if (parent) parent.replies.push(node);
        } else {
          roots.push(node);
        }
      }

      // recursive sort to ensure replies are also sorted
      const sortReplies = (nodes: CommentWithRelations[]) => {
        nodes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        for (const n of nodes) {
          if (n.replies.length > 0) {
            sortReplies(n.replies);
          }
        }
      };

      sortReplies(roots);

      return {
        success: true,
        message: '',
        data: {
          total,
          comments: roots,
        },
      };
    } catch (error) {
      this.logger.error('getComments error', error);
      throw new InternalServerErrorException('Failed to fetch comments');
    }
  }
  async createComment(params: {
    audioId: string;
    commentDto: CommentDTO;
    userId: string;
  }) {
    const { audioId, commentDto, userId } = params;

    const audio = await this.audioRepository.exists({ id: audioId });
    if (!audio) throw new NotFoundException('');

    try {
      await this.commentRepository.create({
        data: {
          content: commentDto.content,
          timestamp: commentDto.timestamp,
          audio: { connect: { id: audioId } },
          user: { connect: { id: userId } },
          parent: commentDto.parentId
            ? { connect: { id: commentDto.parentId } }
            : undefined,
        },
      });

      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      console.log(JSON.stringify(error));
      throw new InternalServerErrorException();
    }
  }

  async deleteComment(params: { audioId: string; commentId: string }) {
    const { audioId, commentId } = params;

    const commentExists = await this.commentRepository.exists({
      id: commentId,
      audioId,
    });
    if (!commentExists) throw new NotFoundException('');

    try {
      await this.commentRepository.delete({ where: { id: commentId } });
      return {
        success: true,
        message: '',
      };
    } catch (error) {
      this.logger.log(JSON.stringify(error));
      throw new InternalServerErrorException('');
    }
  }
}
