import { EntityNames } from "src/common/enum/entity-name.enum";
import { CategoryEntity } from "src/modules/category/entities/category.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SupplierOTPEntity } from "./otp.entity";
import { SupplierStatus } from "../enum/status.enum";

@Entity(EntityNames.Supplier)
export class SupplierEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  manager_name: string;

  @Column()
  manager_family: string;

  @Column()
  store_name: string;

  @Column({ nullable: true })
  national_code: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true, default: SupplierStatus.Registred })
  status: string;

  @Column()
  mobile: string;
  @Column({ nullable: true, default: false })
  mobile_verify: boolean;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.suppliers, {
    onDelete: "SET NULL",
  })
  category: CategoryEntity;

  @Column()
  city: string;

  @Column({ unique: true })
  invite_code: string;

  @Column({ nullable: true })
  agentId: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.subsets)
  agent: SupplierEntity;
  @OneToMany(() => SupplierEntity, (supplier) => supplier.agent)
  subsets: SupplierEntity[];
  @Column({ nullable: true })
  otpId: number;
  @OneToOne(() => SupplierOTPEntity, (otp) => otp.supplier)
  @JoinColumn()
  otp: SupplierOTPEntity;
}
