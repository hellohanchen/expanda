/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[handle]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `handle` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- First add the columns as nullable
ALTER TABLE "User" ADD COLUMN "username" TEXT;
ALTER TABLE "User" ADD COLUMN "handle" VARCHAR(30);

-- Update existing users with default values
UPDATE "User" 
SET "username" = COALESCE(name, 'user_' || id),
    "handle" = LOWER(REGEXP_REPLACE(COALESCE(name, 'user_' || id), '[^a-zA-Z0-9]', '_'));

-- Make the columns required and add unique constraints
ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "handle" SET NOT NULL;
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_handle_key" ON "User"("handle");
