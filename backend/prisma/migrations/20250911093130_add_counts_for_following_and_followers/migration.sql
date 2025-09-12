-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "followers_counts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "following_counts" INTEGER NOT NULL DEFAULT 0;
