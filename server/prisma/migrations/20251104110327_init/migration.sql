-- CreateTable
CREATE TABLE "user" (
    "uid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255),

    CONSTRAINT "user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "user_schedule" (
    "id" SERIAL NOT NULL,
    "day" VARCHAR(50) NOT NULL,
    "hour" VARCHAR(50) NOT NULL,
    "room" VARCHAR(100) NOT NULL,
    "userUid" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_entity" (
    "id_key" SERIAL NOT NULL,
    "reader" VARCHAR(50) NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "userUid" VARCHAR(255) NOT NULL,

    CONSTRAINT "auth_entity_pkey" PRIMARY KEY ("id_key")
);

-- CreateIndex
CREATE INDEX "user_schedule_userUid_idx" ON "user_schedule"("userUid");

-- CreateIndex
CREATE INDEX "auth_entity_userUid_idx" ON "auth_entity"("userUid");

-- CreateIndex
CREATE INDEX "auth_entity_timestamp_idx" ON "auth_entity"("timestamp");

-- AddForeignKey
ALTER TABLE "user_schedule" ADD CONSTRAINT "user_schedule_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_entity" ADD CONSTRAINT "auth_entity_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
