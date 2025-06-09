import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionsTable1710000000001
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        from_wallet_id UUID NOT NULL,
        to_wallet_id UUID,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        FOREIGN KEY (from_wallet_id) REFERENCES wallets(id),
        FOREIGN KEY (to_wallet_id) REFERENCES wallets(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE transactions;`);
  }
}
