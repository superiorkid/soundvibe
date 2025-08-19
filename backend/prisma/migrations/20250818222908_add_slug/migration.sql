/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `audio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `audio` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."audio_title_duration_idx";

-- AlterTable
ALTER TABLE "public"."audio" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "audio_slug_key" ON "public"."audio"("slug");

-- CreateIndex
CREATE INDEX "audio_duration_slug_idx" ON "public"."audio"("duration", "slug");
