-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `lguid` INTEGER UNSIGNED NOT NULL,
    `password` BINARY(32) NOT NULL,
    `salt` BINARY(32) NOT NULL,

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_name_key`(`name`),
    UNIQUE INDEX `user_lguid_key`(`lguid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
