import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { CategoryModule } from "../category/category.module";
import { AuthModule } from "../auth/auth.module";
import { SupplierModule } from "../supplier/supplier.module";
import { MenuModule } from "../menu/menu.module";
import { DiscountModule } from "../discount/discount.module";
import { BasketModule } from "../bascket/basket.module";
import { PaymentModule } from "../payment/payment.module";
import { HttpApiModule } from "../http/http.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    CategoryModule,
    AuthModule,
    SupplierModule,
    MenuModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    HttpApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
