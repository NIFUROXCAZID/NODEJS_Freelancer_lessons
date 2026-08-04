import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTasksTable1784294971768 implements MigrationInterface {
    name = 'CreateTasksTable1784294971768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(150) NOT NULL, \`description\` text NOT NULL, \`priority\` enum ('LOW', 'MEDIUM', 'HIGH') NOT NULL DEFAULT 'MEDIUM', \`status\` enum ('TODO', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'TODO', \`desiredDeadline\` datetime NOT NULL, \`completedAt\` datetime NULL, \`projectId\` int NOT NULL, \`assignedWorkerId\` int NOT NULL, \`createdById\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`completedAt\` \`completedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_e08fca67ca8966e6b9914bf2956\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_a97a2076b94b4282fa869286af9\` FOREIGN KEY (\`assignedWorkerId\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_660898d912c6e71107e9ef8f38d\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_660898d912c6e71107e9ef8f38d\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_a97a2076b94b4282fa869286af9\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_e08fca67ca8966e6b9914bf2956\``);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`completedAt\` \`completedAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`tasks\``);
    }

}
