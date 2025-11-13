import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAdminToUsers1762914689363 implements MigrationInterface {
    name = 'AddIsAdminToUsers1762914689363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_admin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_admin"`);
    }

}
