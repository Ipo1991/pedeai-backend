import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveComplementAndNeighborhood1762997536930 implements MigrationInterface {
    name = 'RemoveComplementAndNeighborhood1762997536930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "complement"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "neighborhood"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ALTER COLUMN "delivery_fee" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd"`);
        await queryRunner.query(`ALTER TABLE "restaurants" ALTER COLUMN "delivery_fee" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "neighborhood" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD "complement" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd" FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
