import { PrismaClient } from '@prisma/client';
import { IncomingMessage } from 'http';

export interface Context {
    req: IncomingMessage;
    prisma: PrismaClient;
    user?: any;
    token?: string | null;
  }
  