import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestamp = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, originalUrl, query, body } = req;

    console.log(`[${timestamp}] ${method} ${originalUrl}`);

    if (Object.keys(query).length > 0) {
      console.log('Query Params:', JSON.stringify(query, null, 2));
    }

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      console.log('Request Body:', JSON.stringify(body, null, 2));
    }

    next();
  }
}
