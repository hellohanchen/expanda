/*
  Warnings:

  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.
  - You are about to alter the column `handle` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(18)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "handle" SET DATA TYPE VARCHAR(18);
