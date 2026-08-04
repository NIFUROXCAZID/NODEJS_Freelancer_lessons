import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTaskStatuses1784711495894 implements MigrationInterface {
    name = 'UpdateTaskStatuses1784711495894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`completedAt\` \`completedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`status\` \`status\` enum ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE') NOT NULL DEFAULT 'TODO'`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`completedAt\` \`completedAt\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`completedAt\` \`completedAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`status\` \`status\` enum ('TODO', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT ''TODO''`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`completedAt\` \`completedAt\` datetime NULL DEFAULT 'NULL'`);
    }

}
