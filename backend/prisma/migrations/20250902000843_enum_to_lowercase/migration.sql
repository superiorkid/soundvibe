/*
  Warnings:

  - The values [PUBLIC,PRIVATE] on the enum `PlaylistTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PlaylistTypeEnum_new" AS ENUM ('public', 'private');
ALTER TABLE "public"."playlist" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."playlist" ALTER COLUMN "type" TYPE "public"."PlaylistTypeEnum_new" USING ("type"::text::"public"."PlaylistTypeEnum_new");
ALTER TYPE "public"."PlaylistTypeEnum" RENAME TO "PlaylistTypeEnum_old";
ALTER TYPE "public"."PlaylistTypeEnum_new" RENAME TO "PlaylistTypeEnum";
DROP TYPE "public"."PlaylistTypeEnum_old";
ALTER TABLE "public"."playlist" ALTER COLUMN "type" SET DEFAULT 'public';
COMMIT;

-- AlterTable
ALTER TABLE "public"."playlist" ALTER COLUMN "type" SET DEFAULT 'public';
