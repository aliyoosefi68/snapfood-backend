import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BasketService } from "../bascket/bascket.service";
import { ZarinpalService } from "../http/zarinpal.service";
import { OrderService } from "../order/order.service";
import { PaymentDataDto, PaymentDto } from "./dto/payment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "./entity/payment.entity";
import { Repository } from "typeorm";
import { randomInt } from "crypto";
import { OrderStatus } from "../order/status.enum";

@Injectable({ scope: Scope.REQUEST })
export class PaymentService {
  constructor(
    @Inject(REQUEST) private req: Request,
    private basketService: BasketService,
    private zarinpalService: ZarinpalService,
    private orderService: OrderService,

    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>
  ) {}
  async getGatewayURL(paymentDto: PaymentDto) {
    const { id: userId, email, mobile } = this.req.user;
    const basket = await this.basketService.getBasket();
    const order = await this.orderService.create(basket, paymentDto);
    const payment = await this.create({
      amount: basket.payment_amount,
      orderId: order.id,
      status: basket.payment_amount === 0,
      userId,
      invoice_number: new Date().getTime().toString() + randomInt.toString(),
    });
    if (payment.status) {
      const { authority, code, gatewayURL } =
        await this.zarinpalService.sendRequest({
          amount: basket.payment_amount,
          description: "payment order",
          user: { email: "ali@gamil.com", mobile: "09016712219" },
        });

      payment.authority = authority;

      await this.paymentRepository.save(payment);

      return {
        gatewayURL,
        code,
      };
    }
    return {
      message: "payment successfully",
    };
  }
  async create(paymentDto: PaymentDataDto) {
    const { invoice_number, amount, orderId, status, userId } = paymentDto;
    const payment = this.paymentRepository.create({
      invoice_number,
      amount,
      orderId,
      status,
      userId,
    });
    return await this.paymentRepository.save(payment);
  }

  async verify(authority: string, statuse: string) {
    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException("not found this payment");
    if (payment.status) throw new ConflictException("already payment verify");
    if (statuse == "OK") {
      const order = await this.orderService.findOne(payment.orderId);
      order.status = OrderStatus.Paid;
      await this.orderService.save(order);
      payment.status = true;
    } else {
      return "http://frontendurl.com/payment?status=failed";
    }

    await this.paymentRepository.save(payment);
    return "http://frontendurl.com/payment?status=success";
  }
}
