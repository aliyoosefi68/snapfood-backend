import {
  Controller,
  Post,
  Body,
  Put,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
} from "./dto/supplier.dto";

import { ApiTags } from "@nestjs/swagger";
import { CheckOtpDto } from "../auth/dto/otp.dto";
import { SupplierGuard } from "src/common/decorators/auth.decorator";
import { UploadFileFieldsS3 } from "src/common/interceptors/upload-file.intrceptores";

@Controller("supplier")
@ApiTags("Suppliers")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post("/signup")
  sinup(@Body() signuoDto: SupplierSignupDto) {
    return this.supplierService.signup(signuoDto);
  }
  @Post("/check-otp")
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(checkOtpDto);
  }
  @Post("/supplementary-information")
  @SupplierGuard()
  supplementaryInformation(@Body() infoDto: SupplementaryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }

  @Put("/upload-document")
  @UseInterceptors(
    UploadFileFieldsS3([
      { name: "acceptedDoc", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ])
  )
  @SupplierGuard()
  uploadDocument(
    @Body() infoDto: SupplementaryInformationDto,
    @UploadedFiles() files: any
  ) {
    return this.supplierService.UploadDocument(files);
  }
}
