import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();

export const context = {
  prisma,
}

const app = express();
app.use(express.json());


app.listen(3100);

export type Context = typeof context;
export { app };