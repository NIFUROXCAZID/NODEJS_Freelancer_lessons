import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProjectCancelledStatus1785247438823 implements MigrationInterface {
  name = 'RemoveProjectCancelledStatus1785247438823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`projects\`
      CHANGE \`status\` \`status\`
      enum ('ACTIVE', 'COMPLETED')
      NOT NULL
      DEFAULT 'ACTIVE'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`projects\`
      CHANGE \`status\` \`status\`
      enum ('ACTIVE', 'COMPLETED', 'CANCELLED')
      NOT NULL
      DEFAULT 'ACTIVE'
    `);
  }
}
