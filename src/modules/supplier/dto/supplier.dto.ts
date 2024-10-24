import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsIdentityCard,
  IsMobilePhone,
  Length,
} from "class-validator";

export class CreateSupplierDto {}
export class SupplierSignupDto {
  @ApiProperty()
  categoryId: number;
  @ApiProperty()
  @Length(3, 50)
  store_name: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  @Length(3, 50)
  manager_name: string;
  @ApiProperty()
  @Length(3, 50)
  manager_family: string;
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: "mobile number is invalid" })
  mobile: string;
  @ApiPropertyOptional()
  invite_code: string;
}

export class SupplementaryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsIdentityCard("IR")
  national_code: string;
}
