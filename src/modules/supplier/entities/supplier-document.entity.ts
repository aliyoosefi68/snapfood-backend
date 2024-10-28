import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("supplier_document")
export class SupplierDocumentEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  image: string;
  @Column({ nullable: true })
  document: string;
  @Column({ nullable: true })
  supplierId: number;
}
