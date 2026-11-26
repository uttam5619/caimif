-- AlterTable
ALTER TABLE `patents` MODIFY `year` INTEGER NULL,
    MODIFY `domain` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PUBLISHED', 'GRANTED') NULL,
    MODIFY `name_of_inventors` TEXT NULL,
    MODIFY `patent_agency` VARCHAR(191) NULL,
    MODIFY `country` VARCHAR(191) NULL;
