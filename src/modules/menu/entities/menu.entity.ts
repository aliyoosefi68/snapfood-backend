import { EntityNames } from "src/common/enum/entity-name.enum";
import { SupplierEntity } from "src/modules/supplier/entities/supplier.entity";
import {
  Column,
  Double,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TypeEntity } from "./type.entity";
import { FeedbackEntity } from "./feedback.entity";
import { UserBasket } from "src/modules/bascket/entity/basket.entity";
import { OrderItemEntity } from "src/modules/order/entity/order-item.entity";

@Entity(EntityNames.Menu)
export class MenuEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  name: string;
  @Column()
  image: string;
  @Column()
  imageKey: string;
  @Column({ type: "double" })
  price: number;
  @Column({ type: "double", default: 0 })
  discount: number;
  @Column()
  description: string;

  @Column({ type: "double", default: 1 })
  score: string;

  @Column({ default: false })
  is_active: boolean;

  @Column()
  typeId: number;
  @ManyToOne(() => TypeEntity, (type) => type.items)
  type: TypeEntity;

  @Column()
  supplierId: number;
  @ManyToOne(() => SupplierEntity, (supplier) => supplier.menu, {
    onDelete: "CASCADE",
  })
  supplier: SupplierEntity;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.food)
  feedbacks: FeedbackEntity[];

  @OneToMany(() => UserBasket, (basket) => basket.food)
  baskets: UserBasket;

  @OneToMany(() => OrderItemEntity, (order) => order.food)
  orders: OrderItemEntity[];
}
