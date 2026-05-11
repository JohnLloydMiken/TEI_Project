/*
  Warnings:

  - You are about to drop the column `claimedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `claimedBy` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `notificationDate` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `accountCode` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Customer] DROP CONSTRAINT [Customer_claimedBy_fkey];

-- AlterTable
ALTER TABLE [dbo].[Customer] ALTER COLUMN [depositAmount] DECIMAL(32,16) NULL;
ALTER TABLE [dbo].[Customer] DROP COLUMN [claimedAt],
[claimedBy],
[notificationDate];
ALTER TABLE [dbo].[Customer] ADD [accountCode] NVARCHAR(1000) NOT NULL,
[status] NVARCHAR(1000) NOT NULL CONSTRAINT [Customer_status_df] DEFAULT 'Pending';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
