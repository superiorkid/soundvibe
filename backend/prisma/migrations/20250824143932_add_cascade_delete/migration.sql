-- DropForeignKey
ALTER TABLE "public"."like" DROP CONSTRAINT "like_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."like" DROP CONSTRAINT "like_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."like" ADD CONSTRAINT "like_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
