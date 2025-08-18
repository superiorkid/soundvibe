/*
  Warnings:

  - The primary key for the `tag` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."tag" DROP CONSTRAINT "tag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "tag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tag_id_seq";
