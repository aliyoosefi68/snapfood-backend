import { EntityNames } from "src/common/enum/entity-name.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserAdderssEntity } from "./address.entity";
import { OTPEntity } from "./otp.entity";
import { FeedbackEntity } from "src/modules/menu/entities/feedback.entity";

@Entity(EntityNames.User)
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ nullable: true })
  first_name: string;
  @Column({ nullable: true })
  last_name: string;
  @Column({ unique: true })
  mobile: string;
  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, default: false })
  mobile_verify: boolean;

  @Column({ nullable: true, unique: true })
  invite_code: string;
  @Column({ default: 0 })
  score: number;
  @Column({ nullable: true })
  agent_id: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserAdderssEntity, (address) => address.user)
  addressList: UserAdderssEntity;

  @Column({ nullable: true })
  otpId: number;

  @OneToOne(() => OTPEntity, (otp) => otp.user)
  @JoinColumn()
  otp: OTPEntity;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.user)
  feedbacks: FeedbackEntity[];
}
