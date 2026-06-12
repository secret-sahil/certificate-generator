import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as express from 'express';
import { resolve } from 'node:path';

function requireQueuePassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const authHeader = req.headers.authorization;
  const expectedPassword = 'Admin@!123';
  //  process.env.QUEUES_PASSWORD
  if (!authHeader || !expectedPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Queues"');
    res.status(401).send('Authentication required');
    return;
  }

  const [scheme, encodedCredentials] = authHeader.split(' ');

  if (scheme !== 'Basic' || !encodedCredentials) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Queues"');
    res.status(401).send('Authentication required');
    return;
  }

  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString(
    'utf8',
  );
  const separatorIndex = decodedCredentials.indexOf(':');

  if (separatorIndex < 0) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Queues"');
    res.status(401).send('Authentication required');
    return;
  }

  const password = decodedCredentials.slice(separatorIndex + 1);

  if (password !== expectedPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Queues"');
    res.status(401).send('Authentication required');
    return;
  }

  next();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.static(resolve(process.cwd(), 'public')));

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const mailQueue = app.get<Queue>(getQueueToken('mail'));

  createBullBoard({
    queues: [new BullMQAdapter(mailQueue)],
    serverAdapter,
  });

  app.use('/admin/queues', requireQueuePassword);
  app.use('/admin/queues', serverAdapter.getRouter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
