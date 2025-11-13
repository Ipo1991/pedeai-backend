import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToProducts1762917200000 implements MigrationInterface {
    name = 'AddCascadeDeleteToProducts1762917200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Remove a constraint antiga
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd"
        `);
        
        // Adiciona a constraint com ON DELETE CASCADE
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd" 
            FOREIGN KEY ("restaurant_id") 
            REFERENCES "restaurants"("id") 
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove a constraint com cascade
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd"
        `);
        
        // Restaura a constraint sem cascade
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD CONSTRAINT "FK_81ac8c38c90887ea5f4a8d160dd" 
            FOREIGN KEY ("restaurant_id") 
            REFERENCES "restaurants"("id")
        `);
    }
}
