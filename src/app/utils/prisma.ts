// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const isActiveRecord = { deleted_at: null };

export default prisma;
