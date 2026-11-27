-- CreateTable
CREATE TABLE `tool_types` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tool_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tools` (
    `id` VARCHAR(191) NOT NULL,
    `image_key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `tool_type_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tools_tool_type_id_idx`(`tool_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tools` ADD CONSTRAINT `tools_tool_type_id_fkey` FOREIGN KEY (`tool_type_id`) REFERENCES `tool_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
