-- CreateTable
CREATE TABLE `memorandums` (
    `id` VARCHAR(191) NOT NULL,
    `first_party` VARCHAR(191) NOT NULL,
    `second_party` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `leading_person` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
