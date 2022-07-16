import { PrismaClient } from "@prisma/client";

export interface Context {
  prismaClient: PrismaClient;
}