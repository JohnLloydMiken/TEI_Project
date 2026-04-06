BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'CSD',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[UploadBatch] (
    [id] INT NOT NULL IDENTITY(1,1),
    [fileName] NVARCHAR(1000) NOT NULL,
    [uploadedBy] INT NOT NULL,
    [uploadedAt] DATETIME2 NOT NULL CONSTRAINT [UploadBatch_uploadedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [month] INT NOT NULL,
    [year] INT NOT NULL,
    CONSTRAINT [UploadBatch_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Customer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [accountNo] NVARCHAR(1000) NOT NULL,
    [customerName] NVARCHAR(1000) NOT NULL,
    [address] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phone] NVARCHAR(1000),
    [depositAmount] DECIMAL(32,16) NOT NULL,
    [notificationDate] DATETIME2 NOT NULL,
    [claimedAt] DATETIME2,
    [claimedBy] INT,
    [batchId] INT NOT NULL,
    CONSTRAINT [Customer_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Customer_accountNo_batchId_key] UNIQUE NONCLUSTERED ([accountNo],[batchId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [Customer_batchId_fkey] FOREIGN KEY ([batchId]) REFERENCES [dbo].[UploadBatch]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
