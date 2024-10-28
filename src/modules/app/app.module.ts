import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { CategoryModule } from "../category/category.module";
import { AuthModule } from "../auth/auth.module";
import { SupplierModule } from "../supplier/supplier.module";
import { MenuModule } from "../menu/menu.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    CategoryModule,
    AuthModule,
    SupplierModule,
    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
