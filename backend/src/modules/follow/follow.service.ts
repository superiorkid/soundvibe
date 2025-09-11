import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class FollowService {
  protected readonly logger = new Logger(FollowService.name);

  constructor(
    private followRepository: FollowRepository,
    private userRepository: UsersRepository,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId)
      throw new BadRequestException('You cannot follow your self');

    const existingFollow = await this.followRepository.exists({
      followerId_followingId: { followerId, followingId },
    });
    if (existingFollow)
      throw new ConflictException('You are already following this user');

    try {
      await this.followRepository.create({
        data: {
          follower: { connect: { id: followerId } },
          following: { connect: { id: followingId } },
        },
      });

      return {
        success: true,
        message: 'Successfully followed the user.',
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to follow user :: ${(error as Error).message}`,
      );
    }
  }

  async unfollow(followerId: string, followingId: string) {
    if (followerId === followingId)
      throw new BadRequestException('You cannot unfollow yourself.');

    const followRecord = await this.followRepository.findOne({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (!followRecord)
      throw new NotFoundException('You are not following this user.');

    try {
      await this.followRepository.delete({ where: { id: followRecord.id } });
      return {
        success: true,
        message: 'Successfully unfollow user',
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to unfollow user :: ${(error as Error).message}`,
      );
    }
  }

  async getFollowers(userId: string) {
    const userRecord = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userRecord) throw new NotFoundException('User not found');

    try {
      const followers = await this.followRepository.findAll({
        where: { followingId: userId },
        include: { follower: true },
      });

      return {
        success: true,
        message: 'get followers successfully',
        data: followers,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get followers :: ${(error as Error).message}`,
      );
    }
  }

  async getFollowing(userId: string) {
    const userRecord = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!userRecord) throw new NotFoundException('User not found');

    try {
      const following = await this.followRepository.findAll({
        where: { followingId: userId },
        include: { following: true },
      });

      return {
        success: true,
        message: 'get following successfully',
        data: following,
      };
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(
        `Failed to get following :: ${(error as Error).message}`,
      );
    }
  }
}
