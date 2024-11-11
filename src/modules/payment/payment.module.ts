import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { BasketService } from "../bascket/bascket.service";
import { UserBasket } from "../bascket/entity/basket.entity";
import { AuthModule } from "../auth/auth.module";
import { DiscountService } from "../discount/discount.service";
import { OrderEntity } from "../order/entity/order.entity";
import { MenuEntity } from "../menu/entities/menu.entity";
import { TypeEntity } from "../menu/entities/type.entity";
import { UserAdderssEntity } from "../user/entity/address.entity";
import { MenuService } from "../menu/service/menu.service";
import { MenuTypeService } from "../menu/service/type.service";
import { OrderService } from "../order/order.service";
import { S3Service } from "../s3/s3.service";
import { DiscountEntity } from "../discount/entity/discount.entity";
import { ZarinpalService } from "../http/zarinpal.service";
import { HttpService } from "@nestjs/axios";
import { PaymentEntity } from "./entity/payment.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserBasket,
      DiscountEntity,
      OrderEntity,
      MenuEntity,
      TypeEntity,
      PaymentEntity,
      UserAdderssEntity,
    ]),
  ],
  providers: [
    PaymentService,
    BasketService,
    MenuService,
    DiscountService,
    MenuTypeService,
    OrderService,
    S3Service,
  ],
  controllers: [PaymentController],
  exports: [],
})
export class PaymentModule {}
