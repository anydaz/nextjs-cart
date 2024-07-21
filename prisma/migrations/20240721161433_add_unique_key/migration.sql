/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `CartItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_id,product_id]` on the table `TemporaryCartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "deleted_at";

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_user_id_product_id_key" ON "CartItem"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "TemporaryCartItem_session_id_product_id_key" ON "TemporaryCartItem"("session_id", "product_id");
