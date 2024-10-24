import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "src/modules/auth/guards/auth.guard";
import { SupplierAuthGuard } from "src/modules/supplier/guards/auth.guard";

export function UserGuard() {
  return applyDecorators(ApiBearerAuth("Authorization"), UseGuards(AuthGuard));
}
export function SupplierGuard() {
  return applyDecorators(
    ApiBearerAuth("Authorization"),
    UseGuards(SupplierAuthGuard)
  );
}
