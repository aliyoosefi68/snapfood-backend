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
  UploadDocsDto,
} from "./dto/supplier.dto";

import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CheckOtpDto, SendOtpDto } from "../auth/dto/otp.dto";
import { SupplierGuard } from "src/common/decorators/auth.decorator";
import { UploadFileFieldsS3 } from "src/common/interceptors/upload-file.intrceptores";
import { FormType } from "src/common/enum/form-type.enum";

@Controller("supplier")
@ApiTags("Suppliers")
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post("/send-otp")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  sendOtp(@Body() otpDto: SendOtpDto) {
    return this.supplierService.sendOtp(otpDto);
  }

  @Post("/signup")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  sinup(@Body() signuoDto: SupplierSignupDto) {
    return this.supplierService.signup(signuoDto);
  }
  @Post("/check-otp")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(checkOtpDto);
  }
  @Post("/supplementary-information")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  @SupplierGuard()
  supplementaryInformation(@Body() infoDto: SupplementaryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }

  @Put("/upload-document")
  @ApiConsumes(FormType.Multipart)
  @UseInterceptors(
    UploadFileFieldsS3([
      { name: "acceptedDoc", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ])
  )
  @SupplierGuard()
  uploadDocument(@Body() infoDto: UploadDocsDto, @UploadedFiles() files: any) {
    return this.supplierService.UploadDocument(files);
  }
}
