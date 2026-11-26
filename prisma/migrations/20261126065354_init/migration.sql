-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `book_author` TEXT NOT NULL,
    `author_from_caimif` TEXT NOT NULL,
    `other_authors` TEXT NULL,
    `publisher` VARCHAR(191) NULL,
    `indexing` VARCHAR(191) NULL,
    `quartile` VARCHAR(191) NULL,
    `weblink` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `books_year_idx`(`year`),
    INDEX `books_domain_idx`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book_chapters` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `chapter_title` TEXT NOT NULL,
    `book_name` TEXT NOT NULL,
    `author_from_caimif` TEXT NOT NULL,
    `other_authors` TEXT NULL,
    `publisher` VARCHAR(191) NULL,
    `indexing` VARCHAR(191) NULL,
    `quartile` VARCHAR(191) NULL,
    `weblink` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `book_chapters_year_idx`(`year`),
    INDEX `book_chapters_domain_idx`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conferences` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `author_from_caimif` TEXT NOT NULL,
    `other_authors` TEXT NULL,
    `conference_name` TEXT NOT NULL,
    `publisher` VARCHAR(191) NULL,
    `indexing` VARCHAR(191) NULL,
    `quartile` VARCHAR(191) NULL,
    `weblink` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `conferences_year_idx`(`year`),
    INDEX `conferences_domain_idx`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `galleries` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_images` (
    `id` VARCHAR(191) NOT NULL,
    `image` TEXT NOT NULL,
    `description` TEXT NULL,
    `gallery_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `gallery_images_gallery_id_idx`(`gallery_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journals` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `author_from_caimif` TEXT NOT NULL,
    `other_authors` TEXT NULL,
    `journal_name` TEXT NOT NULL,
    `publisher` VARCHAR(191) NULL,
    `indexing` VARCHAR(191) NULL,
    `quartile` VARCHAR(191) NULL,
    `weblink` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `journals_year_idx`(`year`),
    INDEX `journals_domain_idx`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patents` (
    `id` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `status` ENUM('PUBLISHED', 'GRANTED') NOT NULL,
    `name_of_inventors` TEXT NOT NULL,
    `patent_agency` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `grant_number` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `patents_grant_number_key`(`grant_number`),
    INDEX `patents_title_idx`(`title`(255)),
    INDEX `patents_year_idx`(`year`),
    INDEX `patents_domain_idx`(`domain`),
    INDEX `patents_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_domain_fields` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` ENUM('TEXT', 'TEXTAREA', 'NUMBER', 'URL', 'FILE', 'DATE', 'SELECT', 'EMAIL') NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `placeholder` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `is_system` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `research_domain_fields_name_key`(`name`),
    INDEX `research_domain_fields_sort_order_idx`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `research_domains` (
    `id` VARCHAR(191) NOT NULL,
    `image` TEXT NULL,
    `title` VARCHAR(191) NOT NULL,
    `short_description` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `custom_fields` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `research_domains_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` VARCHAR(191) NOT NULL,
    `image_key` TEXT NULL,
    `category` ENUM('HEAD', 'PROFESSOR', 'PHD_SCHOLAR', 'ALUMNI') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `designation` VARCHAR(191) NULL,
    `about` TEXT NULL,
    `school` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `qualification` TEXT NULL,
    `area_of_interest` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `team_email_key`(`email`),
    INDEX `team_category_idx`(`category`),
    INDEX `team_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gallery_images` ADD CONSTRAINT `gallery_images_gallery_id_fkey` FOREIGN KEY (`gallery_id`) REFERENCES `galleries`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
