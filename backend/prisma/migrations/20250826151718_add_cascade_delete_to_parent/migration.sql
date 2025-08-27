-- DropForeignKey
ALTER TABLE "public"."comment" DROP CONSTRAINT "comment_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
