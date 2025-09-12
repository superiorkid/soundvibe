-- CreateTable
CREATE TABLE "public"."follow" (
    "id" TEXT NOT NULL,
    "followed_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "follow_followed_id_following_id_key" ON "public"."follow"("followed_id", "following_id");

-- AddForeignKey
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follow" ADD CONSTRAINT "follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
