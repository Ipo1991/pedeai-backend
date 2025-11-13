import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentsTable1762909370094 implements MigrationInterface {
    name = 'AddPaymentsTable1762909370094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "type" character varying NOT NULL, "card_number" character varying, "expiry" character varying, "cvv" character varying, "name" character varying, "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_427785468fb7d2733f59e7d7d39" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_427785468fb7d2733f59e7d7d39"`);
        await queryRunner.query(`DROP TABLE "payments"`);
    }

}
