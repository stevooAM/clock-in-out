-- AlterTable
ALTER TABLE "auth_entity" ADD COLUMN     "method" VARCHAR(20) NOT NULL DEFAULT 'nfc';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "phone" VARCHAR(50);

-- CreateTable
CREATE TABLE "otp_code" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" VARCHAR(255) NOT NULL,

    CONSTRAINT "otp_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "otp_code_userId_idx" ON "otp_code"("userId");

-- CreateIndex
CREATE INDEX "otp_code_code_idx" ON "otp_code"("code");

-- CreateIndex
CREATE INDEX "otp_code_expiresAt_idx" ON "otp_code"("expiresAt");

-- AddForeignKey
ALTER TABLE "otp_code" ADD CONSTRAINT "otp_code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
