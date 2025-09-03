-- CreateEnum
CREATE TYPE "public"."PlaylistTypeEnum" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "public"."playlist" ADD COLUMN     "type" "public"."PlaylistTypeEnum" NOT NULL DEFAULT 'PUBLIC';
