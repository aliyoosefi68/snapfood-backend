import { Module } from "@nestjs/common";
import { BasketController } from "./basket.controller";

import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserBasket } from "./entity/basket.entity";
import { DiscountEntity } from "../discount/entity/discount.entity";
import { DiscountService } from "../discount/discount.service";
import { MenuModule } from "../menu/menu.module";
import { BasketService } from "./bascket.service";

@Module({
  imports: [
    AuthModule,
    MenuModule,
    TypeOrmModule.forFeature([UserBasket, DiscountEntity]),
  ],
  controllers: [BasketController],
  providers: [BasketService, DiscountService],
})
export class BasketModule {}
