/*
  Warnings:

  - You are about to drop the column `notificationDate` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `accountCode` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Customer] ALTER COLUMN [depositAmount] DECIMAL(32,16) NULL;
ALTER TABLE [dbo].[Customer] DROP COLUMN [notificationDate];
ALTER TABLE [dbo].[Customer] ADD [accountCode] NVARCHAR(1000) NULL;

UPDATE [dbo].[Customer] SET [accountCode] = [accountNo] WHERE [accountCode] IS NULL;
ALTER TABLE [dbo].[Customer] ALTER COLUMN [accountCode] NVARCHAR(1000) NOT NULL;


ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [Customer.isRetained_df] DEFAULT 0  FOR [isRetained];
ALTER TABLE [dbo].[Customer] ALTER COLUMN [isRetained] BIT NOT NULL;







COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
