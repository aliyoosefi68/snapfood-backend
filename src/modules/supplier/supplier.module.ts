import { Module } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { SupplierController } from "./supplier.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SupplierEntity } from "./entities/supplier.entity";
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { SupplierOTPEntity } from "./entities/otp.entity";
import { JwtService } from "@nestjs/jwt";
import { S3Service } from "../s3/s3.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      SupplierOTPEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, CategoryService, JwtService, S3Service],
  exports: [SupplierService, JwtService, S3Service, TypeOrmModule],
})
export class SupplierModule {}
