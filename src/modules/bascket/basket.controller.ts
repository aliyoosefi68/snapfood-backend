import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";

import { BasketDto, DiscountBasketDto } from "./dto/basket.dto";
import { UserGuard } from "src/common/decorators/auth.decorator";
import { FormType } from "src/common/enum/form-type.enum";
import { BasketService } from "./bascket.service";

@Controller("basket")
@ApiTags("Basket")
@UserGuard()
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }
  @Post("/discount")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  addDiscountToBasket(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.addDiscount(discountDto);
  }
  @Delete()
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }
  @Delete("/discount")
  @ApiConsumes(FormType.UrlEncoded, FormType.Json)
  removeDiscountFromBasket(@Body() discountDto: DiscountBasketDto) {
    return this.basketService.removeDiscount(discountDto);
  }
  @Get()
  getBasket() {
    return this.basketService.getBasket();
  }
}
