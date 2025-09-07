import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommentRepository } from '../comment/comment.repository';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);

  constructor(
    private userRepository: UsersRepository,
    private commentRepository: CommentRepository,
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
        'Failed to retrieve recent liked tracks.',
      );
    }
  }
}
