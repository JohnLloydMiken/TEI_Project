BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CustomerLog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [customerId] INT NOT NULL,
    [action] NVARCHAR(1000) NOT NULL,
    [fromStatus] NVARCHAR(1000) NOT NULL,
    [toStatus] NVARCHAR(1000) NOT NULL,
    [performedBy] INT NOT NULL,
    [performedAt] DATETIME2 NOT NULL CONSTRAINT [CustomerLog_performedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CustomerLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CustomerLog_customerId_idx] ON [dbo].[CustomerLog]([customerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CustomerLog_performedBy_idx] ON [dbo].[CustomerLog]([performedBy]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [CustomerLog_performedAt_idx] ON [dbo].[CustomerLog]([performedAt]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Customer_batchId_idx] ON [dbo].[Customer]([batchId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Customer_status_idx] ON [dbo].[Customer]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Customer_batchId_status_idx] ON [dbo].[Customer]([batchId], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UploadBatch_year_month_idx] ON [dbo].[UploadBatch]([year], [month]);

-- AddForeignKey
ALTER TABLE [dbo].[CustomerLog] ADD CONSTRAINT [CustomerLog_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[Customer]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CustomerLog] ADD CONSTRAINT [CustomerLog_performedBy_fkey] FOREIGN KEY ([performedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
