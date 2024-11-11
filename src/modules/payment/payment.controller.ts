import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserGuard } from "src/common/decorators/auth.decorator";
import { PaymentService } from "./payment.service";
import { PaymentDto } from "./dto/payment.dto";
import { Response } from "express";

@Controller("payment")
@ApiTags("Payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UserGuard()
  gatewayUrl(@Body() paymentDto: PaymentDto) {
    return this.paymentService.getGatewayURL(paymentDto);
  }

  @Get("/verify")
  async verifyPayment(
    @Query("Authority") authority: string,
    @Query("Status") statuse: string,
    @Res() res: Response
  ) {
    const url = await this.paymentService.verify(authority, statuse);
    return res.redirect(url);
  }
}
