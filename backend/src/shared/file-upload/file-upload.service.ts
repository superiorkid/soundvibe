import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadDirectory = join(__dirname, '..', '..', 'uploads');

  constructor() {
    this.createUploadDir();
  }

  async upload() {}

  async remove() {}

  createUploadDir(): void {
    if (!existsSync(this.uploadDirectory)) {
      mkdirSync(this.uploadDirectory, { recursive: true });
    }
  }

  getFullPath(relativePath: string): string {
    return join(this.uploadDirectory, relativePath);
  }
}
