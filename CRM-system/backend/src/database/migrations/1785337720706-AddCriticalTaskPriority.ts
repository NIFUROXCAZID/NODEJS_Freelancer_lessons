import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCriticalTaskPriority1785337720706 implements MigrationInterface {
  name = 'AddCriticalTaskPriority1785337720706';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`tasks\`
      MODIFY COLUMN \`priority\`
      ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
      NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE \`tasks\`
      SET \`priority\` = 'HIGH'
      WHERE \`priority\` = 'CRITICAL'
    `);

    await queryRunner.query(`
      ALTER TABLE \`tasks\`
      MODIFY COLUMN \`priority\`
      ENUM('LOW', 'MEDIUM', 'HIGH')
      NOT NULL
    `);
  }
}
