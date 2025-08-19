import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { existsSync, mkdirSync, unlink } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly uploadDirectory = join(process.cwd(), 'public', 'uploads');

  constructor() {
    this.createUploadDir();
    this.logger.log(`Upload directory: ${this.uploadDirectory}`);
  }

  async upload(buffer: Buffer, filename: string): Promise<string> {
    if (!buffer || !filename) {
      throw new BadRequestException('Invalid file upload');
    }

    const filePath = join(this.uploadDirectory, filename);

    try {
      this.createUploadDir();

      await writeFile(filePath, buffer);
      this.logger.log(`File saved successfully: ${filePath}`);

      return `uploads/${filename}`;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async remove(relativePath: string): Promise<void> {
    const filePath = join(
      this.uploadDirectory,
      relativePath.replace(/^uploads\//, ''),
    );

    if (!existsSync(filePath)) {
      this.logger.warn(`File not found: ${filePath}`);
      return;
    }

    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) {
          this.logger.error(`Failed to delete file: ${err.message}`);
          return reject(err);
        }
        this.logger.log(`File deleted: ${filePath}`);
        resolve();
      });
    });
  }

  createUploadDir(): void {
    try {
      if (!existsSync(this.uploadDirectory)) {
        mkdirSync(this.uploadDirectory, { recursive: true });
        this.logger.log(`Created upload directory: ${this.uploadDirectory}`);
      }
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`);
    }
  }

  getFullPath(relativePath: string): string {
    return join(this.uploadDirectory, relativePath);
  }

  // Helper method to check if directory exists and is writable
  async checkDirectoryPermissions(): Promise<boolean> {
    try {
      const testFile = join(this.uploadDirectory, 'test.txt');
      await writeFile(testFile, 'test');
      unlink(testFile, () => {});
      return true;
    } catch (error) {
      this.logger.error(`Directory permission error: ${error.message}`);
      return false;
    }
  }
}
