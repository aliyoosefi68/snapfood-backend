import { Module } from "@nestjs/common";
import { SupplierModule } from "../supplier/supplier.module";
import { MenuEntity } from "./entities/menu.entity";
import { TypeEntity } from "./entities/type.entity";
import { FeedbackEntity } from "./entities/feedback.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuTypeController } from "./controllers/type.controller";
import { MenuController } from "./controllers/menu.controller";
import { MenuTypeService } from "./service/type.service";
import { MenuService } from "./service/menu.service";

@Module({
  imports: [
    SupplierModule,
    TypeOrmModule.forFeature([MenuEntity, TypeEntity, FeedbackEntity]),
  ],
  controllers: [MenuController, MenuTypeController],
  providers: [MenuService, MenuTypeService],
  exports: [MenuService, MenuTypeService, TypeOrmModule],
})
export class MenuModule {}
